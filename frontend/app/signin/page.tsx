import Link from "next/link";
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

export default function SigninPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1 flex items-center justify-center p-4 md:p-8'>
        <Card className='mx-auto max-w-md w-full'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl font-bold'>
              Sign in to existing account
            </CardTitle>
            <CardDescription>Enter your credentials to sign in</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='john@example.com'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' required />
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button className='w-full'>Sign in</Button>
            <div className='text-center text-sm'>
              Don't have an account?{" "}
              <Link href='/signup' className='text-primary hover:underline'>
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
