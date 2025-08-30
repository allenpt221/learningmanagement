
import SettingsInfo from '@/components/settingsInfo/Settings'
import { getProfile } from '@/actions/auth.action'
import { redirect } from 'next/navigation';
import React from 'react'

async function Settings() {

  const profile = await getProfile();


  if(!profile.user){
    redirect('/')
  }

  return (
    <div className='max-w-7xl mx-auto py-5'>
      <div className='space-y-3'>
        <h1 className='text-2xl font-medium'>
          Settings
        </h1>
        <div className='border border-gray-200' />

          <SettingsInfo />

      </div>
    </div>
  )
}

export default Settings