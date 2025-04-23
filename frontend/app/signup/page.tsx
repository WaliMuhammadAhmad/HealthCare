"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "@/utils/auth/signup";
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

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async () => {
    if (!email || !fullName || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    const username =
      email.split("@")[0] + Math.floor(1000 + Math.random() * 9000);
    try {
      await signup({ fullName, email, username, password });
      alert("Account created successfully!");
      router.push("/signin");
    } catch (error: any) {
      alert(error.message || "Signup failed.");
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1 flex items-center justify-center p-4 md:p-8'>
        <Card className='mx-auto max-w-md w-full'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl font-bold'>
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                placeholder='John Doe'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='john@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirm-password'>Confirm Password</Label>
              <Input
                id='confirm-password'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='terms'
                className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <label htmlFor='terms' className='text-sm text-muted-foreground'>
                I agree to the{" "}
                <Link href='/terms' className='text-primary hover:underline'>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href='/privacy' className='text-primary hover:underline'>
                  Privacy Policy
                </Link>
              </label>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button className='w-full' onClick={handleSubmit}>
              Create Account
            </Button>
            <div className='text-center text-sm'>
              Already have an account?{" "}
              <Link href='/signin' className='text-primary hover:underline'>
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
