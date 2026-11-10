import React from "react";
import { Link } from "react-router-dom";

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
                    Maintenance Manager - SINOMA Cement Co Ltd{" "}
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
                    Industrial IT Specialist - Votorantim Cimentos{" "}
                    <span style={{ fontStyle: "italic" }}>-Tunisia</span>{" "}
                  </p>
                  <p className="subtitle">
                    ● Stepped in as Electrical Maintenance Manager at very short notice, leading a team of 18 and ensuring continuity
of maintenance operations for one year.
                  </p>
                  <p className="subtitle">
                    ● Maintained and continuously improved the plant process control system (PCS7, 14 S7-400 stations, 60 control
cabinets);monitored electrical energy and ensured regulatory compliance.
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
                  <h6 className="title text-danger">2017 - 2020</h6>
                  <p>B.E Mechatronics Engineering</p>
                  <p className="subtitle">
                  Graduated valedictorian from ENISo (<span><a href="http://www.eniso.rnu.tn/fr/">École Nationale d'Ingénieurs de Sousse</a></span>) 
                  with a major in Mechatronics Engineering and a minor in Systems Engineering, 
                  demonstrating exceptional academic performance and leadership in multidisciplinary 
                  engineering projects.
                  </p>
                  <hr />
                  <h6 className="title text-danger">2015 - 2017</h6>
                  <p>Diploma in Engineering Prep school</p>
                  <p className="subtitle">
                  Graduated valedictorian from Engineering Prep School, 
                  showcasing outstanding academic performance and a strong 
                  foundation in advanced mathematics, physics, and engineering 
                  principles.
                  </p>
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
                  <h6>PCS7</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "97%" }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>OT Networking: Profibus/Profinet</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "97%" }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>TIA PORTAL V17</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "95%" }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>

                  <h6>WinCC Advanced: HMI Design</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "90%" }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>

                  <h6>Ignition</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "70%" }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>SOLIDWORKS</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "65%" }}
                      aria-valuenow={75}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>HTML5 &amp; CSS</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "50%" }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>JavaScript &amp; NODE.JS</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "50%" }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>

                  <h6>DataBase Managment: SQL, MongoDB</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "50%" }}
                      aria-valuenow={75}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <h6>Python</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "50%" }}
                      aria-valuenow={75}
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
                  <h1 className="text-danger font-weight-bold font40">4+</h1>
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
                  <h1 className="text-danger font-weight-bold font40">5+</h1>
                  <p className="text-light mb-1">Project Finished</p>
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
            <div className="col-md-4 col-sm-6">
              <div className="card mb-5">
                <div className="card-header has-icon">
                  <i className="ti-vector text-danger" aria-hidden="true" />
                </div>
                <div className="card-body px-4 py-3">
                  <h5 className="mb-3 card-title text-dark">
                    ABB Ability™ Expert Optimizer for mining
                  </h5>
                  <p className="subtitle">
                    Assisted in the integration of Advanced Process Control
                    (APC) applications utilizing Model Predictive Control (MPC)
                    technology to stabilize production and maximize
                    profitability. Communication with the current DCS(SIemens PCS7) 
                    was done using OPC DA. Switching logic was configured to grafully 
                    transition between normal and automatic operations.
                    
                  </p>
                  
                  <figure className="text-center">
                    <img
                      src="./assets/imgs/optimization-with-apc.jpg"
                      alt="MPC Optimization"
                      className="img-fluid"
                    />
                    <figcaption>MPC Optimization with ABB APC</figcaption>
                  </figure>
                  <Link
                    to="/simulator"
                    className="btn btn-danger"
                    style={{ marginTop: "10px" }}
                  >
                    Try my kiln operator simulator
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="card mb-5">
                <div className="card-header has-icon">
                  <i className="ti-write text-danger" aria-hidden="true" />
                </div>
                <div className="card-body px-4 py-3">
                  <h5 className="mb-3 card-title text-dark">
                    Laboratory Information Management System (LIMS) for cement
                    manufacturing
                  </h5>
                  <p className="subtitle">
                    Implemented and optimized LIMS (Laboratory Information
                    Management Systems) to enhance cement quality control by
                    tracking raw materials, fuels, and final products, ensuring
                    compliance with ISO 14000 and 17025 standards. Improved
                    accessibility and transparency of data for management and
                    plant personnel through ABB Ability™ Knowledge Manager,
                    streamlining workflow and reducing training efforts.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="card mb-5">
                <div className="card-header has-icon">
                  <i className="ti-package text-danger" aria-hidden="true" />
                </div>
                <div className="card-body px-4 py-3">
                  <h5 className="mb-3 card-title text-dark">
                    LoTo App (Work In Progress)
                  </h5>
                  <p className="subtitle">
                    Developing a Lockout/Tagout (LoTo) application using React
                    JS, MongoDB, and OPC DA to streamline equipment isolation
                    procedures, ensuring enhanced safety and compliance.
                    Integrating real-time data handling with OPC DA for
                    effective monitoring and control of equipment statuses.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="card mb-5">
                <div className="card-header has-icon">
                  <i className="ti-map-alt text-danger" aria-hidden="true" />
                </div>
                <div className="card-body px-4 py-3">
                  <h5 className="mb-3 card-title text-dark">
                    Lime Stone Crusher Commisioning
                  </h5>
                  <p className="subtitle">
                    Commissioned limestone crushers, applying logic controls in
                    compliance with IEC standards for mining, ensuring
                    operational safety, process optimization, and equipment
                    efficiency through systematic testing and automation
                    integration.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="card mb-5">
                <div className="card-header has-icon">
                  <i className="ti-bar-chart text-danger" aria-hidden="true" />
                </div>
                <div className="card-body px-4 py-3">
                  <h5 className="mb-3 card-title text-dark">
                    Bulk Loading Point Commisioning
                  </h5>
                  <p className="subtitle">
                    Implemented a new bulk loading point using Siemens PCS7 :
                    Developed and integrated new HMI and the required logic
                    according to the process and mechanical specification.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="card mb-5">
                <div className="card-header has-icon">
                  <i className="ti-support text-danger" aria-hidden="true" />
                </div>
                <div className="card-body px-4 py-3">
                  <h5 className="mb-3 card-title text-dark">
                    Unitherm Berner Commisioning
                  </h5>
                  <p className="subtitle">
                    Commissioned UniTherm burners in accordance with supplier
                    specifications, ensuring optimal performance, safety
                    compliance, and efficiency through precise calibration and
                    system testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      {/* <section className="section bg-custom-gray" id="portfolio">
        <div className="container">
          <h1 className="mb-5">
            <span className="text-danger">My</span> Projects
          </h1>
          {/* <div className="portfolio">
            <div className="filters">
              <a href="#" data-filter=".new" className="active">
                New
              </a>
              <a href="#" data-filter=".advertising">
                OT Engineering
              </a>
              <a href="#" data-filter=".branding">
                OT Architecture
              </a>
              <a href="#" data-filter=".web">
                Product Design
              </a>
            </div>
            <div className="portfolio-container">
              <div className="col-md-6 col-lg-4 web new">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/web-1.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a className="img-popup" href="assets/imgs/web-1.jpg" />
                    <div className="text-holder">
                      <h6 className="title">WEB</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 web new">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/web-2.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a className="img-popup" href="assets/imgs/web-2.jpg" />
                    <div className="text-holder">
                      <h6 className="title">WEB</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 advertising new">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/advertising-2.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a
                      className="img-popup"
                      href="assets/imgs/advertising-2.jpg"
                    />
                    <div className="text-holder">
                      <h6 className="title">ADVERSTISING</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 web">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/web-4.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a className="img-popup" href="assets/imgs/web-4.jpg" />
                    <div className="text-holder">
                      <h6 className="title">WEB</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 advertising">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/advertising-1.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a
                      className="img-popup"
                      href="assets/imgs/advertising-1.jpg"
                    />
                    <div className="text-holder">
                      <h6 className="title">ADVERSITING</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 web new">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/web-3.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a className="img-popup" href="assets/imgs/web-3.jpg" />
                    <div className="text-holder">
                      <h6 className="title">WEB</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 advertising new">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/advertising-3.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a
                      className="img-popup"
                      href="assets/imgs/advertising-3.jpg"
                    />
                    <div className="text-holder">
                      <h6 className="title">ADVERSITING</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 advertising new">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/advertising-4.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a
                      className="img-popup"
                      href="assets/imgs/advertising-4.jpg"
                    />
                    <div className="text-holder">
                      <h6 className="title">ADVERTISING</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 branding new">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/branding-1.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a
                      className="img-popup"
                      href="assets/imgs/branding-1.jpg"
                    />
                    <div className="text-holder">
                      <h6 className="title">BRANDING</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 branding">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/branding-2.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a
                      className="img-popup"
                      href="assets/imgs/branding-2.jpg"
                    />
                    <div className="text-holder">
                      <h6 className="title">BRANDING</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 branding new">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/branding-3.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a
                      className="img-popup"
                      href="assets/imgs/branding-3.jpg"
                    />
                    <div className="text-holder">
                      <h6 className="title">BRANDING</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 branding">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/branding-4.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a
                      className="img-popup"
                      href="assets/imgs/branding-4.jpg"
                    />
                    <div className="text-holder">
                      <h6 className="title">BRANDING</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 branding">
                <div className="portfolio-item">
                  <img
                    src="assets/imgs/branding-5.jpg"
                    className="img-fluid"
                    alt="Download free bootstrap 4 admin dashboard, free boootstrap 4 templates"
                  />
                  <div className="content-holder">
                    <a
                      className="img-popup"
                      href="assets/imgs/branding-5.jpg"
                    />
                    <div className="text-holder">
                      <h6 className="title">BRANDING</h6>
                      <p className="subtitle">
                        Expedita corporis doloremque velit in totam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
{/*
          <div>
            <span className="material-symbols-outlined">construction</span>
            <h6>Work in Progress</h6>
            <span className="material-symbols-outlined">construction</span>
          </div>
        </div>
      </section>
      {/* End of portfolio section */}
      
    </>
  );
};

export default Resume;
