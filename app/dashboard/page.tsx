'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/AuthGuard';
import { WalletCard } from '@/components/WalletCard';
import { TransferForm } from '@/components/TransferForm';
import { TransactionHistory } from '@/components/TransactionHistory';
import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet: {
    balance: number;
  };
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferComplete = () => {
    fetchProfile();
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRefresh = () => {
    fetchProfile();
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Welcome, {profile?.name || 'User'}
                </h1>
                <p className="text-sm text-gray-600">{profile?.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-6">
              <WalletCard
                balance={profile?.wallet?.balance || 0}
                loading={loading}
              />
              <TransferForm onTransferComplete={handleTransferComplete} />
            </div>

            <div className="md:col-span-1 lg:col-span-2">
              <TransactionHistory refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}