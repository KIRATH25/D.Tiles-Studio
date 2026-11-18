-- =============================================================================
-- D.Tiles Studio — Supabase migration (run once in Supabase → SQL Editor → Run)
-- Safe to re-run: every statement is idempotent.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. Admins: only users listed here can add / edit / delete products.
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 2. Products
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  sku               text not null unique,
  slug              text not null unique,
  name              text not null check (char_length(name) between 2 and 120),
  category          text not null check (category in (
                      'floor-tiles','wall-tiles','bathroom','kitchen','elevation','outdoor',
                      'marble','concrete','large-format','sanitaryware','hardware')),
  extra_categories  text[] not null default '{}',
  size              text not null check (char_length(size) between 1 and 60),
  price             numeric(12,2) not null check (price > 0),           -- ₹ per sq.ft for tiles, ₹ per unit otherwise
  unit              text not null default 'Boxes' check (unit in ('Boxes','Pieces','Sets')),
  coverage          numeric(8,2) check (coverage is null or coverage > 0),   -- sq.ft per box (tiles)
  pcs_per_box       integer check (pcs_per_box is null or pcs_per_box > 0),
  stock_qty         integer not null default 0 check (stock_qty >= 0),
  colours_available integer not null default 1 check (colours_available between 1 and 99),
  bulk_min_qty      integer check (bulk_min_qty is null or bulk_min_qty >= 2),
  bulk_discount_pct numeric(5,2) check (bulk_discount_pct is null or (bulk_discount_pct > 0 and bulk_discount_pct <= 80)),
  image1_url        text,
  image2_url        text,
  texture           jsonb,                       -- built-in rendered surfaces (seed products)
  brand             text default 'D.Tiles Studio',
  material          text,
  finish            text,
  colour            text,
  palette           text,
  thickness         text,
  description       text check (description is null or char_length(description) <= 400),
  long_description  text,
  flag              text,
  batch             text,
  rooms             text[] not null default '{}',
  pei               text,
  slip              text,
  is_active         boolean not null default true,
  sort_order        integer not null default 0,   -- new admin products = 0, so they show first
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint products_bulk_pair  check ((bulk_min_qty is null) = (bulk_discount_pct is null)),
  constraint products_has_image  check (image1_url is not null or texture is not null),
  constraint products_tile_cover check (unit <> 'Boxes' or coverage is not null)
);

create index if not exists products_listing_idx  on public.products (is_active, sort_order, created_at desc);
create index if not exists products_category_idx on public.products (category);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

alter table public.products enable row level security;

drop policy if exists "public reads active products" on public.products;
create policy "public reads active products" on public.products
  for select to anon, authenticated using (is_active or public.is_admin());

drop policy if exists "admins insert products" on public.products;
create policy "admins insert products" on public.products
  for insert to authenticated with check (public.is_admin());

drop policy if exists "admins update products" on public.products;
create policy "admins update products" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete products" on public.products;
create policy "admins delete products" on public.products
  for delete to authenticated using (public.is_admin());

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

-- -----------------------------------------------------------------------------
-- 3. Product image storage (public read, admin write, max 5 MB, images only)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/webp','image/jpeg','image/png'])
on conflict (id) do update
  set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads product images" on storage.objects;
create policy "public reads product images" on storage.objects
  for select to public using (bucket_id = 'product-images');

drop policy if exists "admins upload product images" on storage.objects;
create policy "admins upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admins update product images" on storage.objects;
create policy "admins update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admins delete product images" on storage.objects;
create policy "admins delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. Seed: the current website catalogue (skipped if already present)
-- -----------------------------------------------------------------------------
insert into public.products (sku, slug, name, category, extra_categories, size, price, unit, coverage, pcs_per_box, stock_qty, colours_available, bulk_min_qty, bulk_discount_pct, image1_url, image2_url, texture, brand, material, finish, colour, palette, thickness, description, long_description, flag, batch, rooms, pei, slip, sort_order) values
('DTS-FT-MCO-6060', 'marmo-calacatta-oro', 'Marmo Calacatta Oro', 'floor-tiles', array['marble','bathroom']::text[], '600×600mm', 195, 'Boxes', 15.5, 4, 150, 1, null, null, null, null, '{"t":"marble","base":"#F1ECE3","vein":"#A08E77","vein2":"#C7A877","seed":17,"scale":2,"sharp":12}'::jsonb, 'Atelier Import · Italy', 'Glazed Vitrified (GVT)', 'High Gloss Mirror', 'Calacatta Oro', 'white', '9mm', 'Soft white ground with golden veining, mirror-polished for luminous rooms.', 'A luminous Calacatta with warm gold vein threads. The high-gloss glaze multiplies daylight in compact apartments and corridors.', 'Honed Marble', '22C', array['living','bathroom']::text[], 'PEI 3', 'R9', 1),
('DTS-FT-PCM-6060', 'pietra-di-cemento', 'Pietra Di Cemento', 'floor-tiles', array['concrete','kitchen']::text[], '600×600mm', 145, 'Boxes', 15.5, 4, 150, 1, null, null, null, null, '{"t":"concrete","base":"#ABA8A2","seed":13,"speckle":true}'::jsonb, 'D.Tiles Atelier', 'Full Body Technical', 'Matte Unglazed', 'Pietra Grey', 'slate', '9mm', 'Fine-grained pietra stone with micro-speckle, quiet and practical.', 'A refined cement-stone hybrid with a fine mineral speckle that hides everyday dust — the quiet workhorse for kitchens and studios.', 'Matte Mineral', '31C', array['kitchen','commercial']::text[], 'PEI 5', 'R10', 2),
('DTS-FT-TRR-6012', 'travertino-romano', 'Travertino Romano', 'floor-tiles', array['bathroom','wall-tiles']::text[], '600×1200mm', 210, 'Boxes', 15.5, 2, 150, 1, null, null, null, null, '{"t":"travertine","base":"#E3D5BE","band":"#CDB896","seed":29,"cross":true}'::jsonb, 'Atelier Import · Italy', 'Natural Stone Composite', 'Tumbled Honed', 'Romano Ivory', 'limestone', '10mm', 'Open-pore Roman travertine in a soft ivory with cross-cut cloud.', 'Cross-cut travertine shows the stone''s cloudy, flowering face. A soft ivory tone with natural pits makes it ideal for spa-like bathrooms.', 'Natural Volcanic', '05B', array['bathroom','living']::text[], 'PEI 4', 'R10', 3),
('DTS-WT-TBF-3060', 'terracotta-bas-relief-fluted', 'Terracotta Bas-Relief Fluted', 'wall-tiles', array['elevation']::text[], '300×600mm', 240, 'Boxes', 15.5, 8, 150, 1, null, null, null, null, '{"t":"fluted","base":"#A9654A","seed":19,"ribs":9}'::jsonb, 'D.Tiles Atelier', 'Extruded Terracotta', 'Raw Fluted', 'Burnt Terracotta', 'terracotta', '18mm', 'Artisanal extruded wall cladding with deep shadow-casting flutes.', 'Hand-finished extruded terracotta with rhythmic flutes that cast long shadows through the day. Beautiful behind a TV unit, reception desk or on an entrance facade.', 'Fluted Architectural', '31C', array['living','outdoor','commercial']::text[], null, null, 4),
('DTS-FT-CGH-6012', 'castello-grigio-honed', 'Castello Grigio Honed Slab', 'floor-tiles', array['marble','bathroom']::text[], '600×1200mm', 165, 'Boxes', 15.5, 2, 150, 1, null, null, null, null, '{"t":"marble","base":"#D9D6D0","vein":"#7E7A75","vein2":"#A9A49D","seed":11,"scale":2.4,"sharp":9}'::jsonb, 'D.Tiles Atelier', 'Glazed Vitrified (GVT)', 'Honed Matte', 'Grigio Grey', 'slate', '9mm', 'Satin-honed marble surface with soft grey veining and rectified edges for near-seamless 2mm joints.', 'Castello Grigio captures the quiet movement of Italian grey marble in a honed, low-sheen glaze. Rectified edges allow a tight 2mm joint, while the through-glaze print keeps veining crisp across every slab of the batch.', 'Ready Stock • NCR', '24B', array['living','bedroom','commercial']::text[], 'PEI 4', 'R10', 5),
('DTS-FT-CMS-8016', 'crema-marfil-silk', 'Crema Marfil Silk Porcelain', 'floor-tiles', array['marble','large-format']::text[], '800×1600mm', 225, 'Boxes', 13.78, 1, 150, 1, null, null, null, null, '{"t":"marble","base":"#E7D7BC","vein":"#B79A6E","vein2":"#D2BC98","seed":23,"scale":1.8,"sharp":14,"cloud":0.5}'::jsonb, 'Atelier Import · Spain', 'Vitrified Porcelain', 'Satin Silk', 'Warm Beige', 'sandstone', '9mm', 'Smooth silk texture with ultra-low water absorption and warm Crema veining.', 'A softened interpretation of Spanish Crema Marfil — honey-cream ground with gentle tonal clouds and fine golden vein threads, in a silk finish that glows under warm light without glare.', 'Large Format Slabs', '19A', array['living','bedroom']::text[], 'PEI 4', 'R9', 6),
('DTS-FT-NCM-6012', 'nordic-cemento-matte', 'Nordic Cemento Matte', 'floor-tiles', array['concrete','outdoor']::text[], '600×1200mm', 135, 'Boxes', 15.5, 2, 150, 1, null, null, null, null, '{"t":"concrete","base":"#C9C5BE","seed":5,"pores":true}'::jsonb, 'D.Tiles Atelier', 'Full Body Technical', 'Matte', 'Ash Grey', 'greige', '10mm', 'Through-body colour, ideal for foyer and living spaces with heavy footfall.', 'A full-body technical porcelain with a soft cementitious cloud. Because colour runs through the entire body, chips and wear stay invisible — ideal for foyers, studios and retail.', 'Heavy Traffic PEI 5', '31C', array['living','commercial','kitchen']::text[], 'PEI 5', 'R10', 7),
('DTS-FT-TNV-6012', 'travertino-navona-vein-cut', 'Travertino Navona Vein-Cut', 'floor-tiles', array['wall-tiles','outdoor']::text[], '600×1200mm', 195, 'Boxes', 15.5, 2, 150, 1, null, null, null, null, '{"t":"travertine","base":"#DCCBB0","band":"#C4AE8C","seed":7}'::jsonb, 'Atelier Import · Italy', 'High-Density Porcelain', 'Honed Unfilled', 'Navona Beige', 'limestone', '9mm', 'Authentic Italian travertine mineral replica with vein-cut linear banding.', 'Vein-cut travertine reveals the stone''s sedimentary layers as soft horizontal bands. Our porcelain replica keeps the open pores and honed hand-feel, without the sealing and maintenance of natural stone.', 'Vein-Matched Run', '19A', array['living','outdoor','bathroom']::text[], 'PEI 4', 'R10', 8),
('DTS-FT-BAF-8080', 'basaltina-anthracite-flamed', 'Basaltina Anthracite Flamed', 'floor-tiles', array['outdoor','elevation']::text[], '800×800mm', 180, 'Boxes', 13.78, 2, 150, 1, null, null, null, null, '{"t":"slate","base":"#45423F","seed":41}'::jsonb, 'D.Tiles Atelier', 'Structured Porcelain', 'Flamed / Structured', 'Anthracite', 'charcoal', '10mm', 'High-friction coefficient, thermal expansion proof — an architect''s basalt.', 'Flamed basalt texture with a high-friction R11 surface, engineered for terraces, pool decks and covered driveways that must stay safe in monsoon conditions.', 'Indoor / Outdoor R11', '08D', array['outdoor','commercial']::text[], 'PEI 5', 'R11', 9),
('DTS-FT-CVM-1224', 'calacatta-vagli-marble-slab', 'Calacatta Vagli Marble Slab', 'floor-tiles', array['marble','large-format','kitchen']::text[], '1200×2400mm', 320, 'Boxes', 31, 1, 0, 1, null, null, null, null, '{"t":"marble","base":"#F3F0EA","vein":"#6E655C","vein2":"#C29A5E","seed":3,"scale":1.4,"sharp":6,"bold":true}'::jsonb, 'Atelier Import · Italy', 'Bookmatched Porcelain', 'Polished', 'White & Gold', 'white', '12mm', 'Continuous slab veining with dramatic gold threads — statement salon flooring.', 'Bookmatched Calacatta Vagli with bold charcoal and gold veining. Each 1200×2400 slab can be mirrored with its pair to create a continuous butterfly pattern on walls, islands or floors.', 'Grand Slab • 9mm', 'G9', array['living','kitchen','bathroom']::text[], 'PEI 3', 'R9', 10),
('DTS-FT-ROV-2012', 'rovere-natural-plank', 'Rovere Natural Plank', 'floor-tiles', array[]::text[], '200×1200mm', 125, 'Boxes', 15.5, 6, 150, 1, null, null, null, null, '{"t":"wood","base":"#BE9B74","seed":9}'::jsonb, 'D.Tiles Atelier', 'Wood-Look Porcelain', 'Matte Grain', 'Natural Oak', 'sandstone', '9mm', 'Warm European oak grain in termite-proof, water-resistant porcelain planks.', 'The warmth of brushed oak with none of the swelling or termites. Twelve unique graphic faces per batch keep the floor looking naturally random.', 'Bedroom Favourite', '14A', array['bedroom','living']::text[], 'PEI 4', 'R10', 11),
('DTS-WT-ZLS-1010', 'zellige-sabbia-handmade', 'Zellige Sabbia Handmade', 'wall-tiles', array['kitchen','bathroom']::text[], '100×100mm', 290, 'Boxes', 5.38, 50, 0, 1, null, null, null, null, '{"t":"zellige","base":"#D9C4A5","seed":33,"cells":6}'::jsonb, 'Atelier Import · Spain', 'Glazed Ceramic', 'Glossy Handmade', 'Sabbia Sand', 'sandstone', '8mm', 'Uneven handmade glaze that catches light like water on sand.', 'Each zellige-style tile has a slightly undulating face and pooled glaze, so no two pieces reflect light the same way. Ideal for backsplashes and shower niches.', 'Handmade Glaze', '03Z', array['kitchen','bathroom']::text[], null, null, 12),
('DTS-WT-OLG-7525', 'olive-grove-gloss-subway', 'Olive Grove Gloss Subway', 'wall-tiles', array['kitchen']::text[], '75×250mm', 165, 'Boxes', 8.88, 44, 150, 1, null, null, null, null, '{"t":"subway","base":"#7D806A","seed":37}'::jsonb, 'D.Tiles Atelier', 'Glazed Ceramic', 'Gloss', 'Olive Grove', 'olive', '8mm', 'Earthy olive subway with a soft crackle-free gloss and bevelled edge.', 'Muted olive subway tiles with a gently bevelled edge — lay them stacked, brick or herringbone for a warm, botanical kitchen.', 'Kitchen Backsplash', '12O', array['kitchen','bathroom']::text[], null, null, 13),
('DTS-WT-SLN-3060', 'sandstone-linen-wall', 'Sandstone Linen Wall', 'wall-tiles', array['bathroom']::text[], '300×600mm', 95, 'Boxes', 11.62, 6, 150, 1, null, null, null, null, '{"t":"linen","base":"#D7C7B1","seed":43}'::jsonb, 'D.Tiles Atelier', 'Ceramic Body', 'Satin Linen', 'Sandstone', 'sandstone', '8mm', 'Soft linen-weave texture in a calm sandstone tone for walls.', 'A fine fabric-like texture brings softness to bathroom and bedroom walls. Pairs beautifully with Travertino floors.', 'Value Collection', '27L', array['bathroom','bedroom']::text[], null, null, 14),
('DTS-BT-ARS-6012', 'arabescato-satin-bath', 'Arabescato Satin Bath Slab', 'bathroom', array['marble','wall-tiles']::text[], '600×1200mm', 210, 'Boxes', 15.5, 2, 150, 1, null, null, null, null, '{"t":"marble","base":"#EDEBE7","vein":"#5F5D5A","vein2":"#9D9993","seed":51,"scale":2.8,"sharp":7,"bold":true}'::jsonb, 'Atelier Import · Italy', 'Glazed Vitrified (GVT)', 'Satin Anti-Slip', 'Arabescato Grey', 'white', '9mm', 'Arabescato veining in a satin R10 finish that stays safe underfoot when wet.', 'Dramatic grey Arabescato veining with a micro-textured satin glaze rated R10 — sleek on walls and safe on wet bathroom floors.', 'Wet Area • R10', '18S', array['bathroom']::text[], 'PEI 3', 'R10', 15),
('DTS-BT-TZB-6060', 'terrazzo-bianco-chip', 'Terrazzo Bianco Chip', 'bathroom', array['floor-tiles','kitchen']::text[], '600×600mm', 175, 'Boxes', 15.5, 4, 150, 1, null, null, null, null, '{"t":"terrazzo","base":"#EAE2D5","seed":61}'::jsonb, 'D.Tiles Atelier', 'Porcelain Terrazzo', 'Matte', 'Bianco Multi', 'limestone', '9mm', 'Speckled terracotta, olive and charcoal chips on a soft limestone ground.', 'A playful yet restrained terrazzo with chips drawn from our brand palette — terracotta, olive, brass and charcoal on warm limestone.', 'Terrazzo Revival', '09T', array['bathroom','kitchen','commercial']::text[], 'PEI 4', 'R10', 16),
('DTS-KT-NMG-3060', 'nero-marquina-gloss', 'Nero Marquina Gloss', 'kitchen', array['wall-tiles','marble']::text[], '300×600mm', 155, 'Boxes', 11.62, 6, 150, 1, null, null, null, null, '{"t":"marble","base":"#25231F","vein":"#E9E4DA","vein2":"#8A847A","seed":71,"scale":2.2,"sharp":16}'::jsonb, 'Atelier Import · Spain', 'Glazed Ceramic', 'High Gloss', 'Nero Black', 'charcoal', '8mm', 'Deep black marble with crisp white veining for bold kitchens.', 'Classic Spanish Nero Marquina: a deep black ground with fine, lightning-white veins. Stunning as a full-height backsplash behind brass fittings.', 'Statement Backsplash', '16N', array['kitchen','bathroom']::text[], null, null, 17),
('DTS-EL-SLD-2060', 'slate-ledgestone-elevation', 'Slate Ledgestone Elevation', 'elevation', array['outdoor','wall-tiles']::text[], '150×600mm', 185, 'Boxes', 7.75, 8, 150, 1, null, null, null, null, '{"t":"ledge","base":"#5B5650","seed":81}'::jsonb, 'D.Tiles Atelier', 'Natural Stone Panel', 'Split Face', 'Charcoal Rust', 'charcoal', '15–25mm', 'Stacked split-face stone strips with deep natural shadow relief.', 'Split-face natural stone strips, pre-assembled into interlocking panels for fast installation on facades, boundary walls and feature walls.', '3D Facade', '02E', array['outdoor','living']::text[], null, null, 18),
('DTS-EL-TBC-2306', 'terra-brick-cladding', 'Terra Brick Cladding', 'elevation', array['wall-tiles']::text[], '230×60mm', 160, 'Boxes', 5.4, 36, 150, 1, null, null, null, null, '{"t":"brick","base":"#A55B42","seed":91}'::jsonb, 'D.Tiles Atelier', 'Clay Brick Slip', 'Wire-Cut', 'Terra Red', 'terracotta', '12mm', 'Wire-cut clay brick slips for an honest, warm exposed-brick facade.', 'Kiln-fired clay brick slips with wire-cut texture. All the warmth of an exposed brick wall at a fraction of the depth and weight.', 'Exposed Brick', '04K', array['outdoor','commercial','living']::text[], null, null, 19),
('DTS-OD-KTA-6060', 'kota-anti-skid-paver', 'Kota Anti-Skid Paver', 'outdoor', array['elevation']::text[], '600×600mm', 115, 'Boxes', 7.75, 2, 150, 1, null, null, null, null, '{"t":"stone","base":"#8E9180","seed":101}'::jsonb, 'D.Tiles Atelier', '20mm Porcelain Paver', 'Anti-Skid R12', 'Kota Green-Grey', 'olive', '20mm', 'Load-bearing 20mm paver for driveways, terraces and garden paths.', 'Inspired by Kota stone, engineered as 20mm porcelain. Lay on grass, gravel or pedestals — frost proof, anti-skid and car-load rated.', '20mm • R12', '20P', array['outdoor']::text[], 'PEI 5', 'R12', 20),
('DTS-LF-STG-1632', 'statuario-grande', 'Statuario Grande', 'large-format', array['marble','kitchen']::text[], '1600×3200mm', 410, 'Boxes', 55.1, 1, 0, 1, null, null, null, null, '{"t":"marble","base":"#F5F3EF","vein":"#77736D","vein2":"#B4AFA8","seed":113,"scale":1.2,"sharp":8,"bold":true}'::jsonb, 'Atelier Import · Italy', 'Sintered Porcelain Slab', 'Polished', 'Statuario White', 'white', '12mm', 'Kitchen-island grade sintered slab with bold grey Statuario veining.', 'A 1600×3200 sintered slab — heat, scratch and stain resistant enough for kitchen islands, yet elegant enough for full-height walls with zero visible joints.', 'Sintered Slab', 'S1', array['kitchen','living','commercial']::text[], 'PEI 3', 'R9', 21),
('DTS-CS-MCS-1212', 'microcemento-sabbia', 'Microcemento Sabbia', 'concrete', array['large-format','floor-tiles']::text[], '1200×1200mm', 240, 'Boxes', 15.5, 1, 150, 1, null, null, null, null, '{"t":"concrete","base":"#CBBFAF","seed":121,"trowel":true}'::jsonb, 'Atelier Import · Spain', 'Full Body Porcelain', 'Soft Matte', 'Sabbia Greige', 'greige', '10mm', 'Trowel-like micro-cement clouds in a soft greige — calm and continuous.', 'The hand-trowelled look of micro-cement in a large 1200×1200 format — fewer joints, a soft matte touch and a calm, continuous floor.', 'Seamless Look', '11M', array['living','bedroom','commercial']::text[], 'PEI 4', 'R10', 22),
('DTS-SW-OFB-1708', 'ovale-freestanding-bathtub', 'Ovale Freestanding Bathtub', 'sanitaryware', array[]::text[], '1700×800mm', 68500, 'Pieces', null, null, 0, 1, null, null, 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=78', null, null, 'D.Tiles Bath', 'Solid Surface Resin', 'Matte White', 'Chalk White', 'white', null, 'Soft oval freestanding tub cast in velvety matte solid surface.', 'Cast from mineral solid surface, the Ovale tub holds heat longer than acrylic and has a velvety matte touch that can be renewed with a light polish.', 'Sculpted Suite', 'B7', array['bathroom']::text[], null, null, 23),
('DTS-SW-PWC-5236', 'pietra-wall-hung-wc', 'Pietra Wall-Hung WC Set', 'sanitaryware', array[]::text[], '520×360mm', 24900, 'Sets', null, null, 150, 1, null, null, 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=78', null, null, 'D.Tiles Bath', 'Vitreous China', 'Matte Stone', 'Stone Grey', 'greige', null, 'Rimless wall-hung WC with soft-close seat and concealed cistern frame.', 'A rimless wall-hung WC in matte stone vitreous china, supplied as a set with soft-close slim seat and concealed cistern frame with dual-flush plate.', 'Rimless', 'W2', array['bathroom']::text[], null, null, 24),
('DTS-SW-CCB-4600', 'cono-countertop-basin', 'Cono Countertop Basin', 'sanitaryware', array[]::text[], 'Ø460mm', 8900, 'Pieces', null, null, 150, 1, null, null, 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=1200&q=78', null, null, 'D.Tiles Bath', 'Fine Fireclay', 'Matte Charcoal', 'Charcoal', 'charcoal', null, 'Thin-rim conical vessel basin in matte charcoal fireclay.', 'A thin 6mm rim and soft conical bowl in matte charcoal fireclay — an architectural accent on stone or timber vanities.', 'Matte Charcoal', 'C4', array['bathroom']::text[], null, null, 25),
('DTS-HW-BPT-1025', 'brass-profile-trim', 'Brushed Brass Profile Trim', 'hardware', array[]::text[], '10mm × 2.5m', 1250, 'Pieces', null, null, 150, 1, null, null, null, null, '{"t":"metal","base":"#B09A74","seed":131}'::jsonb, 'D.Tiles Atelier', 'Solid Brass', 'Brushed', 'Muted Brass', 'brass', null, 'Solid brass L-profile for crisp tile edges, steps and transitions.', 'Solid brass edge profile for tile edges, stair nosing and floor transitions. Brushed finish develops a soft patina over time.', 'Precision Joinery', 'H1', array['living','bathroom','kitchen']::text[], null, null, 26),
('DTS-HW-EGS-0001', 'epoxy-grout-sandstone', 'Epoxy Grout — Sandstone', 'hardware', array[]::text[], '1 kg kit', 650, 'Pieces', null, null, 150, 1, null, null, null, null, '{"t":"concrete","base":"#D3C2A8","seed":141,"speckle":true}'::jsonb, 'D.Tiles Atelier', 'Two-Part Epoxy', 'Satin', 'Sandstone', 'sandstone', null, 'Stain-proof, waterproof epoxy grout, colour-matched to warm surfaces.', 'A two-part epoxy grout that never stains or cracks — ideal for kitchens and wet areas. One kilo covers approximately 30–40 sq.ft at 2mm joints.', 'Stain-Proof Joints', 'G3', array['bathroom','kitchen']::text[], null, null, 27)
on conflict (sku) do nothing;

-- -----------------------------------------------------------------------------
-- 5. Admins — exactly these two accounts, nobody else.
--    (Login accounts already exist in Authentication → Users.)
--      Username "Vicky Sharma"        → vickysharma@admin.dtilesstudio.com
--      Username "Kirath Kumar Sharma" → kirathkumarsharma@admin.dtilesstudio.com
-- -----------------------------------------------------------------------------
delete from public.admins
where email not in ('vickysharma@admin.dtilesstudio.com', 'kirathkumarsharma@admin.dtilesstudio.com');

insert into public.admins (user_id, email)
select id, email from auth.users
where email in ('vickysharma@admin.dtilesstudio.com', 'kirathkumarsharma@admin.dtilesstudio.com')
on conflict (user_id) do update set email = excluded.email;

-- Check: this should list exactly 2 rows.
select a.email, u.raw_user_meta_data->>'full_name' as name from public.admins a join auth.users u on u.id = a.user_id;
