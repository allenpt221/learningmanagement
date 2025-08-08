// components/NavbarClient.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from '@/server-action/auth.action';
import { Input } from './ui/input';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { useProfileModal } from '@/context/ProfileModalContext';

export default function NavbarClient({ profile }: { profile: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { open: openProfile } = useProfileModal();

  const router = useRouter();

  const handleLogout = async () => {
    await LogOut();
    router.refresh();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            LMS
          </span>
        </Link>

        {/* Search Bar */}
        <div className={`flex relative w-full max-w-md mx-4 transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            type="text" 
            placeholder="Search courses..." 
            className="pl-10 h-9 text-sm rounded-lg border-muted-foreground/30 focus-visible:ring-primary/50"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          {profile?.success ? (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="relative hover:bg-muted/50">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-2 hover:bg-muted/50">
                    <Avatar className="h-8 w-8 border border-primary/20">
                      <AvatarImage src={profile.user?.image || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-white">
                        {profile.user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-muted-foreground">
                      {profile.user?.username}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-lg shadow-lg border-muted-foreground/20">
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50">
                    <button onClick={openProfile} className="w-full px-2 py-1.5">Profile</button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50">
                    <Link href="/settings" className="w-full px-2 py-1.5">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-500 hover:bg-red-50 focus:text-red-600 focus:bg-red-50 px-2 py-1.5"
                    onClick={handleLogout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <div className="items-center space-x-2 sm:flex hidden">
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>

              <button
                className="sm:hidden hover:bg-muted/50" 
                onClick={() => setIsOpen(true)}
              >
                <Menu size={20} />
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-black/20 bg-opacity-40 z-40 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            >
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-screen w-64 bg-white shadow-lg z-50 sm:hidden flex flex-col p-6 space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className='flex justify-between items-center'>
                  <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    LMS
                  </Link>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full"
                  >
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>
                
                <div className='flex flex-col space-y-4 pt-4'>
                  <Link 
                    href='/login' 
                    className="px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    href='/register'
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white font-medium text-center hover:from-primary/90 hover:to-blue-600/90 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}