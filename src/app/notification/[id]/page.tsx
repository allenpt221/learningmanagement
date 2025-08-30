'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { getNotificationById } from '@/actions/post.action';
import PostContent from '@/components/PostContent';

const NotificationPage = () => {
  const router = useRouter();
  const params = useParams();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getNotificationById(id)
        .then((data) => {
          if (data) {
            setNotification(data);
            setError(false);
          } else {
            setNotification(null);
            setError(true);
          }
        })
        .catch(() => {
          setNotification(null);
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading notification...</p>
        </div>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center p-8 border rounded-lg shadow-md bg-white">
          <svg
            className="mx-auto mb-4 w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800">Notification not found</h2>
          <p className="text-sm text-gray-500 mt-2">
            Sorry, the notification you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-black/80"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { type, creator, post, comment } = notification;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Notification</h1>
      <p className="text-sm text-gray-500 mb-4">
        {formatDistanceToNow(new Date(notification.createdAt))} ago
      </p>

      <div className="border p-4 rounded-lg shadow-sm space-y-2">
        {/* User Info */}
        <div className="flex items-center space-x-2">
          <img
            src={
              type === 'FOLLOW'
                ? creator?.image || '/default-avatar.png'
                : post?.author?.image || '/default-avatar.png'
            }
            alt={
              type === 'FOLLOW'
                ? creator?.firstname || 'User'
                : `${post?.author?.firstname || 'User'} ${post?.author?.lastname || ''}`
            }
            className="w-10 h-10 rounded-full"
          />
          <p className="font-medium">
            {type === 'FOLLOW' && (
              `${creator?.firstname} ${creator?.lastname}`
            )}
          </p>
        </div>

        {/* Notification Action */}
        <p className="text-sm font-medium">
          <span>{creator?.username || 'Someone'}</span>{' '}
          {type === 'LIKE' && 'liked your post'}
          {type === 'COMMENT' && 'commented on your post'}
          {type === 'FOLLOW' && 'started following you'}
        </p>

        {/* Post Content */}
        {post && type !== 'FOLLOW' && (
          <div className="mt-2 border-t pt-2 text-sm text-gray-700 space-y-2">
            <PostContent content={post.content || ''} />
            {post.image && (
              <img
                src={post.image}
                alt="Post image"
                className="object-cover rounded-md"
              />
            )}
          </div>
        )}

        {/* Comment Content */}
        {comment && (
          <div className="mt-2 border-t pt-2 text-sm text-gray-700">
            <p className="font-medium">Comment that triggered notification:</p>
            <p>{comment.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
