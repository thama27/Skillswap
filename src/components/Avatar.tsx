import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  verified = false,
  status,
  className = '',
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-14 h-14 text-lg font-bold',
    xl: 'w-20 h-20 text-2xl font-bold',
  };

  const badgeSizeMap = {
    xs: 'w-2.5 h-2.5 -right-0.5 -bottom-0.5',
    sm: 'w-3 h-3 -right-0.5 -bottom-0.5',
    md: 'w-4 h-4 -right-1 -bottom-1',
    lg: 'w-5 h-5 -right-1 -bottom-1',
    xl: 'w-6 h-6 -right-1 -bottom-1',
  };

  const getInitials = (n: string) => {
    if (!n) return 'SS';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  // Generate consistent color hash for initials background
  const getGradient = (n: string) => {
    const gradients = [
      'from-purple-600 to-indigo-600',
      'from-blue-600 to-cyan-600',
      'from-indigo-600 to-violet-700',
      'from-violet-600 to-fuchsia-600',
      'from-cyan-600 to-emerald-600',
    ];
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className={`${sizeMap[size]} rounded-full object-cover border border-white/10 ring-2 ring-purple-500/20`}
        />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-full bg-gradient-to-br ${getGradient(name)} text-white flex items-center justify-center border border-white/15 shadow-inner`}
        >
          {getInitials(name)}
        </div>
      )}

      {verified && (
        <span
          className={`absolute ${badgeSizeMap[size]} bg-[#08090D] rounded-full flex items-center justify-center`}
          title="Verified Member"
        >
          <CheckCircle2 className="w-full h-full text-brand-purple fill-brand-purple/20" />
        </span>
      )}

      {status && !verified && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0D0F14] ${
            status === 'online' ? 'bg-emerald-500' : status === 'busy' ? 'bg-amber-500' : 'bg-slate-500'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
