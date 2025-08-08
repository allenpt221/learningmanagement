'use client';

import { useState } from 'react';
import { Signup } from '@/server-action/auth.action';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleCheckBig, CircleX } from 'lucide-react';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await Signup(formData);

      if (result.success) {
        setSuccess(true);
        setError('');
        form.reset();
      } else {
        setError(result.message || 'Signup failed');
        setSuccess(false);
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      setError("Something went wrong.");
      setSuccess(false);
    }

    // ✅ Clear messages after 3s (AFTER request finishes)
    setTimeout(() => {
      setError('');
      setSuccess(false);
    }, 3000);
  };


  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your information below to create your account and get started.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
          />
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md px-6 py-4 shadow-lg rounded-xl border border-red-300 bg-red-50"
          >
            <div className="flex items-start gap-4">
              <CircleX className="text-red-600 mt-1" />
              <div className="flex-1">
                <AlertTitle className="text-red-800 font-semibold text-sm">
                  Unable to process your sign up
                </AlertTitle>
                <AlertDescription className="text-red-700 text-sm mt-1">
                  {error}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {success && (
          <Alert
            variant="default"
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md px-6 py-4 shadow-lg rounded-xl border border-green-300 bg-green-50"
          >
            <div className="flex items-start gap-4">
              <CircleCheckBig className="text-green-600 mt-1" />
              <div className="flex-1">
                <AlertTitle className="text-green-800 font-semibold text-sm">
                  Sign Up Successful
                </AlertTitle>
                <AlertDescription className="text-green-700 text-sm mt-1">
                  Welcome! You’ve successfully created your account.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}


        <Button type="submit" className="w-full">
          Sign Up
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline underline-offset-4">
            Login
          </a>
        </div>
      </div>
    </form>
  );
}
