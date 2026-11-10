// All portfolio projects in one place.
// To add a new project: copy one block, change the slug, title, role, date,
// summary and details. Put your photos in public/assets/imgs/ and list them
// under images as { src: "./assets/imgs/your-photo.jpg", caption: "..." }.
// Leave images empty and the page shows a placeholder instead.

const projects = [
  {
    slug: "mv-transformer-commissioning",
    title: "5000 kVA Medium-Voltage Transformer Commissioning",
    role: "Project Lead",
    date: "06/2026",
    icon: "ti-support",
    summary:
      "Project Lead for the commissioning of a 5000 kVA medium-voltage transformer: civil works, factory test validation, protection relay configuration and testing, and Tunisian regulatory compliance.",
    details: [
      "Prepared the civil works and the mechanical support structure for the new 5000 kVA medium-voltage transformer.",
      "Followed the manufacturing and validated the factory tests before shipment.",
      "Configured the new protection relays and tested all transformer and line protections.",
      "Ensured full compliance with Tunisian law and grid regulations.",
    ],
    images: [],
  },
  {
    slug: "limestone-crusher-commissioning",
    title: "New Limestone Crusher Commissioning",
    role: "Engineer",
    date: "12/2023",
    icon: "ti-map-alt",
    summary:
      "Programmed the crushing process and automation logic in PCS7, developed and validated electrical and process interlocks per P&ID diagrams, and performed FAT/SAT testing through handover.",
    details: [
      "Programmed the crushing process and automation logic in PCS7.",
      "Developed and validated electrical and process interlocks per P&ID diagrams.",
      "Performed FAT/SAT testing and supported the maintenance teams through handover.",
      "Safeguarded equipment integrity and production continuity.",
    ],
    images: [{ src: "./assets/imgs/LimeStoneCrusher.jpg", caption: "Limestone crusher" }],
  },
  {
    slug: "abb-lims-dcs-integration",
    title: "ABB LIMS Integration with DCS",
    role: "Engineer",
    date: "12/2022",
    icon: "ti-write",
    summary:
      "Integrated the ABB Laboratory Information Management System (LIMS) with the DCS for real-time quality data, improving process control and operational decision-making.",
    details: [
      "Integrated the ABB Laboratory Information Management System (LIMS) with the DCS for real-time quality data.",
      "Configured the communication interfaces between the laboratory and the control system.",
      "Validated the end-to-end data flows from the analysers to the control room.",
      "Improved process control and operational decision-making through better data visibility.",
    ],
    images: [],
  },
  {
    slug: "abb-expert-optimizer",
    title: "ABB Ability™ Expert Optimizer for Cement",
    role: "Engineer",
    date: "11/2022",
    icon: "ti-vector",
    summary:
      "Developed switching logic, control loops and process-optimization strategies for Advanced Process Control (MPC), simulated and validated before on-site commissioning, with DCS integration over OPC DA.",
    details: [
      "Developed switching logic, control loops and process-optimization strategies.",
      "Simulated and validated operating scenarios before on-site commissioning.",
      "Coordinated with process, automation and maintenance teams for seamless DCS integration.",
      "Try the interactive kiln operator simulator built around the same ideas.",
    ],
    images: [{ src: "./assets/imgs/optimization-with-apc.jpg", caption: "MPC Optimization with ABB APC" }],
    link: { to: "/simulator", label: "Try my kiln operator simulator" },
  },
  {
    slug: "bulk-loading-point-commissioning",
    title: "Bulk Loading Point Commissioning",
    role: "Engineer",
    date: "",
    icon: "ti-bar-chart",
    summary:
      "Implemented a new bulk loading point using Siemens PCS7: developed and integrated the new HMI and the required logic according to the process and mechanical specification.",
    details: [
      "Implemented a new bulk loading point using Siemens PCS7.",
      "Developed and integrated the new HMI according to the process and mechanical specification.",
      "Programmed and tested the required control logic before start-up.",
    ],
    images: [{ src: "./assets/imgs/BulkLoadingPoint.jpg", caption: "Bulk loading point" }],
  },
  {
    slug: "unitherm-burner-commissioning",
    title: "Unitherm Burner Commissioning",
    role: "Engineer",
    date: "",
    icon: "ti-package",
    summary:
      "Commissioned Unitherm burners in accordance with supplier specifications, ensuring optimal performance, safety compliance and efficiency through precise calibration and system testing.",
    details: [
      "Commissioned Unitherm burners in accordance with supplier specifications.",
      "Calibrated the burners and tested the full system before handover.",
      "Ensured optimal performance, safety compliance and efficiency.",
    ],
    images: [{ src: "./assets/imgs/UnithermBurner.jpg", caption: "Unitherm burner" }],
  },
  {
    slug: "loto-app",
    title: "LoTo App (Work In Progress)",
    role: "Developer",
    date: "",
    icon: "ti-lock",
    summary:
      "Developing a Lockout/Tagout (LoTo) application using React JS, MongoDB and OPC DA to streamline equipment isolation procedures, with real-time monitoring and control of equipment statuses.",
    details: [
      "Developing a Lockout/Tagout (LoTo) application using React JS, MongoDB and OPC DA.",
      "Streamlines equipment isolation procedures for enhanced safety and compliance.",
      "Integrates real-time data handling with OPC DA for effective monitoring and control of equipment statuses.",
    ],
    images: [{ src: "./assets/imgs/LOTO.jpg", caption: "LoTo app" }],
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);

export default projects;
