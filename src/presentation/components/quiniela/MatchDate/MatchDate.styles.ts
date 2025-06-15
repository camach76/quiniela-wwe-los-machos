import { css } from '@emotion/react';

export const matchDateStyles = {
  container: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: '#6B7280', // text-gray-500
    fontSize: '0.875rem', // text-sm
    lineHeight: '1.25rem', // leading-5
  }),
  icon: css({
    width: '1rem',
    height: '1rem',
  }),
};
