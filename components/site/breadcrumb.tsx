import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Mono trail under the header — last item (no href) is the current page, in accent. */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="border-b border-border-divider px-[18px] py-[18px] lg:px-14">
      <div className="mx-auto flex max-w-[1440px] items-center gap-2.5 font-mono text-[11px] tracking-[0.12em] text-muted-3 uppercase">
        {items.map((item, i) => (
          <span key={item.label} className="flex items-center gap-2.5">
            {i > 0 && <span>/</span>}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span className="text-accent">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
