import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
}

export function Notification({ type, message, className = '' }: NotificationProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-center p-4 border rounded-lg ${styles[type]} ${className}`}>
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
