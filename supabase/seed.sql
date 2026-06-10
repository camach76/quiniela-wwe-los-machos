-- ============================================================
-- Seed: Copa Mundial FIFA 2026
-- ============================================================

DELETE FROM public.bets;
DELETE FROM public.club_ranking;
DELETE FROM public.matches;
DELETE FROM public.clubs;

-- ============================================================
-- 48 Selecciones nacionales — logos via flagcdn.com
-- ============================================================
INSERT INTO public.clubs (nombre, pais, logo_url) VALUES
  ('México',           'México',                        'https://flagcdn.com/w80/mx.svg'),
  ('Sudáfrica',        'Sudáfrica',                     'https://flagcdn.com/w80/za.svg'),
  ('Corea del Sur',    'Corea del Sur',                 'https://flagcdn.com/w80/kr.svg'),
  ('Chequia',          'Chequia',                       'https://flagcdn.com/w80/cz.svg'),
  ('Canadá',           'Canadá',                        'https://flagcdn.com/w80/ca.svg'),
  ('Bosnia y Herz.',   'Bosnia y Herzegovina',          'https://flagcdn.com/w80/ba.svg'),
  ('Catar',            'Catar',                         'https://flagcdn.com/w80/qa.svg'),
  ('Suiza',            'Suiza',                         'https://flagcdn.com/w80/ch.svg'),
  ('Brasil',           'Brasil',                        'https://flagcdn.com/w80/br.svg'),
  ('Marruecos',        'Marruecos',                     'https://flagcdn.com/w80/ma.svg'),
  ('Haití',            'Haití',                         'https://flagcdn.com/w80/ht.svg'),
  ('Escocia',          'Escocia',                       'https://flagcdn.com/w80/gb-sct.svg'),
  ('Estados Unidos',   'Estados Unidos',                'https://flagcdn.com/w80/us.svg'),
  ('Paraguay',         'Paraguay',                      'https://flagcdn.com/w80/py.svg'),
  ('Australia',        'Australia',                     'https://flagcdn.com/w80/au.svg'),
  ('Turquía',          'Turquía',                       'https://flagcdn.com/w80/tr.svg'),
  ('Alemania',         'Alemania',                      'https://flagcdn.com/w80/de.svg'),
  ('Curazao',          'Curazao',                       'https://flagcdn.com/w80/cw.svg'),
  ('Costa de Marfil',  'Costa de Marfil',               'https://flagcdn.com/w80/ci.svg'),
  ('Ecuador',          'Ecuador',                       'https://flagcdn.com/w80/ec.svg'),
  ('Países Bajos',     'Países Bajos',                  'https://flagcdn.com/w80/nl.svg'),
  ('Japón',            'Japón',                         'https://flagcdn.com/w80/jp.svg'),
  ('Suecia',           'Suecia',                        'https://flagcdn.com/w80/se.svg'),
  ('Túnez',            'Túnez',                         'https://flagcdn.com/w80/tn.svg'),
  ('Bélgica',          'Bélgica',                       'https://flagcdn.com/w80/be.svg'),
  ('Egipto',           'Egipto',                        'https://flagcdn.com/w80/eg.svg'),
  ('Irán',             'Irán',                          'https://flagcdn.com/w80/ir.svg'),
  ('Nueva Zelanda',    'Nueva Zelanda',                 'https://flagcdn.com/w80/nz.svg'),
  ('España',           'España',                        'https://flagcdn.com/w80/es.svg'),
  ('Cabo Verde',       'Cabo Verde',                    'https://flagcdn.com/w80/cv.svg'),
  ('Arabia Saudita',   'Arabia Saudita',                'https://flagcdn.com/w80/sa.svg'),
  ('Uruguay',          'Uruguay',                       'https://flagcdn.com/w80/uy.svg'),
  ('Francia',          'Francia',                       'https://flagcdn.com/w80/fr.svg'),
  ('Senegal',          'Senegal',                       'https://flagcdn.com/w80/sn.svg'),
  ('Irak',             'Irak',                          'https://flagcdn.com/w80/iq.svg'),
  ('Noruega',          'Noruega',                       'https://flagcdn.com/w80/no.svg'),
  ('Argentina',        'Argentina',                     'https://flagcdn.com/w80/ar.svg'),
  ('Argelia',          'Argelia',                       'https://flagcdn.com/w80/dz.svg'),
  ('Austria',          'Austria',                       'https://flagcdn.com/w80/at.svg'),
  ('Jordania',         'Jordania',                      'https://flagcdn.com/w80/jo.svg'),
  ('Portugal',         'Portugal',                      'https://flagcdn.com/w80/pt.svg'),
  ('RD Congo',         'República Democrática del Congo','https://flagcdn.com/w80/cd.svg'),
  ('Uzbekistán',       'Uzbekistán',                    'https://flagcdn.com/w80/uz.svg'),
  ('Colombia',         'Colombia',                      'https://flagcdn.com/w80/co.svg'),
  ('Inglaterra',       'Inglaterra',                    'https://flagcdn.com/w80/gb-eng.svg'),
  ('Croacia',          'Croacia',                       'https://flagcdn.com/w80/hr.svg'),
  ('Ghana',            'Ghana',                         'https://flagcdn.com/w80/gh.svg'),
  ('Panamá',           'Panamá',                        'https://flagcdn.com/w80/pa.svg');

-- ============================================================
-- 72 Partidos — Fase de Grupos
-- Hora: 20:00 UTC (ajustable desde el panel de admin)
-- ============================================================
INSERT INTO public.matches (club_a_id, club_b_id, fecha, estadio, grupo) VALUES

  -- GRUPO A
  ((SELECT id FROM public.clubs WHERE nombre='México'),        (SELECT id FROM public.clubs WHERE nombre='Sudáfrica'),      '2026-06-11 20:00:00+00', 'Estadio Azteca',            'A'),
  ((SELECT id FROM public.clubs WHERE nombre='Corea del Sur'), (SELECT id FROM public.clubs WHERE nombre='Chequia'),        '2026-06-12 20:00:00+00', 'Estadio Akron',             'A'),
  ((SELECT id FROM public.clubs WHERE nombre='Chequia'),       (SELECT id FROM public.clubs WHERE nombre='Sudáfrica'),      '2026-06-18 20:00:00+00', 'Mercedes-Benz Stadium',     'A'),
  ((SELECT id FROM public.clubs WHERE nombre='México'),        (SELECT id FROM public.clubs WHERE nombre='Corea del Sur'),  '2026-06-19 20:00:00+00', 'Estadio Akron',             'A'),
  ((SELECT id FROM public.clubs WHERE nombre='Sudáfrica'),     (SELECT id FROM public.clubs WHERE nombre='Corea del Sur'),  '2026-06-25 20:00:00+00', 'Estadio BBVA',              'A'),
  ((SELECT id FROM public.clubs WHERE nombre='Chequia'),       (SELECT id FROM public.clubs WHERE nombre='México'),         '2026-06-25 20:00:00+00', 'Estadio Azteca',            'A'),

  -- GRUPO B
  ((SELECT id FROM public.clubs WHERE nombre='Canadá'),          (SELECT id FROM public.clubs WHERE nombre='Bosnia y Herz.'), '2026-06-12 20:00:00+00', 'BMO Field',                 'B'),
  ((SELECT id FROM public.clubs WHERE nombre='Catar'),           (SELECT id FROM public.clubs WHERE nombre='Suiza'),           '2026-06-13 20:00:00+00', 'Levi''s Stadium',           'B'),
  ((SELECT id FROM public.clubs WHERE nombre='Suiza'),           (SELECT id FROM public.clubs WHERE nombre='Bosnia y Herz.'), '2026-06-18 20:00:00+00', 'SoFi Stadium',              'B'),
  ((SELECT id FROM public.clubs WHERE nombre='Canadá'),          (SELECT id FROM public.clubs WHERE nombre='Catar'),           '2026-06-18 20:00:00+00', 'BC Place',                  'B'),
  ((SELECT id FROM public.clubs WHERE nombre='Suiza'),           (SELECT id FROM public.clubs WHERE nombre='Canadá'),          '2026-06-24 20:00:00+00', 'BC Place',                  'B'),
  ((SELECT id FROM public.clubs WHERE nombre='Bosnia y Herz.'), (SELECT id FROM public.clubs WHERE nombre='Catar'),           '2026-06-24 20:00:00+00', 'Lumen Field',               'B'),

  -- GRUPO C
  ((SELECT id FROM public.clubs WHERE nombre='Brasil'),    (SELECT id FROM public.clubs WHERE nombre='Marruecos'), '2026-06-13 20:00:00+00', 'MetLife Stadium',           'C'),
  ((SELECT id FROM public.clubs WHERE nombre='Haití'),     (SELECT id FROM public.clubs WHERE nombre='Escocia'),   '2026-06-14 20:00:00+00', 'Gillette Stadium',          'C'),
  ((SELECT id FROM public.clubs WHERE nombre='Escocia'),   (SELECT id FROM public.clubs WHERE nombre='Marruecos'), '2026-06-19 20:00:00+00', 'Gillette Stadium',          'C'),
  ((SELECT id FROM public.clubs WHERE nombre='Brasil'),    (SELECT id FROM public.clubs WHERE nombre='Haití'),     '2026-06-20 20:00:00+00', 'Lincoln Financial Field',   'C'),
  ((SELECT id FROM public.clubs WHERE nombre='Marruecos'), (SELECT id FROM public.clubs WHERE nombre='Haití'),     '2026-06-24 20:00:00+00', 'Mercedes-Benz Stadium',     'C'),
  ((SELECT id FROM public.clubs WHERE nombre='Escocia'),   (SELECT id FROM public.clubs WHERE nombre='Brasil'),    '2026-06-24 20:00:00+00', 'Hard Rock Stadium',         'C'),

  -- GRUPO D
  ((SELECT id FROM public.clubs WHERE nombre='Estados Unidos'), (SELECT id FROM public.clubs WHERE nombre='Paraguay'),       '2026-06-13 20:00:00+00', 'SoFi Stadium',              'D'),
  ((SELECT id FROM public.clubs WHERE nombre='Australia'),      (SELECT id FROM public.clubs WHERE nombre='Turquía'),        '2026-06-14 20:00:00+00', 'BC Place',                  'D'),
  ((SELECT id FROM public.clubs WHERE nombre='Estados Unidos'), (SELECT id FROM public.clubs WHERE nombre='Australia'),      '2026-06-19 20:00:00+00', 'Lumen Field',               'D'),
  ((SELECT id FROM public.clubs WHERE nombre='Turquía'),        (SELECT id FROM public.clubs WHERE nombre='Paraguay'),       '2026-06-20 20:00:00+00', 'Levi''s Stadium',           'D'),
  ((SELECT id FROM public.clubs WHERE nombre='Turquía'),        (SELECT id FROM public.clubs WHERE nombre='Estados Unidos'), '2026-06-26 20:00:00+00', 'SoFi Stadium',              'D'),
  ((SELECT id FROM public.clubs WHERE nombre='Paraguay'),       (SELECT id FROM public.clubs WHERE nombre='Australia'),      '2026-06-26 20:00:00+00', 'Levi''s Stadium',           'D'),

  -- GRUPO E
  ((SELECT id FROM public.clubs WHERE nombre='Alemania'),        (SELECT id FROM public.clubs WHERE nombre='Curazao'),         '2026-06-14 20:00:00+00', 'NRG Stadium',               'E'),
  ((SELECT id FROM public.clubs WHERE nombre='Costa de Marfil'), (SELECT id FROM public.clubs WHERE nombre='Ecuador'),         '2026-06-15 20:00:00+00', 'Lincoln Financial Field',   'E'),
  ((SELECT id FROM public.clubs WHERE nombre='Alemania'),        (SELECT id FROM public.clubs WHERE nombre='Costa de Marfil'), '2026-06-20 20:00:00+00', 'BMO Field',                 'E'),
  ((SELECT id FROM public.clubs WHERE nombre='Ecuador'),         (SELECT id FROM public.clubs WHERE nombre='Curazao'),         '2026-06-21 20:00:00+00', 'Arrowhead Stadium',         'E'),
  ((SELECT id FROM public.clubs WHERE nombre='Curazao'),         (SELECT id FROM public.clubs WHERE nombre='Costa de Marfil'), '2026-06-25 20:00:00+00', 'Lincoln Financial Field',   'E'),
  ((SELECT id FROM public.clubs WHERE nombre='Ecuador'),         (SELECT id FROM public.clubs WHERE nombre='Alemania'),        '2026-06-25 20:00:00+00', 'MetLife Stadium',           'E'),

  -- GRUPO F
  ((SELECT id FROM public.clubs WHERE nombre='Países Bajos'), (SELECT id FROM public.clubs WHERE nombre='Japón'),        '2026-06-14 20:00:00+00', 'AT&T Stadium',              'F'),
  ((SELECT id FROM public.clubs WHERE nombre='Suecia'),       (SELECT id FROM public.clubs WHERE nombre='Túnez'),        '2026-06-15 20:00:00+00', 'Estadio Akron',             'F'),
  ((SELECT id FROM public.clubs WHERE nombre='Suecia'),       (SELECT id FROM public.clubs WHERE nombre='Países Bajos'), '2026-06-20 20:00:00+00', 'NRG Stadium',               'F'),
  ((SELECT id FROM public.clubs WHERE nombre='Túnez'),        (SELECT id FROM public.clubs WHERE nombre='Japón'),        '2026-06-21 20:00:00+00', 'Estadio Akron',             'F'),
  ((SELECT id FROM public.clubs WHERE nombre='Túnez'),        (SELECT id FROM public.clubs WHERE nombre='Países Bajos'), '2026-06-26 20:00:00+00', 'Arrowhead Stadium',         'F'),
  ((SELECT id FROM public.clubs WHERE nombre='Japón'),        (SELECT id FROM public.clubs WHERE nombre='Suecia'),       '2026-06-26 20:00:00+00', 'AT&T Stadium',              'F'),

  -- GRUPO G
  ((SELECT id FROM public.clubs WHERE nombre='Bélgica'),       (SELECT id FROM public.clubs WHERE nombre='Egipto'),        '2026-06-15 20:00:00+00', 'Lumen Field',               'G'),
  ((SELECT id FROM public.clubs WHERE nombre='Irán'),          (SELECT id FROM public.clubs WHERE nombre='Nueva Zelanda'), '2026-06-16 20:00:00+00', 'SoFi Stadium',              'G'),
  ((SELECT id FROM public.clubs WHERE nombre='Bélgica'),       (SELECT id FROM public.clubs WHERE nombre='Irán'),          '2026-06-21 20:00:00+00', 'SoFi Stadium',              'G'),
  ((SELECT id FROM public.clubs WHERE nombre='Nueva Zelanda'), (SELECT id FROM public.clubs WHERE nombre='Egipto'),        '2026-06-22 20:00:00+00', 'BC Place',                  'G'),
  ((SELECT id FROM public.clubs WHERE nombre='Nueva Zelanda'), (SELECT id FROM public.clubs WHERE nombre='Bélgica'),       '2026-06-27 20:00:00+00', 'BC Place',                  'G'),
  ((SELECT id FROM public.clubs WHERE nombre='Egipto'),        (SELECT id FROM public.clubs WHERE nombre='Irán'),          '2026-06-27 20:00:00+00', 'Lumen Field',               'G'),

  -- GRUPO H
  ((SELECT id FROM public.clubs WHERE nombre='España'),         (SELECT id FROM public.clubs WHERE nombre='Cabo Verde'),     '2026-06-15 20:00:00+00', 'Mercedes-Benz Stadium',     'H'),
  ((SELECT id FROM public.clubs WHERE nombre='Arabia Saudita'), (SELECT id FROM public.clubs WHERE nombre='Uruguay'),        '2026-06-15 20:00:00+00', 'Hard Rock Stadium',         'H'),
  ((SELECT id FROM public.clubs WHERE nombre='España'),         (SELECT id FROM public.clubs WHERE nombre='Arabia Saudita'), '2026-06-21 20:00:00+00', 'Mercedes-Benz Stadium',     'H'),
  ((SELECT id FROM public.clubs WHERE nombre='Uruguay'),        (SELECT id FROM public.clubs WHERE nombre='Cabo Verde'),     '2026-06-21 20:00:00+00', 'Hard Rock Stadium',         'H'),
  ((SELECT id FROM public.clubs WHERE nombre='Cabo Verde'),     (SELECT id FROM public.clubs WHERE nombre='Arabia Saudita'), '2026-06-27 20:00:00+00', 'NRG Stadium',               'H'),
  ((SELECT id FROM public.clubs WHERE nombre='Uruguay'),        (SELECT id FROM public.clubs WHERE nombre='España'),         '2026-06-27 20:00:00+00', 'Estadio Akron',             'H'),

  -- GRUPO I
  ((SELECT id FROM public.clubs WHERE nombre='Francia'), (SELECT id FROM public.clubs WHERE nombre='Senegal'), '2026-06-16 20:00:00+00', 'MetLife Stadium',           'I'),
  ((SELECT id FROM public.clubs WHERE nombre='Irak'),    (SELECT id FROM public.clubs WHERE nombre='Noruega'), '2026-06-16 20:00:00+00', 'Gillette Stadium',          'I'),
  ((SELECT id FROM public.clubs WHERE nombre='Francia'), (SELECT id FROM public.clubs WHERE nombre='Irak'),    '2026-06-22 20:00:00+00', 'Lincoln Financial Field',   'I'),
  ((SELECT id FROM public.clubs WHERE nombre='Noruega'), (SELECT id FROM public.clubs WHERE nombre='Senegal'), '2026-06-23 20:00:00+00', 'BMO Field',                 'I'),
  ((SELECT id FROM public.clubs WHERE nombre='Noruega'), (SELECT id FROM public.clubs WHERE nombre='Francia'), '2026-06-26 20:00:00+00', 'Gillette Stadium',          'I'),
  ((SELECT id FROM public.clubs WHERE nombre='Senegal'), (SELECT id FROM public.clubs WHERE nombre='Irak'),    '2026-06-26 20:00:00+00', 'BMO Field',                 'I'),

  -- GRUPO J
  ((SELECT id FROM public.clubs WHERE nombre='Argentina'), (SELECT id FROM public.clubs WHERE nombre='Argelia'),   '2026-06-17 20:00:00+00', 'Arrowhead Stadium',         'J'),
  ((SELECT id FROM public.clubs WHERE nombre='Austria'),   (SELECT id FROM public.clubs WHERE nombre='Jordania'),  '2026-06-17 20:00:00+00', 'Levi''s Stadium',           'J'),
  ((SELECT id FROM public.clubs WHERE nombre='Argentina'), (SELECT id FROM public.clubs WHERE nombre='Austria'),   '2026-06-22 20:00:00+00', 'AT&T Stadium',              'J'),
  ((SELECT id FROM public.clubs WHERE nombre='Jordania'),  (SELECT id FROM public.clubs WHERE nombre='Argelia'),   '2026-06-23 20:00:00+00', 'Levi''s Stadium',           'J'),
  ((SELECT id FROM public.clubs WHERE nombre='Argelia'),   (SELECT id FROM public.clubs WHERE nombre='Austria'),   '2026-06-28 20:00:00+00', 'Arrowhead Stadium',         'J'),
  ((SELECT id FROM public.clubs WHERE nombre='Jordania'),  (SELECT id FROM public.clubs WHERE nombre='Argentina'), '2026-06-28 20:00:00+00', 'AT&T Stadium',              'J'),

  -- GRUPO K
  ((SELECT id FROM public.clubs WHERE nombre='Portugal'),   (SELECT id FROM public.clubs WHERE nombre='RD Congo'),   '2026-06-17 20:00:00+00', 'NRG Stadium',               'K'),
  ((SELECT id FROM public.clubs WHERE nombre='Uzbekistán'), (SELECT id FROM public.clubs WHERE nombre='Colombia'),   '2026-06-18 20:00:00+00', 'Estadio Azteca',            'K'),
  ((SELECT id FROM public.clubs WHERE nombre='Portugal'),   (SELECT id FROM public.clubs WHERE nombre='Uzbekistán'), '2026-06-23 20:00:00+00', 'NRG Stadium',               'K'),
  ((SELECT id FROM public.clubs WHERE nombre='Colombia'),   (SELECT id FROM public.clubs WHERE nombre='RD Congo'),   '2026-06-24 20:00:00+00', 'Estadio Akron',             'K'),
  ((SELECT id FROM public.clubs WHERE nombre='Colombia'),   (SELECT id FROM public.clubs WHERE nombre='Portugal'),   '2026-06-28 20:00:00+00', 'Hard Rock Stadium',         'K'),
  ((SELECT id FROM public.clubs WHERE nombre='RD Congo'),   (SELECT id FROM public.clubs WHERE nombre='Uzbekistán'), '2026-06-28 20:00:00+00', 'Mercedes-Benz Stadium',     'K'),

  -- GRUPO L
  ((SELECT id FROM public.clubs WHERE nombre='Inglaterra'), (SELECT id FROM public.clubs WHERE nombre='Croacia'), '2026-06-17 20:00:00+00', 'AT&T Stadium',              'L'),
  ((SELECT id FROM public.clubs WHERE nombre='Ghana'),      (SELECT id FROM public.clubs WHERE nombre='Panamá'),  '2026-06-18 20:00:00+00', 'BMO Field',                 'L'),
  ((SELECT id FROM public.clubs WHERE nombre='Inglaterra'), (SELECT id FROM public.clubs WHERE nombre='Ghana'),   '2026-06-23 20:00:00+00', 'Gillette Stadium',          'L'),
  ((SELECT id FROM public.clubs WHERE nombre='Panamá'),     (SELECT id FROM public.clubs WHERE nombre='Croacia'), '2026-06-24 20:00:00+00', 'Gillette Stadium',          'L'),
  ((SELECT id FROM public.clubs WHERE nombre='Panamá'),     (SELECT id FROM public.clubs WHERE nombre='Inglaterra'), '2026-06-27 20:00:00+00', 'MetLife Stadium',           'L'),
  ((SELECT id FROM public.clubs WHERE nombre='Croacia'),    (SELECT id FROM public.clubs WHERE nombre='Ghana'),   '2026-06-27 20:00:00+00', 'Lincoln Financial Field',   'L');
