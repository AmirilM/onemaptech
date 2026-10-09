-- OneMapTech: seed stores (part 1)
insert into public.stores (store_code, store_name, concept) values
  ('QA02', 'SAMSUNG RITA SUPERMALL TEGAL', 'Samsung'),
  ('QA03', 'SAMSUNG PACIFIC MALL TEGAL', 'Samsung'),
  ('QF05', 'DIGIPLUS SOLO PARAGON MALL', 'Multibrand'),
  ('QF09', 'DIGIPLUS PAKUWON MALL YOGYAKARTA', 'Multibrand'),
  ('QF20', 'DIGIPLUS THE PARK SEMARANG', 'Multibrand'),
  ('QF27', 'DIGIPLUS RITA SUPERMALL PURWOKERTO', 'Multibrand'),
  ('QF28', 'DIGIPLUS RITA SUPERMALL TEGAL', 'Multibrand'),
  ('QF31', 'DIGIPLUS QUEEN CITY MALL', 'Multibrand')
on conflict (store_code) do update
  set store_name = excluded.store_name, concept = excluded.concept;
