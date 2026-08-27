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
    { label: "Términos y condiciones", href: "/legal/terminos" },
    { label: "Envíos y devoluciones", href: "/legal/envios" },
    { label: "Contacto", href: "/contacto" },
  ],
} as const;
