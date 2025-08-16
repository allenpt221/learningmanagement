import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createCommunity } from '@/server-action/community.action';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePlus, Loader2, X } from 'lucide-react';

function CreateCommunity() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    // Reset the file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      const res = await createCommunity(formData);

      if (res?.success) {
        alert('Community created successfully!');
        setDescription('');
        setTitle('')
        setImage(null);
        setPreview(null);
        e.currentTarget.reset();
      } else {
        alert(res?.message || 'Failed to create community');
      }
    } catch (error) {
      console.error('Error creating community', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Card className='shadow-lg w-full'>
        <CardHeader>
          <CardTitle className='text-xl font-bold text-center'>Create New Community</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='description'>Community Title</Label>
              <Input
                id='title'
                name='title'
                type='text'
                placeholder='Enter Community Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className='focus-visible:ring-2 focus-visible:ring-primary'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Input
                id='description'
                name='description'
                type='text'
                placeholder='What is this community about?'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className='focus-visible:ring-2 focus-visible:ring-primary'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='image'>Community Image</Label>
              <div className='relative'>
                <label
                  htmlFor='image-upload'
                  className='flex flex-col items-center justify-center w-full h-[25rem] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt='Preview'
                        className='w-full h-full object-cover rounded-lg'
                      />
                    </>
                  ) : (
                    <div className='flex flex-col items-center justify-center p-4'>
                      <ImagePlus className='w-8 h-8 text-gray-400 mb-2' />
                      <p className='text-sm text-gray-500'>
                        Click to upload an image
                      </p>
                      <p className='text-xs text-gray-400'>
                        PNG, JPG (Max. 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    id='image-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                </label>
                {preview && (
                  <button
                    type='button'
                    onClick={handleRemoveImage}
                    className='absolute -top-2 -right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black/30 transition-colors'
                    aria-label='Remove image'
                  >
                    <X className='w-4 h-4' />
                  </button>
                )}
              </div>
            </div>

            <Button
              type='submit'
              className='w-full bg-primary hover:bg-primary/90 transition-colors'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Community'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
  );
}

export default CreateCommunity;