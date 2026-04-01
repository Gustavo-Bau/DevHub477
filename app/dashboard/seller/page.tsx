import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/auth/login?callbackUrl=/dashboard/seller');
  if (session.user.role !== 'seller') redirect(`/dashboard/${session.user.role}`);

  return (
    <main>
      <h1>Seller Dashboard</h1>
      <p>Welcome back, {session.user.name ?? session.user.email}.</p>
      <p>Manage listings, track sales metrics, and handle customer orders.</p>
    </main>
  );
}
