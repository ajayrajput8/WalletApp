'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Send, Shield, Smartphone } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGetStarted = () => {
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Wallet className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">WalletApp</h1>
            </div>
            <Button onClick={handleGetStarted}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Send Money
            <span className="block text-primary">Instantly & Securely</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transfer money to anyone using just their phone number. Fast, secure, and simple.
            Get started with ₹100 welcome bonus!
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose WalletApp?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
                  <Send className="h-8 w-8" />
                </div>
                <CardTitle>Instant Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Send money instantly using just a phone number. No complicated account details needed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle>Bank-Level Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Your money and data are protected with enterprise-grade security and encryption.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-fit mx-auto mb-4">
                  <Smartphone className="h-8 w-8" />
                </div>
                <CardTitle>Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Simple, intuitive interface designed for everyone. Send money in just a few taps.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who trust WalletApp for their daily transactions.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
            Sign Up Now - Get ₹100 Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2025 WalletApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}