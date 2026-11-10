// Every project of the portfolio lives in this file.
// The home page cards, the /projects list and each project page are all built from it.
//
// TO ADD A PROJECT: copy one entry of the list below, change its "slug"
// (lower-case letters, digits and dashes only, it becomes the page address
// #/projects/<slug>) and fill the rest. Projects are shown newest first.
//
// TO WRITE A PROJECT PAGE: fill its "content" list, top to bottom, like a blog post.
// Each line of the list is one block. The blocks you can use:
//
//   { type: "heading", text: "Protection testing" }
//   { type: "paragraph", text: "Plain text, as long as you like." }
//   { type: "list", items: ["First point", "Second point"] }
//   { type: "image", src: "assets/imgs/projects/<slug>/photo.jpg", caption: "What the photo shows" }
//   { type: "gallery", images: [
//       { src: "assets/imgs/projects/<slug>/a.jpg", caption: "Before" },
//       { src: "assets/imgs/projects/<slug>/b.jpg", caption: "After" },
//     ] }
//   { type: "table", head: ["Item", "Value"], rows: [["Rated power", "5000 kVA"]] }
//   { type: "quote", text: "A sentence to set apart.", by: "Who said it" }
//   { type: "link", label: "Open the simulator", to: "/simulator" }       (a page of this site)
//   { type: "link", label: "Supplier page", href: "https://example.com" } (another site)
//
// Photos go in public/assets/imgs/projects/<slug>/ (see the README there).
// "cover" is the picture shown on the cards and at the top of the page; leave it
// empty ("") until you have one. "icon" is a Themify icon name (https://themify.me/themify-icons).

const projects = [
  {
    slug: "mv-transformer-5000-kva",
    title: "Commissioning of a 5000 kVA Medium-Voltage Transformer",
    date: "2026-06",
    role: "Project Lead",
    company: "SINOMA Cement Co., Ltd",
    location: "Tunis, Tunisia",
    icon: "ti-bolt",
    cover: "",
    summary:
      "Led the commissioning of a new 5000 kVA MV transformer: civil works, factory test validation, protection relay configuration and testing, and Tunisian regulatory compliance.",
    tags: ["MV transformer", "Protection relays", "Factory tests", "Civil works", "Regulatory compliance"],
    results: [
      "Civil works and mechanical support structure prepared",
      "Factory tests followed and validated",
      "All transformer and line protections tested",
      "Compliant with Tunisian law",
    ],
    content: [
      {
        type: "paragraph",
        text: "As project lead, I took a new 5000 kVA medium-voltage transformer from site preparation to commissioning at the SINOMA Cement plant.",
      },
      { type: "heading", text: "Preparation and manufacturing follow-up" },
      {
        type: "list",
        items: [
          "Prepared the civil works and the mechanical support structure.",
          "Followed manufacturing and validated the factory tests.",
        ],
      },
      { type: "heading", text: "Protection and compliance" },
      {
        type: "list",
        items: [
          "Configured the new protection relays.",
          "Tested all transformer and line protections.",
          "Ensured compliance with Tunisian law.",
        ],
      },
    ],
  },
  {
    slug: "limestone-crusher-commissioning",
    title: "New Limestone Crusher Commissioning",
    date: "2023-12",
    role: "Engineer",
    company: "Votorantim Cimentos",
    location: "Tunis, Tunisia",
    icon: "ti-map-alt",
    cover: "assets/imgs/LimeStoneCrusher.jpg",
    summary:
      "Programmed the crushing process and automation logic in PCS7, validated the electrical and process interlocks against the P&ID diagrams, and ran FAT/SAT up to handover.",
    tags: ["PCS7", "Interlocks", "P&ID", "FAT / SAT", "Commissioning"],
    results: [
      "Crushing process and automation logic programmed in PCS7",
      "Electrical and process interlocks validated per P&ID",
      "FAT/SAT completed and maintenance teams supported through handover",
    ],
    content: [
      {
        type: "paragraph",
        text: "Automation engineering for the commissioning of a new limestone crusher, from the control logic to the handover to maintenance.",
      },
      { type: "heading", text: "Automation" },
      {
        type: "list",
        items: [
          "Programmed the crushing process and automation logic in PCS7.",
          "Developed and validated the electrical and process interlocks per the P&ID diagrams.",
        ],
      },
      { type: "heading", text: "Testing and handover" },
      {
        type: "list",
        items: [
          "Performed FAT/SAT testing.",
          "Supported the maintenance teams through handover, safeguarding equipment integrity and production continuity.",
        ],
      },
    ],
  },
  {
    slug: "abb-lims-dcs-integration",
    title: "ABB LIMS Integration with the DCS",
    date: "2022-12",
    role: "Engineer",
    company: "Votorantim Cimentos",
    location: "Tunis, Tunisia",
    icon: "ti-write",
    cover: "",
    summary:
      "Integrated the ABB Laboratory Information Management System (LIMS) with the DCS so that quality data reaches the control room in real time.",
    tags: ["ABB LIMS", "DCS", "Quality data", "Communication interfaces"],
    results: [
      "Real-time quality data available in the DCS",
      "Communication interfaces configured",
      "End-to-end data flows validated",
    ],
    content: [
      {
        type: "paragraph",
        text: "Integration of the ABB Laboratory Information Management System (LIMS) with the plant DCS for real-time quality data.",
      },
      { type: "heading", text: "What I did" },
      {
        type: "list",
        items: [
          "Configured the communication interfaces between the LIMS and the DCS.",
          "Validated the end-to-end data flows.",
        ],
      },
      { type: "heading", text: "Outcome" },
      {
        type: "paragraph",
        text: "Better data visibility improved process control and operational decision-making.",
      },
    ],
  },
  {
    slug: "abb-expert-optimizer",
    title: "ABB Ability Expert Optimizer for Cement",
    date: "2022-11",
    role: "Engineer",
    company: "Votorantim Cimentos",
    location: "Tunis, Tunisia",
    icon: "ti-vector",
    cover: "assets/imgs/optimization-with-apc.jpg",
    summary:
      "Developed switching logic, control loops and process-optimization strategies for the advanced process control system, then simulated and validated them before on-site commissioning.",
    tags: ["ABB Ability Expert Optimizer", "Advanced process control", "PCS7", "OPC DA"],
    results: [
      "Switching logic, control loops and optimization strategies developed",
      "Operating scenarios simulated and validated before commissioning",
      "Seamless integration with the DCS",
    ],
    content: [
      {
        type: "paragraph",
        text: "Deployment of ABB Ability Expert Optimizer, an advanced process control (APC) application, on top of the plant DCS (Siemens PCS7).",
      },
      { type: "heading", text: "What I did" },
      {
        type: "list",
        items: [
          "Developed the switching logic, control loops and process-optimization strategies.",
          "Simulated and validated the operating scenarios before on-site commissioning.",
          "Coordinated with the process, automation and maintenance teams for a seamless DCS integration.",
        ],
      },
      { type: "heading", text: "Try it yourself" },
      {
        type: "paragraph",
        text: "I built a small kiln operator simulator for this site: run the kiln by hand, then hand it over to the controller and compare.",
      },
      { type: "link", label: "Open the kiln operator simulator", to: "/simulator" },
    ],
  },

  // The three projects below come from the previous version of the site and are
  // not on the resume. They have no date yet: add one, or delete the entry.
  {
    slug: "bulk-loading-point",
    title: "Bulk Loading Point Commissioning",
    date: "",
    role: "Engineer",
    company: "",
    location: "",
    icon: "ti-bar-chart",
    cover: "assets/imgs/BulkLoadingPoint.jpg",
    summary:
      "Implemented a new bulk loading point in Siemens PCS7: new HMI and the logic required by the process and mechanical specification.",
    tags: ["PCS7", "HMI", "Commissioning"],
    results: [],
    content: [
      {
        type: "paragraph",
        text: "Implemented a new bulk loading point using Siemens PCS7: developed and integrated the new HMI and the required logic according to the process and mechanical specification.",
      },
    ],
  },
  {
    slug: "unitherm-burner",
    title: "Unitherm Burner Commissioning",
    date: "",
    role: "Engineer",
    company: "",
    location: "",
    icon: "ti-support",
    cover: "assets/imgs/UnithermBurner.jpg",
    summary:
      "Commissioned Unitherm burners to the supplier specifications, with calibration and system testing for performance, safety and efficiency.",
    tags: ["Kiln burner", "Calibration", "Commissioning"],
    results: [],
    content: [
      {
        type: "paragraph",
        text: "Commissioned Unitherm burners in accordance with the supplier specifications, ensuring performance, safety compliance and efficiency through precise calibration and system testing.",
      },
    ],
  },
  {
    slug: "loto-app",
    title: "LoTo App (work in progress)",
    date: "",
    role: "Personal project",
    company: "",
    location: "",
    icon: "ti-package",
    cover: "assets/imgs/LOTO.jpg",
    summary:
      "A Lockout/Tagout application built with React, MongoDB and OPC DA to streamline equipment isolation procedures.",
    tags: ["React", "Node.js", "MongoDB", "OPC DA", "LOTO"],
    results: [],
    content: [
      {
        type: "paragraph",
        text: "A Lockout/Tagout (LoTo) application built with React, MongoDB and OPC DA to streamline equipment isolation procedures, with real-time equipment status read over OPC DA.",
      },
    ],
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-06" becomes "Jun 2026"
export const formatProjectDate = (date) => {
  if (!date) return "";
  const [year, month] = date.split("-");
  return month ? `${MONTHS[parseInt(month, 10) - 1]} ${year}` : year;
};

// Newest first, projects without a date last
export const sortedProjects = [...projects].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

export const findProject = (slug) => sortedProjects.find((p) => p.slug === slug);

export default sortedProjects;
