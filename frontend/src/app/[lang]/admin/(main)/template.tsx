'use client';

import { Menu } from '@/components/Admin';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-1'>
      <Menu />
      {children}
    </div>
  );
}
