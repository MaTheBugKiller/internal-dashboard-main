'use client';
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import React from 'react'

const SignOut = () => {
    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' });
    };

  return (
    <Button
        onClick={handleSignOut}
        variant="outline"
    >
        <LogOut size={17} className='mr-1' />
          Sign Out
    </Button>
  )
}

export default SignOut