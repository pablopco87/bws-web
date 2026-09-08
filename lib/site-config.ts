export const navLinks = [
  { label: "STL", href: "/stl" },
  { label: "Slider System", href: "/slider-system" },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "FAQ", href: "/faq" },
] as const;

export const footerLinks = {
  tienda: [
    { label: "Packs", href: "/packs" },
    { label: "Archivos STL", href: "/stl" },
    { label: "Slider System", href: "/slider-system" },
    { label: "FAQ", href: "/faq" },
  ],
  estudio: [
    { label: "Sobre nosotros", href: "/sobre-nosotros" },
    { label: "Contacto", href: "/contacto" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Blog", href: "/blog" },
  ],
  legal: [
    { label: "Aviso legal", href: "/legal/aviso-legal" },
    { label: "Privacidad", href: "/legal/privacidad" },
    { label: "Cookies", href: "/legal/cookies" },
    { label: "Licencia de uso", href: "/legal/licencia-stl" },
    { label: "Términos y condiciones", href: "/legal/terminos-y-condiciones" },
    { label: "Envíos y devoluciones", href: "/legal/envios" },
    { label: "Contacto", href: "/contacto" },
  ],
} as const;

/**
 * "Blog" stays out of the footer until there's editorial planning and real content behind it —
 * same "absent env var = safe default" pattern as `SITE_PASSWORD` in middleware.ts (the only
 * other visibility gate in this repo; no Stripe/Sanity flag exists yet to mirror instead). Set
 * `BLOG_ENABLED=true` in Vercel when the blog is ready to link — no code change needed then.
 */
export const blogEnabled = process.env.BLOG_ENABLED === "true";
