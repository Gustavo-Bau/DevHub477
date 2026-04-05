import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';

export async function requireSellerSession(callbackUrl = '/seller/products') {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (!['seller', 'freelancer'].includes(session.user.role)) {
    redirect(`/dashboard/${session.user.role}`);
  }

  return session;
}
