import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

type TeamLogoProps = {
  name: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
  bgColor?: string;
};

export const TeamLogo = ({
  name = 'Team',
  logoUrl,
  size = 48,
  className = '',
  bgColor = '#e5e7eb',
}: TeamLogoProps) => {
  const [imageError, setImageError] = useState(false);
  const [isImageValid, setIsImageValid] = useState(true);

  // Verificar si la URL de la imagen es válida
  useEffect(() => {
    if (!logoUrl) {
      setIsImageValid(false);
      return;
    }

    const img = new window.Image();
    img.src = logoUrl;
    
    img.onload = () => {
      setIsImageValid(true);
      setImageError(false);
    };
    
    img.onerror = () => {
      setIsImageValid(false);
    };
  }, [logoUrl]);

  // Obtener las iniciales del nombre del equipo
  const getInitials = (teamName: string) => {
    if (!teamName) return '??';
    
    // Tomar las primeras letras de las primeras dos palabras
    return teamName
      .split(' ')
      .slice(0, 2)
      .map(word => word[0]?.toUpperCase() || '')
      .join('')
      .substring(0, 2);
  };

  // Si no hay URL de logo o hubo un error, mostrar las iniciales
  if (!logoUrl || !isImageValid || imageError) {
    return (
      <div 
        className={`flex items-center justify-center rounded-full ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: bgColor,
          fontSize: `${size * 0.4}px`,
          fontWeight: 'bold',
          color: '#4b5563', // gray-600
        }}
      >
        {getInitials(name)}
      </div>
    );
  }

  // Mostrar la imagen del logo
  return (
    <div className={`relative ${className}`} style={{ width: `${size}px`, height: `${size}px` }}>
      <div 
        className="absolute inset-0 rounded-full" 
        style={{ backgroundColor: bgColor }}
      />
      <Image
        src={logoUrl}
        alt={name}
        width={size}
        height={size}
        className="relative z-10 object-contain p-1 rounded-full"
        onError={() => setImageError(true)}
      />
    </div>
  );
};
