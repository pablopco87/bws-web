# Brutal Work Studio — web app

Next.js (App Router) + TypeScript + Tailwind CSS v4, with shadcn/ui components built on Radix UI.

## Where things live

- `design/` — the Claude Design handoff bundle (README, chat transcripts, `.dc.html` prototypes,
  logos, STL uploads). Reference only — never imported by the app, never edited to "fix" it.
  Read `design/README.md` and `design/chats/*.md` before touching anything design-related;
  the chats carry the *why* behind decisions that the final HTML alone doesn't explain.
- `app/globals.css` — design tokens (color, type, radius, shadow) as CSS custom properties,
  mapped into Tailwind's `@theme`. This is the single source of truth for BWS tokens — extend
  it, don't hardcode new hex values in components.
- `components/ui/` — real shadcn/ui primitives (button, sheet, accordion, navigation-menu,
  switch, collapsible, separator, badge), installed via `npx shadcn add <name>` and built on the
  consolidated `radix-ui` package. Most were re-customized on top of that canonical base with
  BWS tokens/variants (see below) — running `npx shadcn add <name> --overwrite` again will blow
  those away and needs re-merging by hand, not a blind overwrite:
  - `button.tsx`, `badge.tsx`: custom `cva` variants replacing shadcn's defaults (`primary` /
    `secondary` / `solid` / `link` on Button; `slot-full` / `slot-half` / `solid` on Badge — the
    latter actively used by the mega-menu and mobile nav). shadcn's own variant names
    (`default`/`destructive`/`outline`/…) don't exist here on purpose — this repo has no
    `--color-primary`/`--color-destructive`/etc. tokens, only the BWS palette in `globals.css`.
  - `sheet.tsx`: kept the `showClose`/`closeLabel` props (not shadcn's `showCloseButton`) — both
    `mobile-nav.tsx` and `floating-slots-panel.tsx` render their own "CERRAR"/chevron close
    affordance and pass `showClose={false}`.
  - `accordion.tsx`: kept `border-b border-border-hairline` on `AccordionItem` (shadcn's default
    adds `last:border-b-0`, which would strip the divider under "Packs" in `mobile-nav.tsx` since
    it's the only/last item in that accordion) and `bg-surface-alt` on `AccordionContent`.
  - `switch.tsx`, `separator.tsx`: restyled to BWS tokens but currently unused directly —
    `theme-toggle.tsx` builds its own markup straight on the `radix-ui` `Switch` primitive instead
    (icon-swap-on-knob-pass behavior doesn't fit the generic component).
  - `navigation-menu.tsx`: **left as pure vanilla shadcn output, unused.** Radix wraps
    `NavigationMenu.Root`'s children in an internal `position: relative` div that shrinks to the
    trigger's width — that collapsed the full-bleed, 56px-inset mega-menu panel. `site-header.tsx`
    builds the Packs mega-menu directly with plain hover/focus-within instead; don't try to move
    it onto this primitive without solving that positioning issue first.
  - `collapsible.tsx`: identical to canonical, no BWS customization needed.
- `components/site/` — BWS-specific layout components: `site-header.tsx` (nav + Packs
  mega-menu + mobile hamburger), `site-footer.tsx`, `theme-toggle.tsx`, `floating-slots-panel.tsx`,
  plus small shared pieces (`live-dot.tsx`, `slot-dots.tsx`).
- `lib/data/packs.ts`, `lib/data/slots.ts` — mock content for the five packs and manufacturing
  tandas. Replace with real data sources when the backend exists; keep the shapes stable so the
  components don't need to change.

## Design tokens

Dark is the **default** theme, not a media-query variant — there is no `prefers-color-scheme`
switch. Light is an explicit override applied via `[data-theme="light"]` on `<html>`
(`components/theme-provider.tsx`, `next-themes` with `attribute="data-theme"`,
`enableSystem={false}`). All component color classes (`bg-background`, `text-muted`,
`border-border-hairline`, `text-slot-full`, etc.) resolve through the CSS variables in
`app/globals.css` — never branch styling on `data-theme` inside a component; extend the token
file instead.

Radius is intentionally 0 everywhere except the theme toggle (pill) and status dots (circle) —
don't introduce new rounded corners without a reason documented like those two are.

Two known inconsistencies from the original `.dc.html` export were **not** carried over on
purpose (see comments in `site-footer.tsx` and `lib/data/packs.ts`): the footer's light-mode
background bug on the Home prototype, and Battle Ready's mega-menu slot badge disagreeing with
its own brief text. If you find more of these while porting a page, fix them the same way —
prefer the formalized decision in `design/project/Foundations BWS.dc.html` or the explicit brief
text in the chats over a one-off markup artifact.

## Responsive behavior that's actually decided

Only two components have a closed mobile pattern (`design/project/Responsive Mobile BWS.dc.html`,
turno 16) — everything else (grid reflow, type scale, paddings) is still open and should be
solved directly in Tailwind per page as it's built, not assumed from the desktop artboard:

- **Packs mega-menu**: desktop hover/focus dropdown (direction 9b, visual preview grid) becomes,
  below `lg`, an accordion row inside the hamburger sheet — chevron rotates 180°, all five packs
  always listed with a binary LIBRE/EN COLA badge (`components/site/mobile-nav.tsx`).
- **Floating slots panel**: desktop fixed panel (expanded by default, collapsible to a header-only
  strip) becomes a non-dismissible pill that opens a bottom sheet on tap — *except* on pack-detail
  pages, which get a fixed bottom bar instead (tanda + "Reservar slot", no sheet). Pass
  `<FloatingSlotsPanel packMode />` on pack pages once they exist;
  `components/site/floating-slots-panel.tsx` documents the split.

The `lg` (1024px) breakpoint used for both is an implementation choice, not something the brief
closed — revisit it if a page needs it earlier/later.

## /design-sync discipline

This repo is meant to stay in sync with the "Brutal Work Studio" project on claude.ai/design.

**At the start of a session**, before touching component code:
1. If `DesignSync` reports it needs authorization, ask the user to run `/design-login` once
   (interactive sessions only — it can't run headless). Don't try to work around this.
2. Run `/design-sync` (pull) to check whether the Claude Design project has moved since the last
   sync — new artboards, or edits to ones already ported. Reconcile before starting new work so
   you're not building on a stale reference.

**Before closing a session** in which you touched anything under `components/ui/` or
`components/site/`: run `/design-sync` (push) so the design-system project's preview cards
reflect the current code, one component at a time — never a wholesale replace. This keeps the
Claude Design side a true mirror of what's actually implemented, not the original mockup.

If `/design-sync` isn't available as a slash command in a given session, use the `DesignSync`
tool directly: `list_projects` to find (or `create_project` to create) the "Brutal Work Studio"
design-system project, then the usual `list_files` → `finalize_plan` → `write_files` flow.

## Commands

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build (also type-checks)
- `npm run lint` — ESLint (the `design/` bundle is excluded — don't lint or "fix" it)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
