"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/navbar";
import { toast } from "sonner";
import { login } from "@/utils/auth/login";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data) {
        toast.success("Login successful");
        if (email.toLowerCase().endsWith("@healthcare.com")) {
          router.push("/admin");
        } else {
          router.push("/appointments");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1 flex items-center justify-center p-4 md:p-8'>
        <form onSubmit={handleLogin} className='w-full'>
          <Card className='mx-auto max-w-md w-full'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-2xl font-bold'>
                Sign in to existing account
              </CardTitle>
              <CardDescription>
                Enter your credentials to sign in
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='john@example.com'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className='flex flex-col space-y-4'>
              <Button className='w-full' type='submit' disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <div className='text-center text-sm'>
                Don't have an account?{" "}
                <Link href='/signup' className='text-primary hover:underline'>
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  );
}
