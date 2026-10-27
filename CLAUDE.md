# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Product scope, MVP loop, phase boundaries, and the core domain rule live in AGENTS.md:

@AGENTS.md

## Commands

Package manager is **bun** (`bun.lock`).

```bash
bun install
bun dev              # next dev
bun run build        # next build
bun run lint         # eslint, --max-warnings=0 (any warning fails)
bun run typecheck    # tsc --noEmit
bun run check        # typecheck + lint — run before considering work done
bun run format       # prettier --write on all .ts/.tsx
bunx shadcn@latest add <component>   # adds to src/components/ui
```

No test runner is configured yet.

Env: copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The schema lives in `supabase/migrations/` and is applied by hand in the Supabase SQL editor (no Supabase CLI is set up).

## Architecture

- **Everything lives under `src/`.** The `@/*` alias maps to `./src/*`. Feature UI goes in `src/components/{dashboard,payments,reserve,settings}`, domain logic in `src/lib/tax`, data access in `src/lib/db`, and shared types in `src/types`.
- **Data flow:** async Server Components in `src/app/**/page.tsx` load data through `src/lib/db/queries.ts` (`server-only`), compute totals with `src/lib/tax/reserve.ts`, and pass plain props down. Mutations are server actions in `src/app/actions.ts`. They return `ActionResult` (`{ ok } | { ok: false, error }`) and call `revalidatePath`. Client forms use `useActionState` plus `useActionToast` (`src/hooks`) to show Sonner toasts. `EntryDialog` is the generic dialog form behind both "Record payment" and "Record transfer".
- **Auth (Supabase email/password):** `src/proxy.ts` (Next 16's name for middleware) refreshes the session cookie and redirects signed-out users to `/login`. That check is optimistic only. Every page and server action re-verifies with `getUserId()` (`getClaims()`), never `getSession()`. Postgres RLS (`user_id = auth.uid()`) is the actual data boundary, and inserts rely on `user_id default auth.uid()`.
- **Money and rates:** amounts are integer cents, rates are basis points (3000 = 30%), and dates are plain `date` strings (`YYYY-MM-DD`). Parse user input with `parseDollars`/`parsePercent` and display it with `formatCents`/`formatRate` (`src/lib/tax/money.ts`). Never use floats for money.
- **Rate snapshot:** each payment stores the `reserve_rate_bps` that was in effect when it was recorded. Changing the rate in settings affects only future payments. Always compute reserve per payment with `reserveForPayment()`, not with the current setting.

## UI conventions

- **shadcn style `base-lyra` is built on Base UI (`@base-ui/react`), not Radix.** Components compose through a `render={<Button />}` prop, not `asChild`. Follow the existing files in `src/components/ui` instead of assuming Radix APIs.
- Icons come from `@phosphor-icons/react`, not lucide.
- `cn` comes from the `cn` package, re-exported from `@/lib/utils`. It is not clsx + tailwind-merge.
- Tailwind v4 is configured CSS-first in `src/index.css` (`@theme inline`, CSS variables, `.dark` custom variant). There is no `tailwind.config`. The font is JetBrains Mono for both body and headings.
- Theme: `src/components/theme-provider.tsx` is a hand-rolled provider (localStorage key `theme`, the `d` key toggles dark mode). `next-themes` is not used. Anything that needs the theme, including `ui/sonner.tsx`, imports `useTheme` from `@/components/theme-provider`. The `<Toaster />` is mounted in `layout.tsx`.
- Base UI `Button` rendering a non-button (e.g. `render={<Link />}`) needs `nativeButton={false}`.
- Prettier settings: no semicolons, double quotes, trailing commas `es5`, and Tailwind class sorting (including inside `cn()`/`cva()`).
