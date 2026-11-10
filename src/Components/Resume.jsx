import React from "react";
import { Link } from "react-router-dom";
import projects from "../data/projects";

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
            <div className="col-md-6 col-lg-4">
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
                    <span style={{ fontStyle: "italic" }}>--Tunis</span>{" "}
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
relay configuration and testing, Tunisian regulatory compliance.
                  </p>
                  <p className="subtitle">
                    ● Defined SOPs for critical tasks to improve safety and repeatability, and set up a communication framework with
production and quality.
                  </p>
                  <hr />
                  <h6 className="title text-danger">02/2022 - 03/2025</h6>
                  <p>
                    Industrial Automation Engineer - Votorantim Cimentos{" "}
                    <span style={{ fontStyle: "italic" }}>--Tunis</span>{" "}
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

            {/* Education */}
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-header">
                  <div className="mt-2">
                    <h4>Education</h4>
                    <span className="line" />
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="title text-danger">09/2017 - 09/2021</h6>
                  <p>Engineering Degree (Diplôme d’Ingénieur) in Mechatronics</p>
                  <p className="subtitle">
                  Engineering degree in Mechatronics from ENISO (<span><a href="http://www.eniso.rnu.tn/fr/">
École Nationale d'Ingénieurs de Sousse</a></span>),
                  with a strong foundation in mechanical, electrical and control
                  engineering applied to multidisciplinary industrial projects.
                  </p>
                </div>
              </div>

              {/* Certifications */}
              <div className="card">
                <div className="card-header">
                  <div className="pull-left">
                    <h4 className="mt-2">Certifications</h4>
                    <span className="line" />
                  </div>
                </div>
                <div className="card-body pb-2">
                  <h6>PMP &reg; - Project Management Professional</h6>
                  <hr />
                  <h6>Cisco Certified Network Associate (CCNA)</h6>
                  <hr />
                  <h6>ABB Ability&trade; Expert Optimizer</h6>
                  <hr />
                  <h6>React &amp; Node.js</h6>
                  <hr />
                  <h6>TOEIC (940)</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <div className="pull-left">
                    <h4 className="mt-2">Skills</h4>
                    <span className="line" />
                  </div>
                </div>

                <div className="card-body pb-2">
                  <h6>Maintenance Strategy &amp; Planning</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "95%" }}
                      aria-valuenow={95}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>Failure Analysis: RCA, 8D, PDCA, FMEA</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "95%" }}
                      aria-valuenow={95}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>Budgeting &amp; Cost Control (CAPEX/OPEX)</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "90%" }}
                      aria-valuenow={90}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>

                  <h6>HV/MV/LV Distribution &amp; Protection Relays</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "90%" }}
                      aria-valuenow={90}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>

                  <h6>PCS7 V9: CFC, SFC</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "95%" }}
                      aria-valuenow={95}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>TIA Portal V20 &amp; STEP 7</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "95%" }}
                      aria-valuenow={95}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>WinCC Advanced V6: HMI Design</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "90%" }}
                      aria-valuenow={90}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>Industrial Networks: Profibus, Profinet, PRONETA</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "92%" }}
                      aria-valuenow={92}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>

                  <h6>OPC DA &amp; OPC UA</h6>
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

                  <h6>React &amp; Node.js</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "70%" }}
                      aria-valuenow={70}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
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
                      aria-valuenow={50}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>English: C1</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "100%" }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>French: C1</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "100%" }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>

                  <h6>German: A1</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "25%" }}
                      aria-valuenow={50}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
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
            <div className="col-md-12 col-lg-4">
              <div className="row ">
                <div className="col-5 text-right text-light border-right py-3">
                  <div className="m-auto">
                    <i className="ti-alarm-clock icon-xl" />
                  </div>
                </div>
                <div className="col-7 text-left py-3">
                  <h1 className="text-danger font-weight-bold font40">5+</h1>
                  <p className="text-light mb-1">Years Of Experience</p>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-4">
              <div className="row">
                <div className="col-5 text-right text-light border-right py-3">
                  <div className="m-auto">
                    <i className="ti-layers-alt icon-xl" />
                  </div>
                </div>
                <div className="col-7 text-left py-3">
                  <h1 className="text-danger font-weight-bold font40">7+</h1>
                  <p className="text-light mb-1">Projects Delivered</p>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-4">
              <div className="row">
                <div className="col-5 text-right text-light border-right py-3">
                  <div className="m-auto">
                    <i className="ti-heart-broken icon-xl" />
                  </div>
                </div>
                <div className="col-7 text-left py-3">
                  <h1 className="text-danger font-weight-bold font40">40</h1>
                  <p className="text-light mb-1">Technicians Led</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="service">
        <div className="container">
          <h2 className="mb-5 pb-4">
            <span className="text-danger">Projects</span> Highlights
          </h2>
          <div className="row">
            {projects.map((project) => (
              <div className="col-md-4 col-sm-6" key={project.slug}>
                <div className="card mb-5">
                  <div className="card-header has-icon">
                    <i className={`${project.icon} text-danger`} aria-hidden="true" />
                  </div>
                  <div className="card-body px-4 py-3">
                    <h5 className="mb-3 card-title text-dark">
                      {project.title}
                    </h5>
                    {project.date && (
                      <p className="subtitle text-danger">
                        {project.role} &middot; {project.date}
                      </p>
                    )}
                    <p className="subtitle">{project.summary}</p>

                    {project.images.length > 0 && (
                      <figure className="text-center">
                        <img
                          src={project.images[0].src}
                          alt={project.images[0].caption}
                          className="img-fluid"
                        />
                        <figcaption>{project.images[0].caption}</figcaption>
                      </figure>
                    )}
                    <Link
                      to={`/projects/${project.slug}`}
                      className="btn btn-outline-danger"
                      style={{ marginTop: "10px" }}
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Resume;
