'use client';
import dynamic from "next/dynamic";
import { useState } from "react";

const PersonalInfo = dynamic(() => import('./settingsPath/PersonalInfo'), { 
  ssr: false,
  loading: () => 
  <div className="flex justify-center items-center h-[60vh]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black mx-auto mb-4"></div>
      <p className="text-gray-500 text-sm">Loading Personal Information...</p>
    </div>
  </div>
});

function SettingsInfo() {
  const [currentPath, setCurrentPath] = useState("personalinfo");


  const sideItems = [
    { name: 'Personal Information', href: 'personalinfo' },
    { name: 'Account Settings', href: 'account' },
    { name: 'Privacy Settings', href: 'privacy' },
  ];

  const renderContent = () => {
    switch (currentPath) {
      case 'personalinfo':
        return <PersonalInfo />;
      case 'account':
        return <div>Account Settings Content</div>;
      case 'privacy':
        return <div>Privacy Settings Content</div>;
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="flex justify-between space-x-5">
      <div className="flex flex-col w-[15rem] space-y-3">
        {sideItems.map((item) => (
          <button
            key={item.href}
            className={`text-lg rounded text-left px-3 py-1 ${currentPath === item.href ? 'bg-muted' : 'hover:bg-muted'}`}
            onClick={() => setCurrentPath(item.href)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
}

export default SettingsInfo;

