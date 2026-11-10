// Verbatim education & credentials content from content/website-content.md
export const credentialsContent = {
  eyebrow: "05 · Credentials",
  heading: "Education & Certifications",
  intro: "Formal education, plus certificates and badges I've earned through NPTEL, CodeChef and Google Cloud. Select a certificate to preview it.",
  groupCert: "Verified credentials & certifications",
  groupFormal: "Formal education",
  modal: {
    labelsRaw: "Issuer · Issued · Score · Credential ID · Verify",
    labels: ["Issuer","Issued","Score","Credential ID","Verify"],
    placeholder: "Certificate image will appear here once uploaded.",
    close: "Close certificate preview",
    prev: "Previous certificate",
    next: "Next certificate",
  },
  certifications: [
    {
      id: 'cred-java',
      title: "Programming in Java",
      badge: "Elite",
      issuer: "NPTEL, IIT Kharagpur",
      meta: "Jan to Apr 2026 · Elite certificate · Score 95%",
      body: "An online course on Java programming offered by NPTEL through IIT Kharagpur. I completed it in January to April 2026 and earned an Elite certificate with a final score of 95%.",
      verifyRaw: "Verify certificate ⚠ link",
      verifyLabel: "Verify certificate",
      verifyUrl: null, // ⚠ link pending
      confirm: true,
      score: "95%",
      issued: "Jan to Apr 2026",
    },
    {
      id: 'cred-codechef',
      title: "CodeChef Learning Tracks & Assessment",
      badge: null,
      issuer: "CodeChef",
      meta: "CodeChef · Completed",
      body: "I completed more than 600 learning exercises, quizzes and practice tasks across CodeChef's programming and web development tracks. Certificates include Git/GitHub, Learn HTML/CSS, CSS Intermediate and Projects using HTML/CSS, and I scored 90% on the CodeChef Python Skill Assessment.",
      itemsRaw: "- Python Skill Assessment: 90%\n- Git/GitHub\n- Learn HTML/CSS\n- CSS Intermediate\n- Projects using HTML/CSS",
      items: [
        { title: "Python Skill Assessment", score: "90%", slot: "cred-codechef-1" },
        { title: "Git/GitHub", slot: "cred-codechef-2" },
        { title: "Learn HTML/CSS", slot: "cred-codechef-3" },
        { title: "CSS Intermediate", slot: "cred-codechef-4" },
        { title: "Projects using HTML/CSS", slot: "cred-codechef-5" },
      ],
      verifyRaw: "View on CodeChef ⚠ links",
      verifyLabel: "View on CodeChef",
      verifyUrl: null, // ⚠ link pending
      confirm: true,
      issued: "Completed",
    },
    {
      id: 'cred-gcloud',
      title: "Google Cloud Skill Badges ⚠",
      badge: null,
      issuer: "Google Cloud, verified on Credly",
      meta: "Google Cloud, verified on Credly · Oct to Nov 2024 ⚠",
      body: "Hands-on skill badges earned through Google Cloud's lab-based courses. They cover prompt design in Vertex AI, building Gemini applications with Streamlit, and deploying and managing applications on Google App Engine. The full list is on my Credly profile.",
      verifyRaw: "View on Credly ⚠ link",
      verifyLabel: "View on Credly",
      verifyUrl: "https://www.credly.com/users/kartik-koundal",
      confirm: true,
      issued: "Oct to Nov 2024",
      badges: [
        "Prompt Design in Vertex AI",
        "Develop GenAI Apps with Gemini and Streamlit",
        "Deploy and Manage Applications on Google App Engine"
      ]
    }
  ],
  education: [
    {
      id: 'edu-btech',
      title: "B.Tech, Computer Science & Engineering",
      meta: "Dronacharya College of Engineering, Gurugram · 2024 to 2028 · CGPA 7.55/10 ⚠ latest semester",
      body: "A four-year undergraduate degree in Computer Science and Engineering. My coursework and self-study concentrate on data structures and algorithms, object-oriented programming, databases and SQL, alongside the Android and web projects on this site.",
      confirm: true, // ⚠ latest semester CGPA
    },
    {
      id: 'edu-xii',
      title: "Senior Secondary (Class XII)",
      meta: "St. Martin's Diocesan School · 2024 · 77.4%",
      body: "",
      confirm: false,
    },
    {
      id: 'edu-x',
      title: "Secondary (Class X)",
      meta: "St. Martin's Diocesan School · 2022 · 77.2%",
      body: "",
      confirm: false,
    }
  ]
};
