// Verbatim section rail content from content/website-content.md
export interface RailItem {
  id: string;
  index: string;
  name: string;
  href: string;
}

export const railContent = {
  ariaLabel: "Section navigation",
  buildStatus: "assembleDebug",
  items: [
    { id: "projects", index: "01", name: "Projects", href: "#projects" },
    { id: "about", index: "02", name: "About", href: "#about" },
    { id: "activity", index: "03", name: "Commit log", href: "#activity" },
    { id: "skills", index: "04", name: "Skills", href: "#skills" },
    { id: "experience", index: "05", name: "Experience", href: "#experience" },
    { id: "education", index: "06", name: "Credentials", href: "#education" },
    { id: "contact", index: "07", name: "Contact", href: "#contact" },
  ],
};

