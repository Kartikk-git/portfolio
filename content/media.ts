// Generated media definitions
import mediaData from './media.json';

export interface MediaSlotDef {
  type: 'screenshot' | 'video' | 'diagram' | 'certificate' | 'file';
  src: string | null;
  ratio?: string;
  label: string;
  caption?: string;
  title?: string;
  project?: string;
}

export const mediaManifest: Record<string, MediaSlotDef> = mediaData as Record<string, MediaSlotDef>;

export const mediaCopy = {
  phScreenshotTitle: "Screenshot coming soon",
  phScreenshotBody: "{label}. Added once the screenshot is ready.",
  phVideoTitle: "Demo recording coming soon",
  phVideoBody: "A short walkthrough of {project} will appear here.",
  phDiagramTitle: "Diagram coming soon",
  phDiagramBody: "{label} will appear here.",
  phCertificateTitle: "Certificate image coming soon",
  phCertificateBody: "The certificate for {title} will appear here.",
  phResumeTitle: "Résumé PDF coming soon",
  phAlt: "Placeholder for {label}",
};
