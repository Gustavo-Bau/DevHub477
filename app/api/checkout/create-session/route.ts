import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { stripe } from '@/lib/stripe';

type CheckoutItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  type: 'product' | 'service';
};

export async function POST(request: Request) {
  try {
    const { items, paymentMethod, taxRate } = (await request.json()) as {
      items: CheckoutItem[];
      paymentMethod: 'card' | 'bank_transfer';
      taxRate?: number;
    };

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          metadata: { itemId: item.id, itemType: item.type },
        },
      },
    }));

    const computedTaxRate = typeof taxRate === 'number' ? taxRate : 0.08;
    const taxAmount = items.reduce((acc, item) => acc + item.price * item.quantity * computedTaxRate, 0);
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(taxAmount * 100),
        product_data: {
          name: 'Sales Tax',
          metadata: { itemId: 'tax', itemType: 'product' },
        },
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      customer_email: session?.user?.email ?? undefined,
      payment_method_types: paymentMethod === 'bank_transfer' ? ['us_bank_account'] : ['card'],
      metadata: {
        cart: JSON.stringify(items),
        taxRate: String(computedTaxRate),
        userId: session?.user?.id ?? '',
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Failed creating Stripe session', error);
    return NextResponse.json({ error: 'Failed to initialize checkout.' }, { status: 500 });
  }
}
