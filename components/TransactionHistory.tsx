'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, ArrowUpRight, ArrowDownLeft, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  description?: string;
  status: string;
  createdAt: string;
  fromUser: { id: string; name: string; phone: string ,firebaseUid: string};
  toUser: { id: string; name: string; phone: string ,firebaseUid: string};
  fromUserId: string;
  toUserId: string;
}

interface TransactionHistoryProps {
  refreshTrigger: number;
}

export function TransactionHistory({ refreshTrigger }: TransactionHistoryProps) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [user, refreshTrigger]);

  const fetchTransactions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/transfers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: Transaction[] = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const isReceived = transaction.toUser.firebaseUid === user?.uid;
              console.log(transaction.toUserId, user?.uid);
              const otherUser = isReceived ? transaction.fromUser : transaction.toUser;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      isReceived ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {isReceived ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">
                        {isReceived ? 'Received from' : 'Sent to'} {otherUser.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{otherUser.phone}</p>
                      {transaction.description && (
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center font-semibold ${
                      isReceived ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isReceived ? '+' : '-'}
                      <IndianRupee className="h-4 w-4" />
                      {transaction.amount.toFixed(2)}
                    </div>
                    <Badge variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {transaction.status.toLowerCase()}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
