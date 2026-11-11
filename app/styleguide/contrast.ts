export function getLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export interface ContrastResult {
  element: string;
  foreground: { name: string; hex: string };
  background: { name: string; hex: string };
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  targetRequirement: string;
}

export const lightContrastData: ContrastResult[] = [
  {
    element: "Body Text (Ink on Paper)",
    foreground: { name: "Ink", hex: "#16181D" },
    background: { name: "Paper", hex: "#F9F9F6" },
    ratio: Number(getContrastRatio("#16181D", "#F9F9F6").toFixed(2)),
    wcagAA: true,
    wcagAAA: true,
    targetRequirement: ">= 7.0:1 (Brief)",
  },
  {
    element: "Secondary Text (Ink Muted on Paper)",
    foreground: { name: "Ink Muted", hex: "#535862" },
    background: { name: "Paper", hex: "#F9F9F6" },
    ratio: Number(getContrastRatio("#535862", "#F9F9F6").toFixed(2)),
    wcagAA: true,
    wcagAAA: false,
    targetRequirement: ">= 4.5:1 (WCAG AA)",
  },
  {
    element: "Accent Links (Accent on Paper)",
    foreground: { name: "Accent", hex: "#1B6B4F" },
    background: { name: "Paper", hex: "#F9F9F6" },
    ratio: Number(getContrastRatio("#1B6B4F", "#F9F9F6").toFixed(2)),
    wcagAA: true,
    wcagAAA: false,
    targetRequirement: ">= 4.5:1 (WCAG AA)",
  },
  {
    element: "Surface Card Text (Ink on Surface)",
    foreground: { name: "Ink", hex: "#16181D" },
    background: { name: "Surface", hex: "#F2F1EA" },
    ratio: Number(getContrastRatio("#16181D", "#F2F1EA").toFixed(2)),
    wcagAA: true,
    wcagAAA: true,
    targetRequirement: ">= 7.0:1 (Brief)",
  },
  {
    element: "Primary Button Text (Paper on Ink)",
    foreground: { name: "Paper", hex: "#F9F9F6" },
    background: { name: "Ink", hex: "#16181D" },
    ratio: Number(getContrastRatio("#F9F9F6", "#16181D").toFixed(2)),
    wcagAA: true,
    wcagAAA: true,
    targetRequirement: ">= 7.0:1 (WCAG AAA)",
  },
];

export const darkContrastData: ContrastResult[] = [
  {
    element: "Body Text (Ink on Dark Background)",
    foreground: { name: "Ink", hex: "#E9E8E3" },
    background: { name: "Background", hex: "#111315" },
    ratio: Number(getContrastRatio("#E9E8E3", "#111315").toFixed(2)),
    wcagAA: true,
    wcagAAA: true,
    targetRequirement: ">= 7.0:1 (Brief)",
  },
  {
    element: "Secondary Text (Ink Muted on Dark Background)",
    foreground: { name: "Ink Muted", hex: "#A2A7AE" },
    background: { name: "Background", hex: "#111315" },
    ratio: Number(getContrastRatio("#A2A7AE", "#111315").toFixed(2)),
    wcagAA: true,
    wcagAAA: false,
    targetRequirement: ">= 4.5:1 (WCAG AA)",
  },
  {
    element: "Accent Links (Accent on Dark Background)",
    foreground: { name: "Accent", hex: "#5FB38F" },
    background: { name: "Background", hex: "#111315" },
    ratio: Number(getContrastRatio("#5FB38F", "#111315").toFixed(2)),
    wcagAA: true,
    wcagAAA: true,
    targetRequirement: ">= 4.5:1 (WCAG AA)",
  },
  {
    element: "Surface Block Text (Ink on Surface)",
    foreground: { name: "Ink", hex: "#E9E8E3" },
    background: { name: "Surface", hex: "#181B1E" },
    ratio: Number(getContrastRatio("#E9E8E3", "#181B1E").toFixed(2)),
    wcagAA: true,
    wcagAAA: true,
    targetRequirement: ">= 7.0:1 (Brief)",
  },
  {
    element: "Primary Button Text (Dark Ink on Accent)",
    foreground: { name: "Background", hex: "#111315" },
    background: { name: "Accent", hex: "#5FB38F" },
    ratio: Number(getContrastRatio("#111315", "#5FB38F").toFixed(2)),
    wcagAA: true,
    wcagAAA: true,
    targetRequirement: ">= 7.0:1 (WCAG AAA)",
  },
];

