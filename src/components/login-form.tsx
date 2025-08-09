'use client';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { LogIn } from "@/server-action/auth.action";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleCheckBig, MessageCircleWarning } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTimeout(() => {
      setError('');
      setSuccess(false);
    }, 3000)

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await LogIn(formData);

      if (res.success) {
        setSuccess(true);
        setError('');
      } else {
        setError(res.message || 'Something went wrong');
        setSuccess(false);
      }
    } catch (err: any) {
      console.error("Error logging in:", err);
      setError('An unexpected error occurred');
      setSuccess(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleLogin}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password below to login to your account
        </p>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert variant="default" className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md px-6 py-4 shadow-lg rounded-xl border border-green-300 bg-green-50">
          <div className="flex items-start gap-3">
            <CircleCheckBig className="text-green-600 mt-1" />
            <div>
              <AlertTitle className="text-green-800 text-sm font-semibold">
                Login successful
              </AlertTitle>
              <AlertDescription className="text-green-700 text-sm">
                Redirecting...
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md px-6 py-4 shadow-lg rounded-xl border border-red-300 bg-red-50">
          <div className="flex items-start gap-3">
            <MessageCircleWarning className="text-red-600 mt-1" />
            <div>
              <AlertTitle className="text-red-800 text-sm font-semibold">
                Login failed
              </AlertTitle>
              <AlertDescription className="text-red-700 text-sm">
                {error}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <a
          href="#"
          className="ml-auto text-sm underline-offset-4 hover:underline"
        >
          Forgot your password?
        </a>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/register" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
