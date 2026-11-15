// Generated media definitions
import mediaData from './media.json';

export interface MediaSlotDef {
  type: 'screenshot' | 'video' | 'diagram' | 'certificate' | 'marksheet' | 'file';
  src: string | null;
  thumb?: string;
  ratio?: string;
  label: string;
  caption?: string;
  title?: string;
  project?: string;
}

export const mediaManifest: Record<string, MediaSlotDef> = mediaData as Record<string, MediaSlotDef>;

/** True when the manifest slot exists and has a real asset behind it. */
export function hasRealMedia(slotId: string): boolean {
  return Boolean(mediaManifest[slotId]?.src);
}

/** Filter a list of slot ids down to the ones with a real asset. */
export function realSlots(slotIds: string[]): string[] {
  return slotIds.filter(hasRealMedia);
}

/** First slot id in the list that has a real asset, or null. */
export function firstRealSlot(slotIds: Array<string | undefined | null>): string | null {
  for (const id of slotIds) {
    if (id && hasRealMedia(id)) return id;
  }
  return null;
}
