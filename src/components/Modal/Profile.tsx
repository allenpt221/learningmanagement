'use client';

import React, { useEffect, useState } from 'react';
import { getProfile} from '@/server-action/auth.action';
import { X } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

type ProfileModalProps = {
  isOpen: boolean;
  isClose: () => void;
};

type UserProfile = {
  id: string;
  email: string;
  username: string;
  image: string;
  createdAt: Date;
};

export function ProfilePage({ isOpen, isClose }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    username: ""
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getProfile();
       if (data?.user) {
          setProfile(data.user);
          setUserData({
            username: data.user?.username || '',
            firstname: data.user?.firstname || '',
            lastname: data.user?.lastname || ''
          });
          setImagePreview(data.user.image || '');
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
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // let imageUrl = profile?.image || '';

      // if (imageFile) {
      //   const formData = new FormData();
      //   formData.append('file', imageFile);
      //   const uploaded = await uploadImage(formData);
      //   imageUrl = uploaded.url;
      // }

      // await updateProfile({ name, image: imageUrl });
      // setProfile((prev) => prev ? { ...prev, name, image: imageUrl } : null);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 relative">
        {/* Header */}
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
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
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
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label className="block text-sm text-gray-600 mb-1">Last Name</Label>
                <Input
                  type="text"
                  value={userData.lastname}
                  onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>


            <div>
              <Label className="block text-sm text-gray-600 mb-1">Username</Label>
              <Input
                type="text"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>


            <div className="mt-8 flex justify-end items-center">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-black hover:bg-black/70 text-white font-medium text-sm px-4 py-2 rounded-md disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
