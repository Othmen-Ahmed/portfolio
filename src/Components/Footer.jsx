import React from "react";
import Mailto from "./Middleware/Mailto";

// Closing band of the pages that do not end with the contact section
const Footer = () => {
  return (
    <section className="section bg-dark text-center py-5">
      <div className="container">
        <h5 className="text-light mb-2">Ahmed OTHMAN</h5>
        <p className="text-light mb-3">
          Maintenance Manager &amp; Industrial Automation, Tunis, Tunisia
        </p>
        <p className="mb-0 pj-footer-mail">
          <Mailto
            mailto="mailto:ahmed.othman.oa@gmail.com"
            label="ahmed.othman.oa@gmail.com"
          />
        </p>
        <ul className="social-icons pt-3 justify-content-center mb-0 pj-footer-social">
          <li className="social-item">
            <a
              className="social-link text-light"
              href="https://github.com/Othmen-Ahmed"
              aria-label="GitHub"
            >
              <i className="ti-github" aria-hidden="true" />
            </a>
          </li>
          <li className="social-item">
            <a
              className="social-link text-light"
              href="https://www.linkedin.com/in/othmen-ahmed/"
              aria-label="LinkedIn"
            >
              <i className="ti-linkedin" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Footer;
