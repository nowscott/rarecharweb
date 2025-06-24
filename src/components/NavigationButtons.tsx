'use client';

import { useRouter } from 'next/navigation';

export default function NavigationButtons() {
  const router = useRouter();

  return (
    <>
      <button 
        onClick={() => router.push('/')}
        className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors flex items-center justify-center sm:justify-start sm:space-x-2 text-sm sm:text-base touch-manipulation active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
        <span className="hidden sm:inline sm:ml-2">符号</span>
      </button>
      <button 
        onClick={() => router.push('/emoji')}
        className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors flex items-center justify-center sm:justify-start sm:space-x-2 text-sm sm:text-base touch-manipulation active:scale-95"
      >
        <span className="text-lg">😀</span>
        <span className="hidden sm:inline sm:ml-2">Emoji</span>
      </button>
      <button 
        className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg transition-colors flex items-center justify-center sm:justify-start sm:space-x-2 text-sm sm:text-base touch-manipulation active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden sm:inline sm:ml-2">关于</span>
      </button>
    </>
  );
}