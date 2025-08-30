import { getProfile } from '@/action/auth.action'
import { CircleQuestionMark } from 'lucide-react';
import React from 'react'
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { DEPARTMENT_MAP } from '../../Modal/FollowerModal';

async function PersonalInfo() {
    const profile = await getProfile();

    
    return (
        <div className="space-y-8 w-full">
            {/* Profile Picture Section */}
            <div className='flex flex-col md:flex-row justify-between md:items-start items-center gap-6'>
                <div className='flex-1 space-y-2'>
                    <div className='flex items-center gap-2 text-gray-700'>
                        <p className="font-medium">Your Profile Picture</p>
                        <CircleQuestionMark className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className=' text-gray-500 sm:text-base text-xs'>
                        This will be your display picture. Change your display picture into Profile.
                    </p>
                </div>
                <div className="flex-1 flex justify-center md:justify-end">
                    <img 
                        src={profile.user?.image} 
                        alt={profile.user?.username} 
                        className='w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-2 border-gray-200'
                    />
                </div>
            </div>

            <div className='border-t border-gray-200' />

            {/* Profile Name Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                    <h3 className="font-medium text-gray-700 sm:text-base text-xs">Profile Name</h3>
                </div>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label className="text-gray-600 sm:text-base text-xs">Firstname</Label>
                            <Input 
                                value={profile.user?.firstname || ''}
                                readOnly
                                className="bg-gray-50 sm:text-base text-xs"
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className="text-gray-600 sm:text-base text-xs">Lastname</Label>
                            <Input 
                                value={profile.user?.lastname || ''}
                                readOnly
                                className="bg-gray-50 sm:text-base text-xs"
                            />
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <Label className="text-gray-600 sm:text-base text-xs">Username</Label>
                        <Input 
                            value={profile.user?.username || ''}
                            readOnly
                            className="bg-gray-50 sm:text-base text-xs"
                        />
                    </div>
                </div>  
            </div>

            <div className='border-t border-gray-200' />

            {/* Email Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                    <h3 className="font-medium text-gray-700 sm:text-base text-xs">Email Address</h3>
                </div>
                <div className='space-y-2'>
                    <Label className="text-gray-600 sm:text-base text-xs">Email</Label>
                    <Input 
                        value={profile.user?.email || ''}
                        readOnly
                        className="bg-gray-50 sm:text-base text-xs"
                    />
                </div>  
            </div>

            <div className='border-t border-gray-200' />

            {/* Department Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                    <h3 className="font-medium text-gray-700 sm:text-base text-xs">Department</h3>
                </div>
                <div className='space-y-2'>
                    <Label className="text-gray-600 sm:text-base text-xs">Department</Label>
                    <Input 
                        value={DEPARTMENT_MAP[profile.user?.type as keyof typeof DEPARTMENT_MAP] || ''}
                        readOnly
                        className="bg-gray-50"
                    />
                </div>  
            </div>
        </div>
    )
}

export default PersonalInfo