'use client'
import { createCommunityPost } from '@/server-action/community.action';
import { CircleCheckBig, SendHorizontal } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


function CommunityPost() {
  const { id } = useParams(); // communityId from URL
  const [isFocused, setIsFocused] = useState(false);
  const [content, setContent] = useState('');

  const [alertTitle, setAlertTitle] = useState('');
  const [success, setSuccess] = useState(false);
  const [unsuccess, setUnsuccess] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('content', content);

    if (!content.trim()) { 
      setUnsuccess(true);
      setAlertTitle('Oops! Something went wrong');
      setMessageAlert("Post content cannot be empty"); 
      return;
    }

      // pass communityId
      const res = await createCommunityPost(formData, id as string);

      if (res.success) {
        setSuccess(true);
        setContent('Community Created!');
        setMessageAlert('Your post has been shared with the community!');
        setAlertTitle(res?.message || 'successfully post in community.');
        setContent('');
      } else {
        setUnsuccess(true);
        setAlertTitle('Oops! Something went wrong')
        setMessageAlert(res.message)
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setUnsuccess(false);
    }, 3000)

    return () => clearTimeout(timer);
  },[success, unsuccess])

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 my-5 transition-all duration-300 hover:shadow-md"
    >
      <div className="relative">
        <textarea
          placeholder="What's on your mind?"
          className="w-full border-0 rounded-xl p-4 text-gray-800 resize-none focus:outline-none focus:ring-0 placeholder-gray-400 text-base"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e as any); // submit when Ctrl+Enter
          }
        }}
        />

        <div
          className={`flex items-center justify-end pt-2 transition-opacity duration-300 ${
            isFocused ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <button
            type="submit"
            className="bg-gradient-to-r from-black to-gray-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            aria-label="Post message"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>

      {success && (
        <Alert variant="default" className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md px-6 py-4 shadow-lg rounded-xl border border-green-300 bg-green-50">
          <div className="flex items-start gap-3">
            <CircleCheckBig className="text-green-600 mt-1" />
            <div>
              <AlertTitle className="text-green-800 text-sm font-semibold">
                {alertTitle}
              </AlertTitle>
              <AlertDescription className="text-green-700 text-sm">
                {messageAlert}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {unsuccess && (
        <Alert variant="default" className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md px-6 py-4 shadow-lg rounded-xl border border-red-300 bg-red-50">
          <div className="flex items-start gap-3">
            <CircleCheckBig className="text-red-600 mt-1" />
            <div>
              <AlertTitle className="text-red-800 text-sm font-semibold">
                {alertTitle}
              </AlertTitle>
              <AlertDescription className="text-red-700 text-sm">
                {messageAlert}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
    </form>
    
  );
}

export default CommunityPost;
