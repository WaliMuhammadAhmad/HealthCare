"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { logout } from "@/utils/auth/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const user = useAppStore((state) => state.user);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link href='/' className='flex items-center space-x-2'>
            <Heart className='h-6 w-6 text-primary' />
            <span className='font-bold text-xl'>HealthCare</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          <Link
            href='/'
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}>
            Home
          </Link>
          <Link
            href='#features'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
            Features
          </Link>
          <Link
            href='#about'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
            About
          </Link>
          <Link
            href='#booking'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
            Booking
          </Link>
          <Link
            href='#contact'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
            Contact
          </Link>
        </nav>

        <div className='flex items-center gap-4'>
          <ThemeToggle />
          <div className='hidden md:flex gap-2'>
            {user ? (
              <div className='flex items-center gap-3'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className='cursor-pointer'>
                      <AvatarImage
                        className='h-8 w-8 rounded-full'
                        src={user.profilePic}
                        alt={user.fullName}
                      />
                      <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem asChild>
                      <Link href='/appointments'>Book Appointment</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href='/dashboard'>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        logout("user");
                      }}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link href='/signin'>
                  <Button variant='outline'>Log in</Button>
                </Link>
                <Link href='/signup'>
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            className='md:hidden'
            size='icon'
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className={isMenuOpen ? "hidden" : "block"}>
              <line x1='3' y1='12' x2='21' y2='12' />
              <line x1='3' y1='6' x2='21' y2='6' />
              <line x1='3' y1='18' x2='21' y2='18' />
            </svg>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className={isMenuOpen ? "block" : "hidden"}>
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden border-t p-4'>
          <nav className='flex flex-col space-y-4'>
            <Link
              href='/'
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link
              href='#features'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
              onClick={() => setIsMenuOpen(false)}>
              Features
            </Link>
            <Link
              href='#about'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
              onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link
              href='#booking'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
              onClick={() => setIsMenuOpen(false)}>
              Booking
            </Link>
            <Link
              href='#contact'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
              onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className='flex flex-col gap-2 pt-2'>
              {user ? (
                <div className='flex items-center gap-3'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className='cursor-pointer'>
                        <AvatarImage
                          className='h-8 w-8 rounded-full'
                          src={user.profilePic}
                          alt={user.fullName}
                        />
                        <AvatarFallback>
                          {user.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem asChild>
                        <Link href='/appointments'>Book Appointment</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href='/dashboard'>Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          logout("user");
                        }}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Link href='/signin' onClick={() => setIsMenuOpen(false)}>
                    <Button variant='outline' className='w-full'>
                      Log in
                    </Button>
                  </Link>
                  <Link href='/signup' onClick={() => setIsMenuOpen(false)}>
                    <Button className='w-full'>Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
