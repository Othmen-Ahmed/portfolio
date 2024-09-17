import React from "react";

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
                    <h4>Expertise</h4>
                    <span className="line" />
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="title text-danger">09/2021 - Present</h6>
                  <p>
                    Industrial IT Specialist - Votorantim Cimentos{" "}
                    <span style={{ fontStyle: "italic" }}>--Tunisia</span>{" "}
                  </p>
                  <p className="subtitle">
                    ● Led efforts of PCS7 system audit, resolving networking
                    errors and implementing a spare parts strategy for enhanced
                    reliability and minimal downtime. Fully eliminated fugitive
                    networking faults and maintained 100% reliability for two
                    consecutive years.
                  </p>
                  <p className="subtitle">
                    ● Boosted operational efficiency by 30%, enabling faster
                    decision-making and reducing manual reporting time.
                    Orchestrated seamless integration of LIMS and AVEVA PI with
                    existing DCS, facilitating real-time reporting for
                    statistical analysis and operations.
                  </p>
                  <p className="subtitle">
                    ● Maintained zero production downtime during a major system
                    upgrade by designing and implementing a new OT network
                    architecture. Enabled concurrent operation of old and new
                    crushing systems, ensuring continuous limestone production
                    throughout the transition.
                  </p>
                  <hr />
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
                  <h6 className="title text-danger">2017 - 2021</h6>
                  <p>B.E Mechatronics Engineering</p>
                  <p className="subtitle">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Error corrupti recusandae obcaecati odit repellat ducimus
                    cum, minus tempora aperiam at.
                  </p>
                  <hr />
                  <h6 className="title text-danger">2015 - 2017</h6>
                  <p>Diploma in Engineering Prep school</p>
                  <p className="subtitle">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Eos, id officiis quas placeat quia voluptas dolorum rem
                    animi nostrum quae.aliquid repudiandae saepe!.
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

                  <h6>German: A2</h6>
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
                  <h1 className="text-danger font-weight-bold font40">3</h1>
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
                  <h1 className="text-danger font-weight-bold font40">2k</h1>
                  <p className="text-light mb-1">Coffee Drinked</p>
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
                  <figure class="text-center">
                    <img
                      src="./assets/imgs/optimization-with-apc.jpg"
                      alt="MPC Optimization"
                      class="img-fluid"
                    />
                    <figcaption>MPC Optimization with ABB APC</figcaption>
                  </figure>
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
      <section className="section bg-custom-gray" id="portfolio">
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

          <p>
            <span class="material-symbols-outlined">construction</span>
            <h6>Work in Progress</h6>
            <span class="material-symbols-outlined">construction</span>
          </p>
        </div>
      </section>
      {/* End of portfolio section */}
    </>
  );
};

export default Resume;
