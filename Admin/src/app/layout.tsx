import React from 'react';
import type { Metadata } from 'next';
import { AuthProvider } from './context/AuthContext';
import '../styles/index.css';

export const metadata: Metadata = {
  title: 'ASG Admin Panel',
  description: 'Admin Portal for managing APEX Startup Group and AI Launchpad.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
