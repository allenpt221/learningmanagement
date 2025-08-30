"use client";

import { useState } from "react";
import Link from "next/link";

function PostContent({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;

  // Updated regex: match until whitespace, preserve ? and &
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

  const linkify = (text: string) => {
    return text.split(/(\s+)/).map((part, i) => {
      if (urlRegex.test(part)) {
        const href = part.startsWith("http") ? part : `https://${part}`;
        return (
          <Link
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-all"
          >
            {part}
          </Link>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const displayText = isExpanded
    ? content
    : content.length > maxLength
    ? `${content.substring(0, maxLength)}...`
    : content;

  return (
    <div className="space-x-2">
      <p className="text-gray-700 whitespace-pre-line sm:text-sm text-xs">
        {linkify(displayText)}
        {content.length > maxLength && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-black/40 text-sm hover:underline ml-2"
          >
            {isExpanded ? "Show Less" : "See More"}
          </button>
        )}
      </p>
    </div>
  );
}


export default PostContent;