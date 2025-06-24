'use client';

import { useRouter } from 'next/navigation';

export default function NavigationButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push('/')}
      className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center sm:justify-start sm:space-x-2 touch-manipulation active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="hidden sm:inline sm:ml-2">检索</span>
    </button>
  );
}