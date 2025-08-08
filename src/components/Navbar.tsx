import Link from 'next/link';
import React from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

function Navbar() {
  return (
    <div className='shadow-sm py-2 bg-white'>
      <div className='flex justify-between items-center px-10'>
        <Link href="/" className='text-xl font-bold'>
          LMS
        </Link>
       <div className="relative w-[30rem]">
          <Input
            type="text"
            placeholder="Search..."
            className="h-10 pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        <div className='flex space-x-5 font-medium'>
            <Link href='#' className='border px-4 py-1 rounded-full'>
              Log In
            </Link>
            <Link href='/register' className='px-4 py-1 rounded-full bg-black text-white hover:bg-black/60 transition-all duration-100 ease-in'>
              Sign up
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
