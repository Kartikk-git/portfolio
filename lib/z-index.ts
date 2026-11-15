/**
 * Centralized Z-Index Hierarchy Tokens
 *
 * Strict stacking hierarchy across the portfolio:
 * - 1000: Toast notifications (Z_INDEX.toast)
 * -  901: Command palette panel (Z_INDEX.palette)
 * -  900: Command palette backdrop / overlay (Z_INDEX.paletteBackdrop)
 * -   50: Full-screen modal dialogs: certificates, resume, documents (Z_INDEX.modal)
 * -   40: Sticky global header (Z_INDEX.header)
 * -   35: Gutter phone mockup / popover (Z_INDEX.phoneGutter)
 * -   30: Hero companion bot (Z_INDEX.bot)
 * -   20: Section rail navigation (Z_INDEX.rail)
 * -    1: Interactive in-page cards and media items (Z_INDEX.content)
 * -    0: Document baseline (Z_INDEX.base)
 */
export const Z_INDEX = {
  base: 0,
  content: 1,
  rail: 20,
  bot: 30,
  phoneGutter: 35,
  header: 40,
  modal: 50,
  paletteBackdrop: 900,
  palette: 901,
  toast: 1000,
} as const;

export type ZIndexToken = keyof typeof Z_INDEX;

