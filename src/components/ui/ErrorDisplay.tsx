interface ErrorDisplayProps {
  message?: string;
  error?: string;
  className?: string;
}

export default function ErrorDisplay({ 
  message = '加载失败', 
  error,
  className = 'min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'
}: ErrorDisplayProps) {
  return (
    <div className={className}>
      <div className="text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
        {error && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}