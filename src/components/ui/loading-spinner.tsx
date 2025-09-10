import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  innerClassName?: string;
  messageClassName?: string;
  spinnerClassName?: string;
}

export function LoadingSpinner({
  message = 'Loading...',
  className,
  innerClassName,
  spinnerClassName,
  messageClassName,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn('min-h-screen flex items-center justify-center', className)}
    >
      <div className={cn('flex items-center space-x-6', innerClassName)}>
        <div
          className={cn(
            'animate-spin rounded-full h-8 w-8 border-b-2 border-primary',
            spinnerClassName
          )}
        ></div>
        <span className={cn('text-lg text-foreground/50', messageClassName)}>
          {message}
        </span>
      </div>
    </div>
  );
}
