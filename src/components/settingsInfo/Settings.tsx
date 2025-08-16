'use client';
import dynamic from "next/dynamic";
import { useState } from "react";
const PersonalInfo = dynamic(() => import('./settingsPath/PersonalInfo'), { 
  ssr: false,
  loading: () => 
  <div className="flex justify-center items-center h-[60vh] w-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black mx-auto mb-4"></div>
      <p className="text-gray-500 text-sm">Loading Personal Information...</p>
    </div>
  </div>
});

const CreateCommunity = dynamic(() => import('./settingsPath/CreateCommunity'), { 
  ssr: false,
  loading: () => 
  <div className="flex justify-center items-center h-[60vh] w-full">
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
    { name: 'Create Community', href: 'community' },
  ];

  const renderContent = () => {
    switch (currentPath) {
      case 'personalinfo':
        return <PersonalInfo />;
      case 'community':
        return <CreateCommunity />
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="flex lg:flex-row flex-col justify-between space-x-5 mx-2 sm:items-start items-center">
      <div className="flex flex-row sm:justify-normal justify-center lg:flex-col lg:w-[15rem] lg:space-y-3">
        {sideItems.map((item) => (
          <button
            key={item.href}
            className={`xl:text-[1rem] text-xs rounded text-left px-3 py-2 sm:font-normal font-medium ${currentPath === item.href ? 'bg-muted' : 'hover:bg-muted'}`}
            onClick={() => setCurrentPath(item.href)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="border my-2"/>
        {renderContent()}
    </div>
  );
}

export default SettingsInfo;

