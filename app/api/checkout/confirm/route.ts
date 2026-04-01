import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

async function sendConfirmationEmail(email: string, orderId: string, total: number) {
  if (!process.env.RESEND_API_KEY || !process.env.ORDER_FROM_EMAIL) {
    console.warn('Missing email configuration; skipping confirmation email');
    return;
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.ORDER_FROM_EMAIL,
      to: email,
      subject: `Order confirmation #${orderId}`,
      html: `<p>Thanks for your purchase!</p><p>Order ID: ${orderId}</p><p>Total: $${total.toFixed(2)}</p>`,
    }),
  });
}

export async function POST(request: Request) {
  try {
    const { sessionId } = (await request.json()) as { sessionId?: string };
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({ where: { stripeSessionId: sessionId } });
    if (existing) {
      return NextResponse.json({ orderId: existing.id, alreadyProcessed: true });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed.' }, { status: 400 });
    }

    const rawCart = session.metadata?.cart ?? '[]';
    const items = JSON.parse(rawCart) as Array<{ id: string; title: string; quantity: number; price: number }>;
    const taxRate = Number(session.metadata?.taxRate ?? '0.08');
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    const order = await prisma.order.create({
      data: {
        userId: session.metadata?.userId || null,
        email: session.customer_details?.email ?? session.customer_email ?? 'unknown@example.com',
        totalAmount,
        taxAmount,
        paymentMethod: session.payment_method_types?.[0] ?? 'card',
        paymentStatus: session.payment_status,
        stripeSessionId: session.id,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            title: item.title,
            quantity: item.quantity,
            unitPrice: item.price,
            lineTotal: item.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    await sendConfirmationEmail(order.email, order.id, order.totalAmount);

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('Failed confirming checkout', error);
    return NextResponse.json({ error: 'Failed to finalize order.' }, { status: 500 });
  }
}
