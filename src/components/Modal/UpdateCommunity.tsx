'use client';
import { getCommunityById, updateCommunity } from '@/actions/community.action';
import { X, Trash2, Upload, CircleCheckBig } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface updateModalProps {
  isOpen: boolean;
  isClose: () => void;
  communityId: string;
}

function UpdateCommunity({ isOpen, isClose, communityId }: updateModalProps) {
  if (!isOpen) return null;

  const [community, setCommunity] = useState<{
    title: string;
    description: string;
    image: string | File;
  }>({
    title: "",
    description: "",
    image: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const community = await getCommunityById(communityId);

      if (community) {
        setCommunity({
          title: community.title || "",
          description: community.description || "",
          image: community.image || "",
        });
      }
    };
    fetchData();
  }, [communityId]);

  // handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setCommunity((prev) => ({ ...prev, image: file as any }));
    }
  };

  // handle image delete
  const handleDeleteImage = () => {
    setPreviewImage(null);
    setCommunity((prev) => ({ ...prev, image: "" }));
  };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

        try {
            // Validation: empty fields
            if (!community.title.trim() && !community.description.trim() && !community.image) {
            setAlert(true);
            setAlertMessage("Please fill in at least one field before updating.");
            return;
            }

            // Optionally: check if nothing changed (compare with original)
            const original = await getCommunityById(communityId);
            if (
            original &&
            community.title === original.title &&
            community.description === original.description &&
            (typeof community.image === "string" ? community.image : null) === original.image
            ) {
            setAlert(true);
            setAlertMessage("No changes detected. Update something before saving.");
            return;
            }

            const form = new FormData();
            form.append("title", community.title);
            form.append("description", community.description);

            if (community.image && community.image instanceof File) {
            form.append("image", community.image);
            }

            const res = await updateCommunity(form, communityId);

            if (res.success) {
                isClose();
            } else {
                setAlert(true);
                setAlertMessage(res.message || "Something went wrong while updating.");
            }
        } catch (error: any) {
            console.error("Failed to update community", error);
            setAlert(true);
            setAlertMessage("Unexpected error occurred. Try again later.");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(false);
        }, 3000);
        return () => clearTimeout(timer);
    },[alert])


  return (
    <div className="inset-0 bg-black/60 flex justify-center items-center fixed z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[420px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">Update Community</h2>
          <button onClick={isClose} className="hover:bg-gray-100 p-1 rounded-full">
            <X />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          {/* Title */}
          <Input
            type="text"
            name="title"
            placeholder="Community Title"
            value={community.title}
            onChange={(e) =>
              setCommunity((prev) => ({ ...prev, title: e.target.value }))
            }
            maxLength={35}
          />

          {/* Description */}
          <Input
            type="text"
            name="description"
            placeholder="Community Description"
            value={community.description}
            onChange={(e) =>
              setCommunity((prev) => ({ ...prev, description: e.target.value }))
            }
            maxLength={100}
          />

          {/* Image upload / preview */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Community Image</label>

            {(previewImage || community.image) ? (
              <div className="relative group w-full h-52">
                <img
                  src={previewImage || (typeof community.image === "string" ? community.image : "")}
                  alt="Community"
                  className="w-full h-full object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 bg-black text-white rounded-full p-2 opacity-80 hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <Upload className="mb-2 text-gray-500" size={24} />
                <span className="text-xs text-gray-500">Upload Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={isClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>

        {alert && (
            <Alert
                variant="default"
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md px-6 py-4 shadow-lg rounded-xl border border-red-300 bg-red-50"
            >
                <div className="flex items-start gap-3">
                <CircleCheckBig className="text-red-600 mt-1" />
                <div>
                    <AlertTitle className="text-red-800 text-sm font-semibold">
                    Update Failed
                    </AlertTitle>
                    <AlertDescription className="text-red-700 text-sm">
                    {alertMessage}
                    </AlertDescription>
                </div>
                </div>
            </Alert>
        )}

    </div>
  );
}

export default UpdateCommunity;
