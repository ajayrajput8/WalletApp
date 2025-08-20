'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, IndianRupee } from 'lucide-react';

interface WalletCardProps {
  balance: number;
  loading?: boolean;
}

export function WalletCard({ balance, loading }: WalletCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-center">
          {loading ? (
            <div className="animate-pulse bg-gray-300 rounded w-24 h-8"></div>
          ) : (
            <>
              <IndianRupee className="h-6 w-6" />
              {balance.toFixed(2)}
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Available balance
        </p>
      </CardContent>
    </Card>
  );
}