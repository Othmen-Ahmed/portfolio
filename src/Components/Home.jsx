import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Resume from "./Resume";
import Contact from "./Contact";
import Mailto from "./Middleware/Mailto";

const Home = () => {
  const location = useLocation();

  // Another page asked us to land on a specific section (e.g. Resume)
  useEffect(() => {
    const target = location.state && location.state.scrollTo;
    if (!target) return;
    const timer = setTimeout(() => {
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [location.state]);

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
              Maintenance Manager &amp; Industrial Automation , Tunisia
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
                <h6>Maintenance Management</h6>
                <p className="subtitle">
                  {" "}
                  Maintenance strategy and planning, KPIs (availability, MTBF,
                  MTTR), budgeting and cost control, spare-parts and inventory
                  management, failure analysis (RCA, 8D, PDCA, FMEA), CAPEX
                  planning and execution
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
                <h6>Electrical</h6>
                <p className="subtitle">
                  HV/MV/LV distribution, MV transformers, protection relays and
                  protection testing, variable frequency drives, medium voltage
                  motors
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
                  developer_board
                </span>
              </div>
              <div className="col-10 ml-auto mr-3">
                <h6>Industrial Automation</h6>
                <p className="subtitle">
                  STEP 7, TIA Portal V20, PCS7 V9, CFC, SFC, WinCC Advanced V6,
                  OPC DA, OPC UA, Profibus, Profinet, EtherNet/IP, PRONETA
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
                  groups
                </span>
              </div>
              <div className="col-10 ml-auto mr-3">
                <h6>Leadership &amp; Digital</h6>
                <p className="subtitle">
                  Team leadership (40 technicians), technical reporting,
                  cross-functional coordination, CCNA networking, React &amp;
                  Node.js development
                </p>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Resume />

      <Contact />
    </>
  );
};

export default Home;
