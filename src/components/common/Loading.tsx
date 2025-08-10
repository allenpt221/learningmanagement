'use client';

import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import Image from 'next/image';
import lms from '@/Images/lms.jpg'

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 150); // smooth increments

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-50">
      <Image src={lms} width={200} 
        height={100} alt='Error Image' className="mb-4 text-lg font-semibold" />
      <Progress value={progress} className="w-[20%]" />
    </div>
  );
}
