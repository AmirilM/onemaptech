-- OneMapTech: seed stores (part 2)
insert into public.stores (store_code, store_name, concept) values
  ('QF34', 'DIGIPLUS LIPPO PLAZA JOGJA', 'Multibrand'),
  ('QF36', 'DIGIPLUS CIPUTRA SEMARANG', 'Multibrand'),
  ('QF37', 'DIGIPLUS JOGJA CITY MALL', 'Multibrand'),
  ('QF41', 'DIGIPLUS ARMADA TOWN SQUARE', 'Multibrand'),
  ('QF48', 'DIGIPLUS SLEMAN CITY HALL', 'Multibrand'),
  ('QF59', 'DIGIPLUS THE PARK SOLO', 'Multibrand'),
  ('QF76', 'DIGIPLUS DP MALL SEMARANG', 'Multibrand'),
  ('QF90', 'DIGIPLUS KLATEN TOWN SQUARE', 'Multibrand'),
  ('QF99', 'DIGIPLUS 23 SEMARANG MALL', 'Multibrand')
on conflict (store_code) do update
  set store_name = excluded.store_name, concept = excluded.concept;
