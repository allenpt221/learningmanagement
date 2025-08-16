
import SettingsInfo from '@/components/settingsInfo/Settings'
import React from 'react'

 function Settings() {
  return (
    <div className='max-w-7xl mx-auto py-5'>
      <div className='mx-3 space-y-3'>
        <h1 className='text-2xl font-medium'>
          Settings
        </h1>
        <div className='border border-gray-200' />
        
        <div>
          <SettingsInfo />
        </div>
      </div>
    </div>
  )
}

export default Settings