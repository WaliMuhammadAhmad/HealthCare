"use client";
import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { useAppStore } from "@/stores/useAppStore";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { usePatientStore } from "@/stores/usePatientStore";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initializeData = useAppStore((state) => state.initializeData);
  const initializePatientData = usePatientStore(
    (state) => state.initializeData
  );
  useEffect(() => {
    initializeData();
    initializePatientData();
  }, []);

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
