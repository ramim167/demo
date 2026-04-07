# Premium Jersey Storefront Roadmap

## 1. Product and brand direction
- Position the store as a premium sportswear destination, not a discount catalog.
- Keep the visual system bright and minimal: white or light grey base, deep black surfaces, and a single electric blue action color.
- Use athletic typography with a compressed display face for headlines and a clean sans-serif for body copy.
- Treat mobile as the primary experience. Navigation, search, customization, checkout, and tracking should all be easy to complete one-handed.

## 2. UX architecture
- Header: sticky, lightweight, always visible on mobile, with logo, mega menu trigger, AI-style search, and cart access.
- Discovery paths:
  - League-first for club football and tournament browsing.
  - National-team-first for World Cup and international demand.
  - Edition-first for Player Version, Fan Version, Retro, and limited drops.
- Home page modules:
  - Hero with premium positioning and fast CTAs.
  - Discovery cards for leagues, national teams, and editions.
  - Featured drops grid that moves customers quickly into PDPs.
  - Trust and operations messaging around authentic customization and fulfillment.
- Product detail page:
  - Left: media gallery with thumbnails, hover zoom, and video slot.
  - Right: pricing, stock badge, edition switcher, size selector, size guide modal, custom print inputs, patch toggles, and add-to-cart.
  - This page is the highest-priority conversion surface.
- Cart and checkout:
  - Ajax side-cart for confirmation without reload.
  - One-page checkout with address, shipping zone, payment choice, and summary.
- Post-purchase:
  - Order tracking lookup by order ID and phone number.

## 3. Technical stack recommendation
- Frontend: Next.js App Router + TypeScript.
- Styling: Tailwind CSS with a small design-token layer in `globals.css`.
- Database: PostgreSQL.
- ORM: Prisma.
- Search:
  - Phase 1: instant keyword suggestions with thumbnails.
  - Phase 2: semantic search using embeddings and a vector store.
- Admin:
  - Next.js admin app or dedicated dashboard surface.
  - Inventory, order lifecycle, print queue, and shipping label export.

## 4. Implementation phases
- Phase 1: foundation
  - Brand system, responsive layout, component library, product grid, PDP scaffolding.
- Phase 2: commerce flow
  - Persistent cart, one-page checkout, local gateway adapters, shipping rules.
- Phase 3: operations
  - Admin inventory management, print specification review, courier integrations, order tracking sync.
- Phase 4: growth
  - SEO automation, structured data, reviews, abandoned cart recovery, analytics, remarketing.

## 5. Backend requirements
- Products must support:
  - Multiple editions per jersey.
  - Multiple sizes per edition.
  - Real stock counts at the size level.
  - Product media ordering.
  - Optional patch availability by product.
- Orders must persist:
  - Edition selected.
  - Size selected.
  - Custom name and custom number.
  - Selected patches.
  - Printing notes and production status.
  - Shipping zone, payment method, and tracking timeline.
- Admin dashboard should expose:
  - Inventory by product, variant, and size.
  - Print queue filters by production status.
  - Exportable shipping labels and courier tracking fields.
  - Searchable order history by phone, order ID, SKU, or team.

## 6. SEO and performance requirements
- Add product schema with price and aggregate rating.
- Generate metadata per product page from CMS or database content.
- Use optimized imagery and keep above-the-fold content lean.
- Target less than 2 seconds for key mobile landing pages on 4G.
- Cache product detail and collection pages aggressively where stock does not require live fetch.

## 7. Local payment and shipping integration notes
- Implement adapter interfaces for bKash and Nagad so gateway logic is isolated from checkout UI.
- Keep COD available as a fallback method.
- Model shipping as rule-based zones:
  - Inside City
  - Outside City
  - International if expansion is planned
- Expose delivery events back to the customer-facing tracking page.
