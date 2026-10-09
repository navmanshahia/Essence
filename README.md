# ESSENCE — The Art of Feeling

A cinematic luxury-fragrance concept storefront built with React, Vite, Three.js / React Three Fiber, Drei, GSAP, Motion and custom CSS.

## Features implemented

- Editorial luxury homepage with animated 3D hero perfume bottle
- Four fictional ESSENCE fragrances: Nocturne, Rouge Éternel, Lumière and Solstice
- Working discovery collection, search, wishlist and product details
- Real-time rotatable WebGL bottle in the product detail and bespoke atelier
- Atelier controls for glass finish, cap finish, fragrance, bottle size and engraving
- Three-question fragrance discovery quiz with recommendation
- Shopping bag with quantity control, removal, total calculation and browser persistence
- Responsive mobile layout, keyboard focus styles and reduced-motion CSS
- GSAP entrance/scroll reveals, immersive visual sections, scent-note exploration
- Newsletter and concept order enquiries open the visitor's mail application

**Important:** This is a **concept storefront**, not a live commerce operation. Prices are fictional examples in Canadian dollars. Online payments, inventory, fulfilment, transactional email, user accounts, real fragrance production, and a secure admin portal are **not connected**. The order enquiry and early-access buttons use mailto. Do not advertise this as a live payment store before connecting a secure commerce backend.

## Local development

Install Node.js 20.19+ or 22+ and run:

    npm install
    npm run dev

Build:

    npm run build
    npm run preview

Compiled static files are generated in `dist/`.

## Deploying

### GitHub Pages

1. In GitHub > Settings > Pages, set Source to **GitHub Actions**.
2. Push or run the **Deploy ESSENCE to GitHub Pages** workflow.
3. The workflow builds the Vite website and publishes the static files.
4. Expected URL when Pages is enabled: `https://navmanshahia.github.io/Essence/`.

The Vite base URL is `./`, making assets work at nested paths without a hardcoded root.

### cPanel / elite-noir.com

Two options:

**A. Build and upload:** Run `npm run build` on your computer or use GitHub Actions, then upload the **contents of** `dist/` into your desired cPanel directory such as `public_html/Essence/`. cPanel PHP support is not needed to serve the built Vite storefront.

**B. GitHub Actions FTP deployment:** The included manually triggered **Deploy ESSENCE to cPanel** workflow expects repository Actions secrets:
- `FTP_SERVER`: hostname
- `FTP_USERNAME`: cPanel FTP username
- `FTP_PASSWORD`: password
- `FTP_SERVER_DIR`: target directory on the FTP account, for example `/public_html/Essence/` (depends on FTP account root)

Configure secrets first and run the workflow under Actions. Prefer FTPS, limit the FTP account to this directory and never commit credentials.

## Important 3D note

The bottle is a genuine, rotatable Three.js geometry composition with physically based glass, liquid, metal cap, collar and label. It is a custom concept model made in code, **not a production-scanned or high-detail Blender GLB**. For photorealistic luxury closeups, the next upgrade is to replace this with a professionally modeled and optimized GLB/glTF perfume asset. The 3D environment uses Drei's environment preset, which may require an asset request.

## Technology

React 19, Vite 6, Three.js, @react-three/fiber, @react-three/drei, GSAP/ScrollTrigger, Motion and Lucide React. Product data is currently in `src/data.js`. Wishlist and bag state are kept in browser localStorage, not synchronized accounts.

## Priorities for production

1. Secure admin and customer accounts with server-managed permissions.
2. Real product catalogue, variant SKUs, pricing and inventory.
3. Stripe Checkout or another supported processor with server-created sessions and verified webhooks.
4. Tax calculation, shipping, order management, confirmation email and privacy/terms pages.
5. A professionally commissioned GLB model, optimized assets, accessibility testing and realistic product photos.
6. Anti-abuse, rate limiting and server-side validation.

Brand and product names are original fictional concepts. Reference imagery is decorative. Do not claim the perfumes are available to purchase.
