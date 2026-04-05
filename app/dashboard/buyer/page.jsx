import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';

export default async function BuyerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/auth/login?callbackUrl=/dashboard/buyer');
  if (session.user.role !== 'buyer') redirect(`/dashboard/${session.user.role}`);

  return (
    <main>
      <h1>Buyer Dashboard</h1>
      <p>Welcome back, {session.user.name ?? session.user.email}.</p>
      <p>Browse products, review orders, and manage your purchasing activity.</p>
    </main>
  );
}
