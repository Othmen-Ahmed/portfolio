import React from "react";
import { Link } from "react-router-dom";
import projects, { formatProjectDate } from "../data/projects";
import "./Projects/Projects.css";

const Resume = () => {
  return (
    <>
      {/*Resume Section*/}
      <section className="section" id="resume">
        <div className="container">
          <h2 className="mb-5">
            <span className="text-danger">My</span> Resume
          </h2>
          <div className="row">
            {/* Experience */}
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">
                  <div className="mt-2">
                    <h4>Experience</h4>
                    <span className="line" />
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="title text-danger">03/2025 - Present</h6>
                  <p>
                    Maintenance Manager - SINOMA Cement Co., Ltd{" "}
                    <span style={{ fontStyle: "italic" }}>-- Tunis, Tunisia</span>{" "}
                  </p>
                  <p className="subtitle">
                    ● Head the plant’s maintenance department: 40 technicians plus contractors for CAPEX and shutdown work. Define
                    maintenance strategy and set work priorities.
                  </p>
                  <p className="subtitle">
                    ● Own the maintenance budget and CAPEX plan (TND 20 M): forecasting, cost control and replacement of obsolete
                    equipment.
                  </p>
                  <p className="subtitle">
                    ● Raised equipment availability from 70% to 96% and improved MTBF by 15% through structured failure analysis
                    and continuous improvement (8D, RCA, PDCA). Raised cement mill reliability from 70% to 96% by replacing
                    obsolete installations.
                  </p>
                  <p className="subtitle">
                    ● Manage the maintenance programs: maintenance and replacement strategy, plant condition assessment,
                    preventive and corrective plans, KPI monitoring (availability, MTBF, downtime), spare-parts and warehouse
                    management, and failure analysis.
                  </p>
                  <p className="subtitle">
                    ● Advise the Plant Manager through weekly technical reporting, KPI reviews, new-installation studies (10 MWac PV
                    feasibility study, alternative-fuel impact on induced-draft fan power) and the 5-year Plant Development Plan.
                  </p>
                  <p className="subtitle">
                    ● Project Lead, 5000 kVA MV transformer commissioning (07/2026): civil works, factory test validation, protection
                    relay configuration and testing, Tunisian regulatory compliance.{" "}
                    <Link to="/projects/mv-transformer-5000-kva">Read the project</Link>
                  </p>
                  <p className="subtitle">
                    ● Defined SOPs for critical tasks to improve safety and repeatability, and set up a communication framework with
                    production and quality.
                  </p>
                  <hr />
                  <h6 className="title text-danger">02/2022 - 03/2025</h6>
                  <p>
                    Industrial Automation Engineer - Votorantim Cimentos{" "}
                    <span style={{ fontStyle: "italic" }}>-- Tunis, Tunisia</span>{" "}
                  </p>
                  <p className="subtitle">
                    ● Stepped in as Electrical Maintenance Manager at very short notice, leading a team of 18 and ensuring continuity
                    of maintenance operations for one year.
                  </p>
                  <p className="subtitle">
                    ● Maintained and continuously improved the plant process control system (PCS7, 14 S7-400 stations, 60 control
                    cabinets); monitored electrical energy and ensured regulatory compliance.
                  </p>
                  <p className="subtitle">
                    ● Led full PCS7 system audits, identifying reliability improvements.
                  </p>
                  <p className="subtitle">
                    ● Implemented a spare-parts strategy achieving 100% equipment availability and cutting the maintenance budget
                    by 5% (1.2M TND).
                  </p>
                  <p className="subtitle">
                    ● Used PRONETA and nmap in industrial network testing campaigns, sustaining near-100% network availability.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              {/* Education */}
              <div className="card">
                <div className="card-header">
                  <div className="mt-2">
                    <h4>Education</h4>
                    <span className="line" />
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="title text-danger">09/2017 - 09/2021</h6>
                  <p>Engineering Degree (Diplôme d'Ingénieur) in Mechatronics</p>
                  <p className="subtitle">
                    <a href="http://www.eniso.rnu.tn/fr/">École Nationale d'Ingénieurs de Sousse</a> (ENISo).
                    Graduated valedictorian.
                  </p>
                  <hr />
                  <h6 className="title text-danger">2015 - 2017</h6>
                  <p>Diploma in Engineering Prep school</p>
                  <p className="subtitle">
                    Graduated valedictorian, with a strong foundation in advanced mathematics and physics.
                  </p>
                </div>
              </div>

              {/* Certifications */}
              <div className="card">
                <div className="card-header">
                  <div className="mt-2">
                    <h4>Certifications</h4>
                    <span className="line" />
                  </div>
                </div>
                <div className="card-body">
                  <p className="subtitle mb-2">● PMP</p>
                  <p className="subtitle mb-2">● Cisco Certified Network Associate (CCNA)</p>
                  <p className="subtitle mb-2">● ABB Ability Expert Optimizer</p>
                  <p className="subtitle mb-2">● React &amp; Node.js</p>
                  <p className="subtitle mb-0">● TOEIC (940)</p>
                </div>
              </div>

              {/* LANGUAGES */}
              <div className="card">
                <div className="card-header">
                  <div className="pull-left">
                    <h4 className="mt-2">Languages</h4>
                    <span className="line" />
                  </div>
                </div>

                <div className="card-body pb-2">
                  <h6>Arabic: Native</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "100%" }}
                      aria-valuenow={100}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>English: C1</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "85%" }}
                      aria-valuenow={85}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>French: C1</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "85%" }}
                      aria-valuenow={85}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>

                  <h6>German: A1</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "17%" }}
                      aria-valuenow={17}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="pull-left">
                    <h4 className="mt-2">Skills</h4>
                    <span className="line" />
                  </div>
                </div>

                <div className="card-body pb-2">
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Maintenance Management</h6>
                      <p className="subtitle">
                        Maintenance strategy and planning (preventive, corrective, condition-based), maintenance KPIs
                        (availability, MTBF, MTTR, downtime), maintenance budgeting and cost control, spare-parts and
                        inventory management, failure analysis (RCA, 8D, PDCA, FMEA), CAPEX planning and execution,
                        supplier and contractor management, Health &amp; Safety work procedures (LOTO), operational
                        excellence and continuous improvement.
                      </p>
                      <hr />
                      <h6>Leadership</h6>
                      <p className="subtitle">
                        Team leadership (40 technicians), team building, technical reporting to plant management,
                        cross-functional coordination with production, process and quality.
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6>Electrical</h6>
                      <p className="subtitle">
                        HV/MV/LV distribution, MV transformers, protection relays and protection testing, variable
                        frequency drives, medium voltage motors.
                      </p>
                      <hr />
                      <h6>Automation</h6>
                      <p className="subtitle">
                        STEP 7, TIA Portal V20, PCS7 V9, CFC, SFC, WinCC Advanced V6, OPC DA, OPC UA, Profibus,
                        Profinet, EtherNet/IP, PRONETA.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section bg-dark text-center">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-6 col-lg-3">
              <div className="row ">
                <div className="col-5 text-right text-light border-right py-3">
                  <div className="m-auto">
                    <i className="ti-alarm-clock icon-xl" />
                  </div>
                </div>
                <div className="col-7 text-left py-3">
                  <h1 className="text-danger font-weight-bold font40">5</h1>
                  <p className="text-light mb-1">Years In The Cement Industry</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="row">
                <div className="col-5 text-right text-light border-right py-3">
                  <div className="m-auto">
                    <i className="ti-stats-up icon-xl" />
                  </div>
                </div>
                <div className="col-7 text-left py-3">
                  <h1 className="text-danger font-weight-bold font40">96%</h1>
                  <p className="text-light mb-1">Equipment Availability, Up From 70%</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="row">
                <div className="col-5 text-right text-light border-right py-3">
                  <div className="m-auto">
                    <i className="ti-user icon-xl" />
                  </div>
                </div>
                <div className="col-7 text-left py-3">
                  <h1 className="text-danger font-weight-bold font40">40</h1>
                  <p className="text-light mb-1">Technicians Led</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="row">
                <div className="col-5 text-right text-light border-right py-3">
                  <div className="m-auto">
                    <i className="ti-wallet icon-xl" />
                  </div>
                </div>
                <div className="col-7 text-left py-3">
                  <h1 className="text-danger font-weight-bold font40">20 M</h1>
                  <p className="text-light mb-1">TND Maintenance And CAPEX Budget</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects: the cards come from src/data/projects.js, each one opens its own page */}
      <section className="section" id="portfolio">
        <div className="container">
          <h2 className="mb-5 pb-4">
            <span className="text-danger">Projects</span> Highlights
          </h2>
          <div className="row">
            {projects.map((project) => (
              <div className="col-md-4 col-sm-6" key={project.slug}>
                <div className="card mb-5 pj-card">
                  <div className="card-header has-icon">
                    <i className={`${project.icon} text-danger`} aria-hidden="true" />
                  </div>
                  <div className="card-body px-4 py-3">
                    {project.date && (
                      <p className="pj-meta mb-2">{formatProjectDate(project.date)}</p>
                    )}
                    <h5 className="mb-3 card-title text-dark">
                      <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                    </h5>
                    <p className="subtitle">{project.summary}</p>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="btn btn-outline-danger btn-sm pj-card-more"
                    >
                      Read the project
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/projects" className="btn btn-danger mr-2 mb-2">
              All projects
            </Link>
            <Link to="/simulator" className="btn btn-outline-danger mb-2">
              Try my kiln operator simulator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Resume;
