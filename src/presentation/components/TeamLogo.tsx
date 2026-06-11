"use client";

import { useState } from 'react';
import Image from 'next/image';

type TeamLogoProps = {
  name: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
};

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase().slice(0, 2);

export const TeamLogo = ({ name = 'Team', logoUrl, size = 48, className = '' }: TeamLogoProps) => {
  const [error, setError] = useState(false);

  if (!logoUrl || error) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gray-200 shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(8, size * 0.3) }}
      >
        <span className="font-medium text-gray-500">{getInitials(name)}</span>
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Image
        src={logoUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  );
};
