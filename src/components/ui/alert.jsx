import * as React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/util';

export function Alert({ type = 'default', title, message, className }) {
  const getIcon = () => {
    if (type === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    if (type === 'danger') return <AlertCircle className="h-5 w-5 text-red-500" />;
    return null;
  };

  return (
    <div className={cn(
      'flex items-start gap-3 rounded-lg border px-4 py-3 shadow-sm',
      type === 'warning' && 'bg-yellow-50 border-yellow-300',
      type === 'danger' && 'bg-red-50 border-red-300',
      className
    )}>
      <div className="mt-1">{getIcon()}</div>
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <p className="text-sm text-gray-800">{message}</p>
      </div>
    </div>
  );
}
