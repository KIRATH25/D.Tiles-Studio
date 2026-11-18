# D.Tiles Studio — Website

A static website: plain HTML, CSS and JavaScript. It needs no server code or database and works on any web host.

## Editing content
Everything lives in **`assets/js/data.js`**:
- `DT.config`: WhatsApp number (`919990679005`), phone, address, Google Maps link, showroom hours, GST rate, sample fees
- `DT.products`: every product (name, SKU, brand, size, finish, colour, price per sq.ft, coverage per box, stock)
- `DT.categories` / `DT.spaces`: collections and "Explore by Space"

Change a value there and every page, the calculator and all WhatsApp messages update together.

## WhatsApp messages
These are built in `assets/js/whatsapp.js` from live product and calculator data:

| Website action | Message |
|---|---|
| Calculator → Send Requirement | Tile Quantity Calculator enquiry |
| Buy Now (any product) | Single product purchase |
| Cart → Send Cart | Complete cart summary (one message) |
| Request Quote | Bulk / wholesale quotation |
| Request Sample | Sample request |
| Contact / Plan Visit / Consultation / Trade | General, visit, consultation and trade enquiries |

Every message ends with a unique reference number (for example `DTS-CAL-261119-K4Q2`) and a timestamp.

## Pages
`index.html` (Home) · `shop.html` (Collections) · `collection.html?c=floor-tiles` (listing with filters) · `product.html?sku=…` · `calculator.html` · `samples.html` · `cart.html` · `quote.html` · `inspiration.html` · `about.html` (showroom, map, contact) · `policies.html` · `404.html`

## Products & Admin (Supabase)
- Products load live from Supabase on every page view (table `products`). If the database can't be reached, the site uses the last-loaded catalogue, then the built-in list in `data.js`.
- Admin panel: `admin.html` (green "Admin Login" button in the header). Sign in, then add up to 10 products per batch, edit them, hide or show them, or delete them.
- Only accounts listed in the `admins` table can change data; this is enforced by the database itself (Row Level Security).
- The website uses only the **publishable** key. Never put the secret key in any website file.
- Database setup: run `supabase/schema.sql` once in the Supabase SQL Editor.

## Deploying
Upload the whole folder contents (keep the `assets` folder structure) to the web root of your host, such as `public_html` on GoDaddy cPanel hosting.
