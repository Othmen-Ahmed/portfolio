import React from "react";
import Mailto from "./Middleware/Mailto";

const Contact = () => {
  return (
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
  );
};

export default Contact;
