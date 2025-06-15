import { css } from '@emotion/react';

export const matchVenueStyles = {
  container: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#6B7280', // text-gray-500
    fontSize: '0.875rem', // text-sm
  }),
  icon: css({
    width: '1rem',
    height: '1rem',
    color: '#9CA3AF', // text-gray-400
  }),
};
