import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/site/container";
import { footerLinks } from "@/lib/site-config";

/**
 * Root layout footer (design/project/Foundations BWS.dc.html §04 + Home §FOOTER).
 * Uses the alt surface in both themes — Home's own markup skipped the `.bwsdark` light-mode
 * override and stayed pitch-black in light mode; chat5 called that unintentional and asked to
 * equalize it like the other five pages, so this component does that from the start.
 */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-surface-footer py-16 text-foreground lg:pt-[88px] lg:pb-10">
      <Container className="grid gap-10 border-b border-border-divider pb-12 lg:grid-cols-[1fr_200px_200px] lg:gap-12 lg:pb-16">
        <div>
          <div className="max-w-[620px] text-[34px] leading-[1.08] font-semibold tracking-[-0.03em] lg:text-[58px] lg:leading-[1.05] lg:tracking-[-0.035em]">
            Hecho por jugadores
            <br />
            para jugadores.
          </div>
          <div className="mt-6 font-mono text-[11.5px] tracking-[0.14em] text-accent">
            SLIDER SYSTEM™ · ESCENOGRAFÍA MODULAR 3D
          </div>
        </div>

        <FooterColumn title="TIENDA" links={footerLinks.tienda} />
        <FooterColumn title="ESTUDIO" links={footerLinks.estudio} />
      </Container>

      <Container>
        <Image
          src="/logos/bws-full.svg"
          alt="Brutal Work Studio"
          width={1328}
          height={220}
          className="bws-logo my-10 block w-full opacity-[0.16] lg:my-14"
        />

        <div className="flex flex-col items-start gap-4 font-mono text-[11px] tracking-[0.08em] text-muted-3 lg:flex-row lg:items-center lg:justify-between">
          <span>© 2026 BRUTAL WORK STUDIO</span>
          <div className="flex flex-wrap gap-x-[22px] gap-y-2">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-[180ms] hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3.5 text-sm text-muted">
      <div className="mb-1 font-mono text-[11px] tracking-[0.14em] text-muted-3">{title}</div>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="transition-colors duration-[180ms] hover:text-accent"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
