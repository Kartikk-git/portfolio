import { profile } from "@/content/profile";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-[var(--rule)] bg-[var(--paper)] text-xs font-mono text-[var(--ink-muted)]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span>{profile.name}</span> &middot; <span>{currentYear}</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ink)] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            GitHub
          </a>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ink)] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="hover:text-[var(--ink)] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}

