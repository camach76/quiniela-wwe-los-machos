import React from 'react';

interface MatchDateProps {
  date: string | Date;
  className?: string;
}

export const MatchDate: React.FC<MatchDateProps> = ({ 
  date, 
  className = '' 
}) => {
  const formatDate = (dateString: string | Date) => {
    const dateObj = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return dateObj.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`text-sm text-gray-500 ${className}`}>
      {formatDate(date)}
    </div>
  );
};

export default MatchDate;
