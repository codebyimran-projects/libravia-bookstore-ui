# Libravia — Premium Digital Bookstore

A calm, editorial digital bookstore built with vanilla HTML, CSS, and JavaScript. Designed for readers who value quiet interfaces, clean typography, and thoughtful book discovery.

Built by **Muhammad Imran** (codebyimran).

---

## Overview

Libravia is a frontend-only bookstore UI — no frameworks, no build step, no backend. Every page runs directly in the browser. It's a production-ready template for anyone building a premium reading platform, an indie bookstore, or a curated book catalog.

The design language leans editorial: Playfair Display for headings, Inter for body text, a warm coffee-brown accent (`#8B5E3C`), and a soft paper-white background (`#F9FAF5`).

---

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero, featured books, categories, best sellers, author spotlight, testimonials, newsletter |
| Books | `books.html` | Full catalog with sidebar filters (category, price, rating, format), sort, and grid |
| Book Detail | `book.html` | Single book page with cover, metadata, tabs (description, details, reviews), related books |
| Categories | `categories.html` | Featured category, full category grid, sortable, discovery CTA |
| About | `about.html` | Studio story, values, book stack visual, stat row, CTA |
| Contact | `contact.html` | Contact form with validation, sidebar info, FAQ, editorial hero |

---

## Project Structure

```
libravia/
├── index.html
├── books.html
├── book.html
├── categories.html
├── about.html
├── contact.html
├── README.md
└── assets/
    ├── css/
    │   ├── main.css            global reset, navbar, footer
    │   ├── home.css            homepage sections
    │   ├── books.css           books listing page
    │   ├── book.css            book detail page
    │   ├── categories.css      categories page
    │   ├── about.css           about page
    │   └── contact.css         contact page
    └── js/
        ├── main.js             navbar scroll + mobile menu
        ├── home.js             homepage interactions
        ├── books.js            filters, sort, wishlist
        ├── book.js             tabs, sample reader
        ├── categories.js       category sort
        ├── about.js            image fallbacks, smooth scroll
        └── contact.js          form validation
```

---

## Design System

### Colors

| Purpose | Value |
|---|---|
| Background | `#F9FAF5` |
| Primary Text | `#1F2937` |
| Secondary Text | `#6B7280` |
| Accent | `#8B5E3C` |
| Warm Highlight | `#D4A373` |
| Card Background | `#FFFFFF` |
| Border | `#E5E7EB` |

### Typography

- **Headings:** Playfair Display (serif, elegant)
- **Body:** Inter (clean sans-serif)

### Conventions

- All class names use the `bk_` prefix (Bookstore Kit)
- No CSS frameworks, no CSS preprocessors
- No JavaScript frameworks or libraries
- Fully responsive: desktop, tablet, mobile
- Accessibility: semantic landmarks, aria labels, keyboard support

---

## Getting Started

Clone the repository and open any HTML file in a browser.

```bash
git clone https://github.com/your-username/libravia.git
cd libravia
```

Open `index.html` directly, or run a local server:

```bash
npx serve
```

Using a local server is recommended so that image loading and relative paths behave correctly across all pages.

---

## Customization

### Change the brand name

Search and replace `Libravia` across all `.html` files with your own brand name.

### Change the color palette

Open `assets/css/main.css` and update the base colors. The accent brown `#8B5E3C` and warm highlight `#D4A373` appear throughout the site — replace them with your brand colors to retheme the entire interface.

### Add or remove books

Book data lives directly in the HTML. In `books.html` and `book.html`, each book is a self-contained block with `data-category`, `data-rating`, `data-price`, and `data-format` attributes used for filtering.

### Add a new page

Copy any existing page, update the `<nav>` links across all pages, and add a matching CSS file in `assets/css/`.

---

## Features

### Books Listing Page

- Sidebar filters: category, price range, rating, format
- Multi-select filters
- Live "active filter" chips with removable pills
- Client-side sort (popular, newest, rating, price, title)
- Mobile filter drawer with slide-in animation
- Wishlist toggle on each card
- Empty state when no books match

### Book Detail Page

- Cover with gradient fallback
- Sticky cover on desktop
- Tabbed content: Description, Details, Reviews
- Rich text rendering (paragraphs, emphasis, links)
- Related books grid
- Share button (native share or clipboard fallback)

### Categories Page

- Large featured category block
- Sortable category grid
- Editorial discovery CTA

### About Page

- Three-book animated stack
- Values grid with numbered entries
- Editorial story section with photo
- Stat row

### Contact Page

- Form with real-time validation
- Field-level error messages
- Success confirmation
- FAQ grid
- Sticky sidebar info

### Homepage

- Hero with animated book stack
- Featured books grid
- Category discovery grid
- Best sellers with ranking badges
- Author spotlight with featured author
- Testimonials
- Newsletter CTA

---

## Accessibility

- Semantic HTML5 landmarks: `<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`
- All interactive elements are keyboard reachable
- Focus rings use `:focus-visible` — visible only for keyboard users
- `aria-label`, `aria-current`, and `aria-hidden` where appropriate
- `prefers-reduced-motion` respected — all animations collapse to near-instant
- Form fields have associated `<label>` elements
- Decorative icons marked `aria-hidden="true"`

---

## Performance

- No frameworks — no runtime overhead
- Images use `loading="lazy"` and `decoding="async"`
- All animations use `transform` and `opacity` for GPU compositing
- Scroll and resize handlers use `requestAnimationFrame` throttling
- Reveal animations use `IntersectionObserver` and unobserve after triggering
- Marquee and floating animations pause when not needed

---

## Browser Support

Tested and working on:

- Chrome 100+
- Safari 15.4+
- Firefox 100+
- Edge 100+

Uses modern CSS and JS features including `backdrop-filter`, CSS Grid, `position: sticky`, `IntersectionObserver`, and `:has()` (with JS fallback where needed).

---

## Notes

- This is a frontend-only project. Form submissions are simulated in JavaScript. To receive real messages, connect the contact form to a service like Formspree, Web3Forms, or your own API endpoint.
- Book cover images are loaded from the Open Library Covers API. Replace them with your own hosted covers for production use.
- Author portraits are loaded from Unsplash. Replace them with real photos or licensed images before going live.

---

## License

This project is free to use for personal and commercial purposes. Attribution is appreciated but not required.

---

## Author

**Muhammad Imran**
Full Stack Developer · Creative Technologist
