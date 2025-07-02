interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  spinnerColor?: string;
}

export default function LoadingSpinner({ 
  message = '加载中...', 
  className = 'min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center',
  spinnerColor = 'border-blue-500'
}: LoadingSpinnerProps) {
  return (
    <div className={className}>
      <div className="text-center">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${spinnerColor} mx-auto mb-4`}></div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}