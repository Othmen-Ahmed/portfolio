import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Resume from "./Resume";
import Mailto from "./Middleware/Mailto";

const Home = () => {
  return (
    <>
      <Header />

      <Navbar />

      <div className="container-fluid">
        <div id="about" className="row about-section">
          <div className="col-lg-4 about-card">
            <h3 className="font-weight-light">Who am I ?</h3>
            <span className="line mb-5" />
            <h5 className="mb-3">
              Maintenance Manager | Electrical &amp; Industrial IT Engineer , Tunisia
            </h5>
            <p className="mt-20">
              Maintenance manager with 5 years of experience in the cement industry. Leads a 40-technician maintenance
              team plus contractors, with a TND 20 M maintenance and CAPEX budget. Proven record in maintenance
              strategy and planning, failure analysis (8D, RCA, PDCA), KPI monitoring, spare-parts and cost management,
              and CAPEX projects from specification to commissioning. Raised equipment availability from 70% to 96%.
              Fluent in English and French (C1).
            </p>
            
            <hr></hr>
            
            <a
              className="btn btn-outline-danger"
              href="./assets/pdf/Ahmed_OTHMAN_CV_EN.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              English Resume
            </a>
            <br />
            <a
              className="btn btn-outline-danger"
              style={{ marginTop: "10px" }}
              href="./assets/pdf/Ahmed_OTHMAN_CV_EU.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              French Resume
            </a>
          </div>

          <div className="col-lg-4 about-card">
            <h3 className="font-weight-light">Personal Info</h3>
            <span className="line mb-5" />
            <ul className="mt40 info list-unstyled">
              <li>
                <span>Email</span> :{" "}
                <Mailto
                  mailto="mailto:ahmed.othman.oa@gmail.com"
                  label="ahmed.othman.oa@gmail.com"
                />
              </li>
              <li>
                <span>Phone</span> : (+216) 99 987 391
              </li>
              <li>
                <span>Location</span> : Tunisia
              </li>
            </ul>
            <ul className="social-icons pt-3">
              <li className="social-item">
                <a
                  className="social-link"
                  href="https://www.linkedin.com/in/othmen-ahmed/"
                >
                  <i className="ti-linkedin" aria-hidden="true" />
                </a>
              </li>
              <li className="social-item">
                <a
                  className="social-link"
                  href="https://github.com/Othmen-Ahmed"
                >
                  <i className="ti-github" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
          <div className="col-lg-4 about-card">
            <h3 className="font-weight-light">My Expertise</h3>
            <span className="line mb-5" />
            <div className="row">
              <div className="col-1 text-danger pt-1">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "35px" }}
                >
                  precision_manufacturing
                </span>
              </div>
              <div className="col-10 ml-auto mr-3">
                <h6>OT Programming</h6>
                <p className="subtitle">
                  {" "}
                  PCS7, AVEVA PI, TIA Portal, WinCC, Ignition
                </p>

                <hr />
              </div>
            </div>
            <div className="row">
              <div className="col-1 text-danger pt-1">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "35px" }}
                >
                  network_node
                </span>
              </div>
              <div className="col-10 ml-auto mr-3">
                <h6>OT Networks</h6>
                <p className="subtitle">
                  ProfiBus, ProfiNet, ModBus, Ethernet, Ciso Router
                  administration CCNA
                </p>
                <hr />
              </div>
            </div>
            <div className="row">
              <div className="col-1 text-danger pt-1">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "35px" }}
                >
                  language
                </span>
              </div>
              <div className="col-10 ml-auto mr-3">
                <h6>Full Stack Web-development</h6>
                <p className="subtitle">
                  HTML5, CSS, BootStrap5, Node.JS, React.JS, MongoDB, Windows
                  SQL Server 2019, ExpressJS
                </p>
                <hr />
              </div>
            </div>
            <div className="row">
              <div className="col-1 text-danger pt-1">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "35px" }}
                >
                  manufacturing
                </span>
              </div>
              <div className="col-10 ml-auto mr-3">
                <h6>Product design and analysis</h6>
                <p className="subtitle">
                  SolidWorks, Ansys, Comsol Multiphysics, Matlab, Simulink
                </p>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Resume />

      <section className="section bg-dark ">
        <div className="section contact" id="contact">
          <div id="map" className="map" />
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="contact-info-card">
                  <h4 className="contact-title">Get in touch</h4>
                  <div className="row mb-2">
                    <div className="col-1 pt-1 mr-1">
                      <i className="ti-mobile icon-md" />
                    </div>
                    <div className="col-10 ">
                      <h6 className="d-inline">
                        Phone : <br />{" "}
                        <span className="text-muted">(+216) 99 987 391</span>
                      </h6>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-1 pt-1 mr-1">
                      <i className="ti-map-alt icon-md" />
                    </div>
                    <div className="col-10">
                      <h6 className="d-inline">
                        Address :<br />{" "}
                        <span className="text-muted">
                          Tunisia
                        </span>
                      </h6>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-1 pt-1 mr-1">
                      <i className="ti-envelope icon-md" />
                    </div>
                    <div className="col-10">
                      <h6 className="d-inline">
                        Email :<br />{" "}
                        <span className="text-muted">
                          <Mailto
                            mailto="mailto:ahmed.othman.oa@gmail.com"
                            label="ahmed.othman.oa@gmail.com"
                          />
                        </span>
                      </h6>
                    </div>
                  </div>
                  <ul className="social-icons pt-4">
                    <li className="social-item">
                      <a
                        className="social-link "
                        href="https://github.com/Othmen-Ahmed"
                      >
                        <i className="ti-github" aria-hidden="true" />
                      </a>
                    </li>
                    <li className="social-item">
                      <a
                        className="social-link"
                        href="https://www.linkedin.com/in/othmen-ahmed/"
                      >
                        <i className="ti-linkedin" aria-hidden="true" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
