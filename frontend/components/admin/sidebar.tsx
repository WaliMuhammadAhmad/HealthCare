"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "./admin-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  Settings,
  LogOut,
  Menu,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { logout } from "@/utils/auth/logout";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Appointments",
    href: "/admin/appointments",
    icon: Calendar,
  },
  {
    title: "Doctors",
    href: "/admin/doctors",
    icon: Stethoscope,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const { sidebarOpen, toggleSidebar } = useAdmin();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden'
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant='outline'
        size='icon'
        className='fixed left-4 top-4 z-50 md:hidden'
        onClick={toggleSidebar}>
        <Menu className='h-4 w-4' />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300 ease-in-out md:relative",
          sidebarOpen
            ? "w-72 translate-x-0"
            : "w-16 -translate-x-full md:translate-x-0"
        )}>
        <div className='flex h-16 items-center justify-between border-b px-4'>
          <Link href='/admin' className='flex items-center gap-2'>
            <Heart className='h-6 w-6 text-primary' />
            <span
              className={cn(
                "font-bold text-xl transition-opacity duration-200",
                !sidebarOpen && "md:opacity-0"
              )}>
              HealthCare
            </span>
          </Link>
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleSidebar}
            className='hidden md:flex'>
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                !sidebarOpen && "rotate-180"
              )}
            />
          </Button>
        </div>

        <ScrollArea className='flex-1 py-4'>
          <nav className='grid gap-1 px-2'>
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}>
                <link.icon className='h-5 w-5' />
                <span
                  className={cn(
                    "transition-opacity duration-200",
                    !sidebarOpen && "md:hidden"
                  )}>
                  {link.title}
                </span>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className='border-t p-4'>
          <Link
            href='/'
            onClick={() => logout("admin")}
            className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'>
            <LogOut className='h-5 w-5' />
            <span
              className={cn(
                "transition-opacity duration-200",
                !sidebarOpen && "md:hidden"
              )}>
              Logout
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
