// components/PostContent.tsx
"use client";

import { useState } from "react";

export default function PostContent({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 40; 

  if (content.length <= maxLength) {
    return <p className="text-gray-700 whitespace-pre-line">{content}</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-gray-700 whitespace-pre-line">
        {isExpanded ? content : `${content.substring(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-black/40 text-sm hover:underline"
      >
        {isExpanded ? "Show Less" : "See More"}
      </button>
    </div>
  );
}