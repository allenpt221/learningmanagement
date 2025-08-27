'use client';

import React, { useEffect, useState } from 'react';
import { getProfile } from '@/server-action/auth.action';
import { updateProfile } from '@/server-action/profile.action';
import { X } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type ProfileModalProps = {
  isOpen: boolean;
  isClose: () => void;
};

type UserProfile = {
  id: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  image: string;
  createdAt: Date;
};

function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col items-center space-y-4 mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
        <div className="flex-1">
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      </div>

      <div className="mt-4">
        <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
        <div className="h-10 w-full bg-gray-200 rounded" />
      </div>

      <div className="mt-8 flex justify-end">
        <div className="h-9 w-28 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function ProfilePage({ isOpen, isClose }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    username: ""
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getProfile();
        if (data?.user) {
          setProfile(data.user);
          setUserData({
            username: data.user.username || '',
            firstname: data.user.firstname || '',
            lastname: data.user.lastname || ''
          });
          setImagePreview(data.user.image || '');
          setImageFile(null);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    if (!profile) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("id", profile.id);
      formData.append("username", userData.username);
      formData.append("firstname", userData.firstname);
      formData.append("lastname", userData.lastname);

      if (imageFile) {
        formData.append("image", imageFile); // send file, not preview string
      }

      const result = await updateProfile(formData);

      if (result.success) {
        if (result.user.username !== profile?.username) {
          router.replace(`/profile/${result.user.username}`);
        } else {
          router.refresh();
        }
        isClose();
      }

      setProfile(prev => prev ? { ...prev, ...result } : null);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-3">
      <motion.div
        initial={{ opacity: 0, y: 1 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 relative"
      >
        <button
          onClick={isClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Your Profile</h2>
          <p className="text-sm text-gray-500">Manage your personal info</p>
        </div>

        {loading ? (
          <ProfileSkeleton />
        ) : (
          <form onSubmit={handleSave}>
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative w-24 h-24">
                <img
                  src={imagePreview || '/placeholder.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border"
                />
                <Label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm cursor-pointer hover:shadow-md transition">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="text-xs text-gray-500">Edit</span>
                </Label>
              </div>
              <p className="text-sm text-gray-600">{profile?.email}</p>
            </div>

            <div className='flex gap-3'>
              <div>
                <Label className="block text-sm text-gray-600 mb-1">First Name</Label>
                <Input
                  type="text"
                  value={userData.firstname}
                  onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
                />
              </div>
              <div>
                <Label className="block text-sm text-gray-600 mb-1">Last Name</Label>
                <Input
                  type="text"
                  value={userData.lastname}
                  onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm text-gray-600 mb-1">Username</Label>
              <Input
                type="text"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              />
            </div>

            <div className="mt-8 flex justify-end items-center">
              <button
                type="submit"
                disabled={saving}
                className="bg-black hover:bg-black/70 text-white font-medium text-sm px-4 py-2 rounded-md disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default ProfilePage;
