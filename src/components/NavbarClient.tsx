// components/NavbarClient.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from '@/action/auth.action';
import { Bell, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { NotificationType } from '@/generated/prisma';
import { markNotificationsAsRead } from '@/action/post.action';

interface Users {
  image: string;
  username: string;
  firstname: string;
  lastname: string;
}

type NotificationWithCreator = {
  id: string;
  type: NotificationType;
  creator: Users | null;
  read?: boolean;
  createdAt: Date;
};

function NavbarClient({ profile, notif = [] }: { profile: any, notif: NotificationWithCreator[] }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationWithCreator[]>(notif);

  const profileUrl = `/profile/${profile.user?.username}`;

  const handleLogout = async () => {
    await LogOut();
    router.refresh();
    router.push('/login');
  };

  const handleMarkAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      await markNotificationsAsRead(unreadIds);
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 items-center justify-between md:px-20 px-3">
        {/* Logo */}
        <div className='flex items-center gap-6'>
          <Link href="/" className="flex flex-col items-center space-x-2 hover:opacity-90 transition-opacity">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              StudySphere
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href='/community' className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-1 py-2 relative group">
              Community
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href='/courses' className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-1 py-2 relative group">
              Courses
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          {profile?.success ? (
            <div className="flex items-center space-x-3">
              {/* Notifications Dropdown */}
              <DropdownMenu onOpenChange={(open) => open && handleMarkAsRead()}>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded hover:bg-muted/50">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="sm:w-80 max-h-96 overflow-y-auto p-0 mx-2">
                  <DropdownMenuLabel className="px-3 py-2 font-semibold">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map((notify) => (
                      <DropdownMenuItem key={notify.id} 
                      onClick={() => router.push(`/notification/${notify.id}`)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notify.creator?.image || ''} />
                          <AvatarFallback>{notify.creator?.username?.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
                        </Avatar>
                        <div className='flex sm:justify-between sm:flex-row flex-col justify-start w-full '>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{notify.creator?.username ?? "Unknown user"}</span>
                            <span className="text-xs text-muted-foreground">
                              {notify.type === "LIKE" && "liked your post"}
                              {notify.type === "COMMENT" && "commented on your post"}
                              {notify.type === "FOLLOW" && "started following you"}
                            </span>
                          </div>
                          <div className='text-xs text-gray-400'>
                            {formatDistanceToNow(notify.createdAt)}
                          </div>

                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                      No new notifications
                    </div>
                  )}
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-2 hover:bg-muted/50">
                    <Avatar className="h-8 w-8 border border-primary/20">
                      <AvatarImage src={profile.user?.image || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-white">
                        {profile.user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-muted-foreground">{profile.user?.username}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-lg shadow-lg border-muted-foreground/20">
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50">
                    <Link href={profileUrl} className="w-full px-2 py-1.5">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50 sm:hidden block">
                    <Link href={'/community'} className="w-full px-2 py-1.5">Community</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50 sm:hidden block">
                    <Link href={'/courses'} className="w-full px-2 py-1.5">Courses</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50">
                    <Link href="/settings" className="w-full px-2 py-1.5">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 hover:bg-red-50 px-2 py-1.5"
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
              <button className="sm:hidden hover:bg-muted/50" onClick={() => setIsOpen(true)}>
                <Menu size={20} />
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-40 sm:hidden h-full"
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
                className="fixed top-0 right-0 h-screen w-64 bg-white shadow-lg flex flex-col p-6 space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className='flex justify-between items-center'>
                  <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    StudySphere
                  </Link>
                  <button onClick={() => setIsOpen(false)} className="p-1 rounded-full">
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>
                <div className='flex flex-col'>
                  <Link href='/community' className="px-4 py-2 rounded-lg hover:bg-muted/50 font-medium text-black hover:text-primary" onClick={() => setIsOpen(false)}>
                    Community
                  </Link>
                  <Link href='/courses' className="px-4 py-2 rounded-lg hover:bg-muted/50 font-medium text-black hover:text-primary" onClick={() => setIsOpen(false)}>
                    Courses
                  </Link>
                </div>
                <div className='border py-0'/>
                <div className='flex flex-col space-y-1'>
                  <Link href='/login' className="px-4 py-2 rounded-lg hover:bg-muted/50 font-medium text-muted-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                    Log In
                  </Link>
                  <Link href='/register' className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white font-medium text-center hover:from-primary/90 hover:to-blue-600/90" onClick={() => setIsOpen(false)}>
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

export default NavbarClient;