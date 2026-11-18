/* ==========================================================================
   D.Tiles Studio — Site configuration & catalogue
   Edit this one file to update the phone number, address, hours, prices,
   and products. Every page, calculator and WhatsApp message reads from here.
   ========================================================================== */

window.DT = window.DT || {};

DT.config = {
  brand: "D.Tiles Studio",
  tagline: "Surfaces • Spaces • Living",
  motto: "Designed around the way you live.",
  // WhatsApp number: country code + number, digits only.
  whatsapp: "919990679005",
  phoneDisplay: "+91 99906 79005",
  phoneTel: "+919990679005",
  address: {
    line1: "D.Tiles Studio, Shop No. 7, Gyan Khand 4",
    line2: "Mangla Bazzar Road",
    city: "Indirapuram, Ghaziabad",
    state: "Uttar Pradesh",
    pin: "201014",
    short: "Indirapuram, Ghaziabad"
  },
  mapLink: "https://share.google/Y5X7vVfURHErlHGjQ",
  mapEmbed: "https://maps.google.com/maps?q=D.Tiles%20Studio%2C%20Gyan%20Khand%204%2C%20Indirapuram%2C%20Ghaziabad%20201014&z=16&output=embed",
  // 0 = Sunday … 6 = Saturday. Times in 24h.
  hours: [
    { day: "Sunday",    open: "11:00", close: "18:00" },
    { day: "Monday",    open: "10:00", close: "20:00" },
    { day: "Tuesday",   open: "10:00", close: "20:00" },
    { day: "Wednesday", open: "10:00", close: "20:00" },
    { day: "Thursday",  open: "10:00", close: "20:00" },
    { day: "Friday",    open: "10:00", close: "20:00" },
    { day: "Saturday",  open: "10:00", close: "20:00" }
  ],
  // Supabase (public, browser-safe values only — NEVER put the secret key here).
  supabaseUrl: "https://dginekfsemgmkzojgstw.supabase.co",
  supabaseKey: "sb_publishable_zfwhyX-8ymPeglNVgHkbuw_JLosucxJ",
  imageBucket: "product-images",
  // Admin usernames → their Supabase login email. Passcodes live only in Supabase.
  adminUsers: {
    "vicky sharma": "vickysharma@admin.dtilesstudio.com",
    "kirath kumar sharma": "kirathkumarsharma@admin.dtilesstudio.com"
  },
  gstRate: 0.18,
  sampleFee: 150,
  freeSamples: 3,
  maxSamples: 5
};

/* Architectural photography (Unsplash CDN). */
DT.photo = function (id, w) {
  return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + (w || 1200) + "&q=78";
};
DT.img = {
  hero: "1631679706909-1844bbd07221",
  living: "1615529182904-14819c35db37",
  living2: "1604014237800-1c9102c219da",
  living3: "1616046229478-9901c5536a45",
  living4: "1600607687939-ce8a6c25118c",
  windows: "1600566753086-00f18fb6b3ea",
  bedroom: "1600607687644-c7171b42498f",
  bathroom: "1564540583246-934409427776",
  bathTub: "1620626011761-996317b8d101",
  bathGrey: "1600566752355-35792bedcfea",
  bathDark: "1604709177225-055f99402ea3",
  kitchen: "1507089947368-19c1da9775ae",
  kitchen2: "1541123437800-1bb1317badc2",
  kitchenDark: "1600489000022-c2086d79f9d4",
  villa: "1613490493576-7fde63acd811",
  exterior: "1600047509807-ba8f99d2cdde",
  exteriorNight: "1600585154340-be6161a56a0c",
  poolStair: "1600573472550-8090b5e0745e",
  commercial: "1497366811353-6870744d04b2",
  corridor: "1497366216548-37526070297c",
  minimal: "1533090161767-e6ffed986c88",
  stair: "1502005229762-cf1b2da7c5d6"
};

/* Categories (Shop page + navigation). */
DT.categories = [
  { id: "floor-tiles",  no: "01", name: "Floor Tiles",          kicker: "Foundation",      photo: "living4",   desc: "Large-format porcelain, honed sedimentary stones and timeless foundational surfaces." },
  { id: "wall-tiles",   no: "02", name: "Wall Tiles",           kicker: "Tactility",       photo: "living2",   desc: "Decorative architectural relief, handmade zellige and glazed ceramics for vertical planes." },
  { id: "bathroom",     no: "03", name: "Bathroom Tiles",       kicker: "Wet Sanctuary",   photo: "bathroom",  desc: "Anti-slip matte finishes, veined marble looks and calm surfaces for wet zones." },
  { id: "kitchen",      no: "04", name: "Kitchen Tiles",        kicker: "Culinary",        photo: "kitchen",   desc: "Stain-resistant backsplash and counter surfaces that age gracefully with everyday cooking." },
  { id: "elevation",    no: "05", name: "Elevation Tiles",      kicker: "Exterior",        photo: "exterior",  desc: "Weather-proof stone cladding and textured facade panels with deep natural shadow lines." },
  { id: "outdoor",      no: "06", name: "Outdoor & Decking",    kicker: "Landscape",       photo: "villa",     desc: "High-load 20mm porcelain pavers and frost-resistant R11–R12 anti-skid surfaces." },
  { id: "marble",       no: "07", name: "Marble-Inspired Slabs",kicker: "Natural Veil",    photo: "bathTub",   desc: "Continuous veining in porcelain — the drama of Calacatta and Statuario, without the upkeep." },
  { id: "concrete",     no: "08", name: "Concrete & Stone",     kicker: "Brutal Minimal",  photo: "commercial",desc: "Minimal micro-cement, honed concrete and quiet mineral surfaces for modern interiors." },
  { id: "large-format", no: "09", name: "Large Format Slabs",   kicker: "Seamless",        photo: "windows",   desc: "Uninterrupted architectural surfaces up to 1600×3200mm with minimal grout lines." },
  { id: "sanitaryware", no: "10", name: "Sanitaryware",         kicker: "Ceramic Suites",  photo: "bathGrey",  desc: "Sculpted basins, freestanding tubs and wall-hung suites in matte mineral finishes." },
  { id: "hardware",     no: "11", name: "Hardware & Trims",     kicker: "Precision Joinery",photo: "minimal",  desc: "Brushed brass profiles, epoxy grouts and finishing details that complete the surface." }
];

/* Spaces (Explore by Space). */
DT.spaces = [
  { id: "living",     name: "Living Room",          photo: "living",     desc: "Warm limestone and large-format porcelain for serene everyday living." },
  { id: "bedroom",    name: "Bedroom",              photo: "bedroom",    desc: "Soft-toned matte surfaces that feel calm and barefoot-friendly." },
  { id: "bathroom",   name: "Bathroom",             photo: "bathroom",   desc: "Honed marble looks, R10 anti-slip textures and water-resistant finishes." },
  { id: "kitchen",    name: "Kitchen",              photo: "kitchen",    desc: "Tactile backsplash and stain-resistant floors for culinary spaces." },
  { id: "outdoor",    name: "Outdoor & Elevation",  photo: "villa",      desc: "Weather-proof facades, textured stone and frost-resistant pavers." },
  { id: "commercial", name: "Commercial Spaces",    photo: "commercial", desc: "High-traffic PEI 5 surfaces for studios, offices and hospitality." }
];

/* Filter vocab. */
DT.palette = [
  { id: "limestone",  name: "Limestone",  hex: "#EFE7DA" },
  { id: "sandstone",  name: "Sandstone",  hex: "#D8C6AE" },
  { id: "slate",      name: "Slate",      hex: "#8D8F8E" },
  { id: "charcoal",   name: "Charcoal",   hex: "#34312E" },
  { id: "terracotta", name: "Terracotta", hex: "#A86A4E" },
  { id: "greige",     name: "Greige",     hex: "#B8AFA3" },
  { id: "olive",      name: "Olive",      hex: "#7A7D6B" },
  { id: "brass",      name: "Muted Brass",hex: "#B09A74" },
  { id: "white",      name: "Statuary White", hex: "#F7F5F1" }
];

/* --------------------------------------------------------------------------
   Products
   price  = ₹ per sq.ft for tiles (unit "Boxes"); ₹ per unit for others.
   coverage = sq.ft per box (tiles only).
   tex = procedural texture recipe used for product imagery.
   -------------------------------------------------------------------------- */
DT.products = [
  { sku: "DTS-FT-CGH-6012", slug: "castello-grigio-honed", name: "Castello Grigio Honed Slab", brand: "D.Tiles Atelier", cats: ["floor-tiles","marble","bathroom"], category: "Floor Tiles",
    material: "Glazed Vitrified (GVT)", finish: "Honed Matte", colour: "Grigio Grey", palette: "slate", size: "600×1200mm", thickness: "9mm",
    price: 165, coverage: 15.5, pcsPerBox: 2, unit: "Boxes", stock: "in", batch: "24B", rooms: ["living","bedroom","commercial"], pei: "PEI 4", slip: "R10",
    flag: "Ready Stock • NCR", desc: "Satin-honed marble surface with soft grey veining and rectified edges for near-seamless 2mm joints.",
    long: "Castello Grigio captures the quiet movement of Italian grey marble in a honed, low-sheen glaze. Rectified edges allow a tight 2mm joint, while the through-glaze print keeps veining crisp across every slab of the batch.",
    tex: { t: "marble", base: "#D9D6D0", vein: "#7E7A75", vein2: "#A9A49D", seed: 11, scale: 2.4, sharp: 9 } },

  { sku: "DTS-FT-CMS-8016", slug: "crema-marfil-silk", name: "Crema Marfil Silk Porcelain", brand: "Atelier Import · Spain", cats: ["floor-tiles","marble","large-format"], category: "Floor Tiles",
    material: "Vitrified Porcelain", finish: "Satin Silk", colour: "Warm Beige", palette: "sandstone", size: "800×1600mm", thickness: "9mm",
    price: 225, coverage: 13.78, pcsPerBox: 1, unit: "Boxes", stock: "in", batch: "19A", rooms: ["living","bedroom"], pei: "PEI 4", slip: "R9",
    flag: "Large Format Slabs", desc: "Smooth silk texture with ultra-low water absorption and warm Crema veining.",
    long: "A softened interpretation of Spanish Crema Marfil — honey-cream ground with gentle tonal clouds and fine golden vein threads, in a silk finish that glows under warm light without glare.",
    tex: { t: "marble", base: "#E7D7BC", vein: "#B79A6E", vein2: "#D2BC98", seed: 23, scale: 1.8, sharp: 14, cloud: .5 } },

  { sku: "DTS-FT-NCM-6012", slug: "nordic-cemento-matte", name: "Nordic Cemento Matte", brand: "D.Tiles Atelier", cats: ["floor-tiles","concrete","outdoor"], category: "Floor Tiles",
    material: "Full Body Technical", finish: "Matte", colour: "Ash Grey", palette: "greige", size: "600×1200mm", thickness: "10mm",
    price: 135, coverage: 15.5, pcsPerBox: 2, unit: "Boxes", stock: "in", batch: "31C", rooms: ["living","commercial","kitchen"], pei: "PEI 5", slip: "R10",
    flag: "Heavy Traffic PEI 5", desc: "Through-body colour, ideal for foyer and living spaces with heavy footfall.",
    long: "A full-body technical porcelain with a soft cementitious cloud. Because colour runs through the entire body, chips and wear stay invisible — ideal for foyers, studios and retail.",
    tex: { t: "concrete", base: "#C9C5BE", seed: 5, pores: true } },

  { sku: "DTS-FT-TNV-6012", slug: "travertino-navona-vein-cut", name: "Travertino Navona Vein-Cut", brand: "Atelier Import · Italy", cats: ["floor-tiles","wall-tiles","outdoor"], category: "Floor Tiles",
    material: "High-Density Porcelain", finish: "Honed Unfilled", colour: "Navona Beige", palette: "limestone", size: "600×1200mm", thickness: "9mm",
    price: 195, coverage: 15.5, pcsPerBox: 2, unit: "Boxes", stock: "in", batch: "19A", rooms: ["living","outdoor","bathroom"], pei: "PEI 4", slip: "R10",
    flag: "Vein-Matched Run", desc: "Authentic Italian travertine mineral replica with vein-cut linear banding.",
    long: "Vein-cut travertine reveals the stone's sedimentary layers as soft horizontal bands. Our porcelain replica keeps the open pores and honed hand-feel, without the sealing and maintenance of natural stone.",
    tex: { t: "travertine", base: "#DCCBB0", band: "#C4AE8C", seed: 7 } },

  { sku: "DTS-FT-BAF-8080", slug: "basaltina-anthracite-flamed", name: "Basaltina Anthracite Flamed", brand: "D.Tiles Atelier", cats: ["floor-tiles","outdoor","elevation"], category: "Floor Tiles",
    material: "Structured Porcelain", finish: "Flamed / Structured", colour: "Anthracite", palette: "charcoal", size: "800×800mm", thickness: "10mm",
    price: 180, coverage: 13.78, pcsPerBox: 2, unit: "Boxes", stock: "in", batch: "08D", rooms: ["outdoor","commercial"], pei: "PEI 5", slip: "R11",
    flag: "Indoor / Outdoor R11", desc: "High-friction coefficient, thermal expansion proof — an architect's basalt.",
    long: "Flamed basalt texture with a high-friction R11 surface, engineered for terraces, pool decks and covered driveways that must stay safe in monsoon conditions.",
    tex: { t: "slate", base: "#45423F", seed: 41 } },

  { sku: "DTS-FT-CVM-1224", slug: "calacatta-vagli-marble-slab", name: "Calacatta Vagli Marble Slab", brand: "Atelier Import · Italy", cats: ["floor-tiles","marble","large-format","kitchen"], category: "Marble-Inspired Slabs",
    material: "Bookmatched Porcelain", finish: "Polished", colour: "White & Gold", palette: "white", size: "1200×2400mm", thickness: "12mm",
    price: 320, coverage: 31.0, pcsPerBox: 1, unit: "Boxes", stock: "order", batch: "G9", rooms: ["living","kitchen","bathroom"], pei: "PEI 3", slip: "R9",
    flag: "Grand Slab • 9mm", desc: "Continuous slab veining with dramatic gold threads — statement salon flooring.",
    long: "Bookmatched Calacatta Vagli with bold charcoal and gold veining. Each 1200×2400 slab can be mirrored with its pair to create a continuous butterfly pattern on walls, islands or floors.",
    tex: { t: "marble", base: "#F3F0EA", vein: "#6E655C", vein2: "#C29A5E", seed: 3, scale: 1.4, sharp: 6, bold: true } },

  { sku: "DTS-FT-ROV-2012", slug: "rovere-natural-plank", name: "Rovere Natural Plank", brand: "D.Tiles Atelier", cats: ["floor-tiles"], category: "Floor Tiles",
    material: "Wood-Look Porcelain", finish: "Matte Grain", colour: "Natural Oak", palette: "sandstone", size: "200×1200mm", thickness: "9mm",
    price: 125, coverage: 15.5, pcsPerBox: 6, unit: "Boxes", stock: "in", batch: "14A", rooms: ["bedroom","living"], pei: "PEI 4", slip: "R10",
    flag: "Bedroom Favourite", desc: "Warm European oak grain in termite-proof, water-resistant porcelain planks.",
    long: "The warmth of brushed oak with none of the swelling or termites. Twelve unique graphic faces per batch keep the floor looking naturally random.",
    tex: { t: "wood", base: "#BE9B74", seed: 9 } },

  { sku: "DTS-FT-MCO-6060", slug: "marmo-calacatta-oro", name: "Marmo Calacatta Oro", brand: "Atelier Import · Italy", cats: ["floor-tiles","marble","bathroom"], category: "Marble-Inspired Slabs",
    material: "Glazed Vitrified (GVT)", finish: "High Gloss Mirror", colour: "Calacatta Oro", palette: "white", size: "600×600mm", thickness: "9mm",
    price: 195, coverage: 15.5, pcsPerBox: 4, unit: "Boxes", stock: "in", batch: "22C", rooms: ["living","bathroom"], pei: "PEI 3", slip: "R9",
    flag: "Honed Marble", desc: "Soft white ground with golden veining, mirror-polished for luminous rooms.",
    long: "A luminous Calacatta with warm gold vein threads. The high-gloss glaze multiplies daylight in compact apartments and corridors.",
    tex: { t: "marble", base: "#F1ECE3", vein: "#A08E77", vein2: "#C7A877", seed: 17, scale: 2.0, sharp: 12 } },

  { sku: "DTS-FT-PCM-6060", slug: "pietra-di-cemento", name: "Pietra Di Cemento", brand: "D.Tiles Atelier", cats: ["floor-tiles","concrete","kitchen"], category: "Concrete & Stone",
    material: "Full Body Technical", finish: "Matte Unglazed", colour: "Pietra Grey", palette: "slate", size: "600×600mm", thickness: "9mm",
    price: 145, coverage: 15.5, pcsPerBox: 4, unit: "Boxes", stock: "in", batch: "31C", rooms: ["kitchen","commercial"], pei: "PEI 5", slip: "R10",
    flag: "Matte Mineral", desc: "Fine-grained pietra stone with micro-speckle, quiet and practical.",
    long: "A refined cement-stone hybrid with a fine mineral speckle that hides everyday dust — the quiet workhorse for kitchens and studios.",
    tex: { t: "concrete", base: "#ABA8A2", seed: 13, speckle: true } },

  { sku: "DTS-FT-TRR-6012", slug: "travertino-romano", name: "Travertino Romano", brand: "Atelier Import · Italy", cats: ["floor-tiles","bathroom","wall-tiles"], category: "Floor Tiles",
    material: "Natural Stone Composite", finish: "Tumbled Honed", colour: "Romano Ivory", palette: "limestone", size: "600×1200mm", thickness: "10mm",
    price: 210, coverage: 15.5, pcsPerBox: 2, unit: "Boxes", stock: "in", batch: "05B", rooms: ["bathroom","living"], pei: "PEI 4", slip: "R10",
    flag: "Natural Volcanic", desc: "Open-pore Roman travertine in a soft ivory with cross-cut cloud.",
    long: "Cross-cut travertine shows the stone's cloudy, flowering face. A soft ivory tone with natural pits makes it ideal for spa-like bathrooms.",
    tex: { t: "travertine", base: "#E3D5BE", band: "#CDB896", seed: 29, cross: true } },

  { sku: "DTS-WT-TBF-3060", slug: "terracotta-bas-relief-fluted", name: "Terracotta Bas-Relief Fluted", brand: "D.Tiles Atelier", cats: ["wall-tiles","elevation"], category: "Wall Tiles",
    material: "Extruded Terracotta", finish: "Raw Fluted", colour: "Burnt Terracotta", palette: "terracotta", size: "300×600mm", thickness: "18mm",
    price: 240, coverage: 15.5, pcsPerBox: 8, unit: "Boxes", stock: "in", batch: "31C", rooms: ["living","outdoor","commercial"], pei: "—", slip: "—",
    flag: "Fluted Architectural", desc: "Artisanal extruded wall cladding with deep shadow-casting flutes.",
    long: "Hand-finished extruded terracotta with rhythmic flutes that cast long shadows through the day. Beautiful behind a TV unit, reception desk or on an entrance facade.",
    tex: { t: "fluted", base: "#A9654A", seed: 19, ribs: 9 } },

  { sku: "DTS-WT-ZLS-1010", slug: "zellige-sabbia-handmade", name: "Zellige Sabbia Handmade", brand: "Atelier Import · Spain", cats: ["wall-tiles","kitchen","bathroom"], category: "Wall Tiles",
    material: "Glazed Ceramic", finish: "Glossy Handmade", colour: "Sabbia Sand", palette: "sandstone", size: "100×100mm", thickness: "8mm",
    price: 290, coverage: 5.38, pcsPerBox: 50, unit: "Boxes", stock: "order", batch: "03Z", rooms: ["kitchen","bathroom"], pei: "—", slip: "—",
    flag: "Handmade Glaze", desc: "Uneven handmade glaze that catches light like water on sand.",
    long: "Each zellige-style tile has a slightly undulating face and pooled glaze, so no two pieces reflect light the same way. Ideal for backsplashes and shower niches.",
    tex: { t: "zellige", base: "#D9C4A5", seed: 33, cells: 6 } },

  { sku: "DTS-WT-OLG-7525", slug: "olive-grove-gloss-subway", name: "Olive Grove Gloss Subway", brand: "D.Tiles Atelier", cats: ["wall-tiles","kitchen"], category: "Wall Tiles",
    material: "Glazed Ceramic", finish: "Gloss", colour: "Olive Grove", palette: "olive", size: "75×250mm", thickness: "8mm",
    price: 165, coverage: 8.88, pcsPerBox: 44, unit: "Boxes", stock: "in", batch: "12O", rooms: ["kitchen","bathroom"], pei: "—", slip: "—",
    flag: "Kitchen Backsplash", desc: "Earthy olive subway with a soft crackle-free gloss and bevelled edge.",
    long: "Muted olive subway tiles with a gently bevelled edge — lay them stacked, brick or herringbone for a warm, botanical kitchen.",
    tex: { t: "subway", base: "#7D806A", seed: 37 } },

  { sku: "DTS-WT-SLN-3060", slug: "sandstone-linen-wall", name: "Sandstone Linen Wall", brand: "D.Tiles Atelier", cats: ["wall-tiles","bathroom"], category: "Wall Tiles",
    material: "Ceramic Body", finish: "Satin Linen", colour: "Sandstone", palette: "sandstone", size: "300×600mm", thickness: "8mm",
    price: 95, coverage: 11.62, pcsPerBox: 6, unit: "Boxes", stock: "in", batch: "27L", rooms: ["bathroom","bedroom"], pei: "—", slip: "—",
    flag: "Value Collection", desc: "Soft linen-weave texture in a calm sandstone tone for walls.",
    long: "A fine fabric-like texture brings softness to bathroom and bedroom walls. Pairs beautifully with Travertino floors.",
    tex: { t: "linen", base: "#D7C7B1", seed: 43 } },

  { sku: "DTS-BT-ARS-6012", slug: "arabescato-satin-bath", name: "Arabescato Satin Bath Slab", brand: "Atelier Import · Italy", cats: ["bathroom","marble","wall-tiles"], category: "Bathroom Tiles",
    material: "Glazed Vitrified (GVT)", finish: "Satin Anti-Slip", colour: "Arabescato Grey", palette: "white", size: "600×1200mm", thickness: "9mm",
    price: 210, coverage: 15.5, pcsPerBox: 2, unit: "Boxes", stock: "in", batch: "18S", rooms: ["bathroom"], pei: "PEI 3", slip: "R10",
    flag: "Wet Area • R10", desc: "Arabescato veining in a satin R10 finish that stays safe underfoot when wet.",
    long: "Dramatic grey Arabescato veining with a micro-textured satin glaze rated R10 — sleek on walls and safe on wet bathroom floors.",
    tex: { t: "marble", base: "#EDEBE7", vein: "#5F5D5A", vein2: "#9D9993", seed: 51, scale: 2.8, sharp: 7, bold: true } },

  { sku: "DTS-BT-TZB-6060", slug: "terrazzo-bianco-chip", name: "Terrazzo Bianco Chip", brand: "D.Tiles Atelier", cats: ["bathroom","floor-tiles","kitchen"], category: "Bathroom Tiles",
    material: "Porcelain Terrazzo", finish: "Matte", colour: "Bianco Multi", palette: "limestone", size: "600×600mm", thickness: "9mm",
    price: 175, coverage: 15.5, pcsPerBox: 4, unit: "Boxes", stock: "in", batch: "09T", rooms: ["bathroom","kitchen","commercial"], pei: "PEI 4", slip: "R10",
    flag: "Terrazzo Revival", desc: "Speckled terracotta, olive and charcoal chips on a soft limestone ground.",
    long: "A playful yet restrained terrazzo with chips drawn from our brand palette — terracotta, olive, brass and charcoal on warm limestone.",
    tex: { t: "terrazzo", base: "#EAE2D5", seed: 61 } },

  { sku: "DTS-KT-NMG-3060", slug: "nero-marquina-gloss", name: "Nero Marquina Gloss", brand: "Atelier Import · Spain", cats: ["kitchen","wall-tiles","marble"], category: "Kitchen Tiles",
    material: "Glazed Ceramic", finish: "High Gloss", colour: "Nero Black", palette: "charcoal", size: "300×600mm", thickness: "8mm",
    price: 155, coverage: 11.62, pcsPerBox: 6, unit: "Boxes", stock: "in", batch: "16N", rooms: ["kitchen","bathroom"], pei: "—", slip: "—",
    flag: "Statement Backsplash", desc: "Deep black marble with crisp white veining for bold kitchens.",
    long: "Classic Spanish Nero Marquina: a deep black ground with fine, lightning-white veins. Stunning as a full-height backsplash behind brass fittings.",
    tex: { t: "marble", base: "#25231F", vein: "#E9E4DA", vein2: "#8A847A", seed: 71, scale: 2.2, sharp: 16 } },

  { sku: "DTS-EL-SLD-2060", slug: "slate-ledgestone-elevation", name: "Slate Ledgestone Elevation", brand: "D.Tiles Atelier", cats: ["elevation","outdoor","wall-tiles"], category: "Elevation Tiles",
    material: "Natural Stone Panel", finish: "Split Face", colour: "Charcoal Rust", palette: "charcoal", size: "150×600mm", thickness: "15–25mm",
    price: 185, coverage: 7.75, pcsPerBox: 8, unit: "Boxes", stock: "in", batch: "02E", rooms: ["outdoor","living"], pei: "—", slip: "—",
    flag: "3D Facade", desc: "Stacked split-face stone strips with deep natural shadow relief.",
    long: "Split-face natural stone strips, pre-assembled into interlocking panels for fast installation on facades, boundary walls and feature walls.",
    tex: { t: "ledge", base: "#5B5650", seed: 81 } },

  { sku: "DTS-EL-TBC-2306", slug: "terra-brick-cladding", name: "Terra Brick Cladding", brand: "D.Tiles Atelier", cats: ["elevation","wall-tiles"], category: "Elevation Tiles",
    material: "Clay Brick Slip", finish: "Wire-Cut", colour: "Terra Red", palette: "terracotta", size: "230×60mm", thickness: "12mm",
    price: 160, coverage: 5.4, pcsPerBox: 36, unit: "Boxes", stock: "in", batch: "04K", rooms: ["outdoor","commercial","living"], pei: "—", slip: "—",
    flag: "Exposed Brick", desc: "Wire-cut clay brick slips for an honest, warm exposed-brick facade.",
    long: "Kiln-fired clay brick slips with wire-cut texture. All the warmth of an exposed brick wall at a fraction of the depth and weight.",
    tex: { t: "brick", base: "#A55B42", seed: 91 } },

  { sku: "DTS-OD-KTA-6060", slug: "kota-anti-skid-paver", name: "Kota Anti-Skid Paver", brand: "D.Tiles Atelier", cats: ["outdoor","elevation"], category: "Outdoor & Decking",
    material: "20mm Porcelain Paver", finish: "Anti-Skid R12", colour: "Kota Green-Grey", palette: "olive", size: "600×600mm", thickness: "20mm",
    price: 115, coverage: 7.75, pcsPerBox: 2, unit: "Boxes", stock: "in", batch: "20P", rooms: ["outdoor"], pei: "PEI 5", slip: "R12",
    flag: "20mm • R12", desc: "Load-bearing 20mm paver for driveways, terraces and garden paths.",
    long: "Inspired by Kota stone, engineered as 20mm porcelain. Lay on grass, gravel or pedestals — frost proof, anti-skid and car-load rated.",
    tex: { t: "stone", base: "#8E9180", seed: 101 } },

  { sku: "DTS-LF-STG-1632", slug: "statuario-grande", name: "Statuario Grande", brand: "Atelier Import · Italy", cats: ["large-format","marble","kitchen"], category: "Large Format Slabs",
    material: "Sintered Porcelain Slab", finish: "Polished", colour: "Statuario White", palette: "white", size: "1600×3200mm", thickness: "12mm",
    price: 410, coverage: 55.1, pcsPerBox: 1, unit: "Boxes", stock: "order", batch: "S1", rooms: ["kitchen","living","commercial"], pei: "PEI 3", slip: "R9",
    flag: "Sintered Slab", desc: "Kitchen-island grade sintered slab with bold grey Statuario veining.",
    long: "A 1600×3200 sintered slab — heat, scratch and stain resistant enough for kitchen islands, yet elegant enough for full-height walls with zero visible joints.",
    tex: { t: "marble", base: "#F5F3EF", vein: "#77736D", vein2: "#B4AFA8", seed: 113, scale: 1.2, sharp: 8, bold: true } },

  { sku: "DTS-CS-MCS-1212", slug: "microcemento-sabbia", name: "Microcemento Sabbia", brand: "Atelier Import · Spain", cats: ["concrete","large-format","floor-tiles"], category: "Concrete & Stone",
    material: "Full Body Porcelain", finish: "Soft Matte", colour: "Sabbia Greige", palette: "greige", size: "1200×1200mm", thickness: "10mm",
    price: 240, coverage: 15.5, pcsPerBox: 1, unit: "Boxes", stock: "in", batch: "11M", rooms: ["living","bedroom","commercial"], pei: "PEI 4", slip: "R10",
    flag: "Seamless Look", desc: "Trowel-like micro-cement clouds in a soft greige — calm and continuous.",
    long: "The hand-trowelled look of micro-cement in a large 1200×1200 format — fewer joints, a soft matte touch and a calm, continuous floor.",
    tex: { t: "concrete", base: "#CBBFAF", seed: 121, trowel: true } },

  { sku: "DTS-SW-OFB-1708", slug: "ovale-freestanding-bathtub", name: "Ovale Freestanding Bathtub", brand: "D.Tiles Bath", cats: ["sanitaryware"], category: "Sanitaryware",
    material: "Solid Surface Resin", finish: "Matte White", colour: "Chalk White", palette: "white", size: "1700×800mm",
    price: 68500, unit: "Pieces", stock: "order", batch: "B7", rooms: ["bathroom"],
    flag: "Sculpted Suite", desc: "Soft oval freestanding tub cast in velvety matte solid surface.",
    long: "Cast from mineral solid surface, the Ovale tub holds heat longer than acrylic and has a velvety matte touch that can be renewed with a light polish.",
    photo: "bathTub" },

  { sku: "DTS-SW-PWC-5236", slug: "pietra-wall-hung-wc", name: "Pietra Wall-Hung WC Set", brand: "D.Tiles Bath", cats: ["sanitaryware"], category: "Sanitaryware",
    material: "Vitreous China", finish: "Matte Stone", colour: "Stone Grey", palette: "greige", size: "520×360mm",
    price: 24900, unit: "Sets", stock: "in", batch: "W2", rooms: ["bathroom"],
    flag: "Rimless", desc: "Rimless wall-hung WC with soft-close seat and concealed cistern frame.",
    long: "A rimless wall-hung WC in matte stone vitreous china, supplied as a set with soft-close slim seat and concealed cistern frame with dual-flush plate.",
    photo: "bathGrey" },

  { sku: "DTS-SW-CCB-4600", slug: "cono-countertop-basin", name: "Cono Countertop Basin", brand: "D.Tiles Bath", cats: ["sanitaryware"], category: "Sanitaryware",
    material: "Fine Fireclay", finish: "Matte Charcoal", colour: "Charcoal", palette: "charcoal", size: "Ø460mm",
    price: 8900, unit: "Pieces", stock: "in", batch: "C4", rooms: ["bathroom"],
    flag: "Matte Charcoal", desc: "Thin-rim conical vessel basin in matte charcoal fireclay.",
    long: "A thin 6mm rim and soft conical bowl in matte charcoal fireclay — an architectural accent on stone or timber vanities.",
    photo: "bathDark" },

  { sku: "DTS-HW-BPT-1025", slug: "brass-profile-trim", name: "Brushed Brass Profile Trim", brand: "D.Tiles Atelier", cats: ["hardware"], category: "Hardware & Trims",
    material: "Solid Brass", finish: "Brushed", colour: "Muted Brass", palette: "brass", size: "10mm × 2.5m",
    price: 1250, unit: "Pieces", stock: "in", batch: "H1", rooms: ["living","bathroom","kitchen"],
    flag: "Precision Joinery", desc: "Solid brass L-profile for crisp tile edges, steps and transitions.",
    long: "Solid brass edge profile for tile edges, stair nosing and floor transitions. Brushed finish develops a soft patina over time.",
    tex: { t: "metal", base: "#B09A74", seed: 131 } },

  { sku: "DTS-HW-EGS-0001", slug: "epoxy-grout-sandstone", name: "Epoxy Grout — Sandstone", brand: "D.Tiles Atelier", cats: ["hardware"], category: "Hardware & Trims",
    material: "Two-Part Epoxy", finish: "Satin", colour: "Sandstone", palette: "sandstone", size: "1 kg kit",
    price: 650, unit: "Pieces", stock: "in", batch: "G3", rooms: ["bathroom","kitchen"],
    flag: "Stain-Proof Joints", desc: "Stain-proof, waterproof epoxy grout, colour-matched to warm surfaces.",
    long: "A two-part epoxy grout that never stains or cracks — ideal for kitchens and wet areas. One kilo covers approximately 30–40 sq.ft at 2mm joints.",
    tex: { t: "concrete", base: "#D3C2A8", seed: 141, speckle: true } }
];

/* --------------------------------------------------------------------------
   Live catalogue (Supabase). The list above is the built-in fallback used
   only if the database cannot be reached.
   -------------------------------------------------------------------------- */
DT.bundled = DT.products;

DT.tileCats = ["floor-tiles","wall-tiles","bathroom","kitchen","elevation","outdoor","marble","concrete","large-format"];
DT.catCode = { "floor-tiles":"FT","wall-tiles":"WT","bathroom":"BT","kitchen":"KT","elevation":"EL","outdoor":"OD","marble":"MB","concrete":"CS","large-format":"LF","sanitaryware":"SW","hardware":"HW" };
DT.defaultRooms = {
  "floor-tiles":["living","bedroom"], "wall-tiles":["living","bathroom"], "bathroom":["bathroom"], "kitchen":["kitchen"],
  "elevation":["outdoor"], "outdoor":["outdoor"], "marble":["living","bathroom"], "concrete":["living","commercial"],
  "large-format":["living","commercial"], "sanitaryware":["bathroom"], "hardware":["bathroom","kitchen"]
};

/* Database row → product object used across the site. */
DT.mapRow = function (r) {
  var cat = DT.catById(r.category) || { name: r.category, kicker: "" };
  var n = r.colours_available || 1;
  var imgs = [r.image1_url, r.image2_url].filter(Boolean);
  var pct = r.bulk_discount_pct ? +r.bulk_discount_pct : 0;
  return {
    id: r.id, sku: r.sku, slug: r.slug, name: r.name, brand: r.brand || "D.Tiles Studio",
    cats: [r.category].concat(r.extra_categories || []), category: cat.name, categoryId: r.category,
    material: r.material || cat.name, finish: r.finish || "Standard",
    colour: r.colour || (n > 1 ? "Available in " + n + " colours" : "As shown"), colours: n,
    palette: r.palette || null, size: r.size, thickness: r.thickness || null,
    price: +r.price, coverage: r.coverage ? +r.coverage : null, pcsPerBox: r.pcs_per_box || null, unit: r.unit,
    stock: r.stock_qty > 0 ? "in" : "order", stockQty: r.stock_qty || 0, batch: r.batch || "—",
    rooms: (r.rooms && r.rooms.length) ? r.rooms : (DT.defaultRooms[r.category] || ["living"]),
    pei: r.pei || null, slip: r.slip || null,
    flag: pct ? "Bulk " + pct + "% off" : (r.flag || cat.kicker || cat.name),
    desc: r.description || (r.name + " — " + r.size + (r.finish ? ", " + r.finish : "") + "."),
    long: r.long_description || r.description || (r.name + " in " + r.size + ". Visit our Indirapuram studio to see it in person, or ask us on WhatsApp for availability."),
    tex: r.texture || null, images: imgs.length ? imgs : null,
    bulkMin: r.bulk_min_qty || 0, bulkPct: pct, active: r.is_active !== false
  };
};

DT.rest = function (path, opts) {
  opts = opts || {};
  var ctrl = "AbortController" in window ? new AbortController() : null;
  var t = ctrl ? setTimeout(function () { ctrl.abort(); }, opts.timeout || 6000) : null;
  return fetch(DT.config.supabaseUrl + "/rest/v1/" + path, {
    headers: { apikey: DT.config.supabaseKey, Accept: "application/json" },
    signal: ctrl ? ctrl.signal : undefined, cache: "no-store"
  }).then(function (res) { if (t) clearTimeout(t); if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); });
};

/* Always fetch fresh so every admin change shows on the next page load. */
DT.catalogueSource = "bundled";
DT.loadCatalogue = function () {
  var cols = "id,sku,slug,name,category,extra_categories,size,price,unit,coverage,pcs_per_box,stock_qty,colours_available,bulk_min_qty,bulk_discount_pct,image1_url,image2_url,texture,brand,material,finish,colour,palette,thickness,description,long_description,flag,batch,rooms,pei,slip,is_active";
  return DT.rest("products?select=" + cols + "&is_active=eq.true&order=sort_order.asc,created_at.desc")
    .then(function (rows) {
      DT.products = rows.map(DT.mapRow); DT.catalogueSource = "live";
      try { localStorage.setItem("dts_catalogue", JSON.stringify(rows)); } catch (e) {}
    })
    .catch(function () {
      var cached = null; try { cached = JSON.parse(localStorage.getItem("dts_catalogue") || "null"); } catch (e) {}
      if (cached && cached.length) { DT.products = cached.map(DT.mapRow); DT.catalogueSource = "cache"; }
      else { DT.products = DT.bundled; DT.catalogueSource = "bundled"; }
    });
};

/* Line pricing with automatic bulk discount. */
DT.lineTotal = function (p, q) {
  var unit = DT.unitPrice(p), gross = unit * q;
  var pct = (p.bulkPct && p.bulkMin && q >= p.bulkMin) ? p.bulkPct : 0;
  var disc = Math.round(gross * pct / 100);
  return { unit: unit, gross: gross, pct: pct, disc: disc, net: gross - disc };
};
DT.bulkNote = function (p) { return p.bulkPct ? p.bulkPct + "% off on " + p.bulkMin + "+ " + (p.unit === "Boxes" ? "boxes" : p.unit.toLowerCase()) : ""; };

/* Derived helpers */
DT.isTile = function (p) { return p.unit === "Boxes" && !!p.coverage; };
DT.unitPrice = function (p) { return DT.isTile(p) ? Math.round(p.price * p.coverage) : p.price; };
DT.unitLabel = function (p, n) {
  var u = p.unit === "Boxes" ? "box" : p.unit === "Sets" ? "set" : "piece";
  if (n === undefined || n === 1) return u;
  return u === "box" ? "boxes" : u + "s";
};
DT.bySku = function (sku) {
  for (var i = 0; i < DT.products.length; i++) if (DT.products[i].sku === sku || DT.products[i].slug === sku) return DT.products[i];
  return null;
};
DT.catById = function (id) {
  for (var i = 0; i < DT.categories.length; i++) if (DT.categories[i].id === id) return DT.categories[i];
  return null;
};
DT.inCat = function (catId) { return DT.products.filter(function (p) { return p.cats.indexOf(catId) > -1; }); };
DT.hasAdminSession = function () {
  try { return !!localStorage.getItem("sb-" + DT.config.supabaseUrl.split("//")[1].split(".")[0] + "-auth-token"); } catch (e) { return false; }
};
DT.fromPrice = function (catId) {
  var ps = DT.inCat(catId); if (!ps.length) return 0;
  return Math.min.apply(null, ps.map(function (p) { return p.price; }));
};
DT.priceSuffix = function (p) { return DT.isTile(p) ? "/ sq.ft" : "/ " + DT.unitLabel(p); };
