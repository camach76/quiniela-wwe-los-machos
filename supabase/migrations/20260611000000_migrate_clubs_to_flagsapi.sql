-- Migrate clubs.logo_url from flagcdn.com to flagsapi.com
-- and normalize clubs.pais to ISO 3166-1 alpha-2 codes
UPDATE clubs
SET
  pais     = UPPER(REGEXP_REPLACE(logo_url, '^https://flagcdn\.com/w80/(.+)\.svg$', '\1')),
  logo_url = 'https://flagsapi.com/' || UPPER(REGEXP_REPLACE(logo_url, '^https://flagcdn\.com/w80/(.+)\.svg$', '\1')) || '/flat/64.png'
WHERE logo_url LIKE '%flagcdn.com%';

-- flagsapi.com does not support GB subdivision codes; use GB for both
UPDATE clubs SET pais = 'GB', logo_url = 'https://flagsapi.com/GB/flat/64.png' WHERE nombre = 'Escocia';
UPDATE clubs SET pais = 'GB', logo_url = 'https://flagsapi.com/GB/flat/64.png' WHERE nombre = 'Inglaterra';
