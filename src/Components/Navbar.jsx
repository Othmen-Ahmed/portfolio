import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {

    // Legacy no longer in use
    const [scrolled, setScrolled] = useState(false);

    const [NavClass, setNavClass] = useState("navbar sticky-top navbar-expand-lg navbar-light bg-white affix-top");
    
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Function to handle scrolling
    useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 550) { 
          setScrolled(true); // User scrolled past the threshold
          setNavClass("navbar sticky-top navbar-expand-lg navbar-light bg-white affix")
        } else {
          setScrolled(false); // User scrolled back up
          setNavClass("navbar sticky-top navbar-expand-lg navbar-light bg-white affix-top")
        }
      };
  
      // Attach the event listener
      window.addEventListener("scroll", handleScroll);
  
      // Cleanup the event listener when component unmounts
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
      
    }, []);
    
  // Scroll to a section of the home page; from another page, go home first
  const scrollToSection = (id) => {
    if (pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className= {NavClass}
        data-offset-top={510}
      >
        <div className="container">
          <button
            className="navbar-toggler ml-auto"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="collapse mt-sm-20 navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">

                <button
                  href="#home"
                  className="btn btn-link nav-link"
                  onClick={() => scrollToSection("home")}
                >
                  Home
                </button>
              </li>
              <li className="nav-item">

                <button
                  href="#about"
                  className="btn btn-link nav-link"
                  onClick={() => scrollToSection("about")}
                >
                  About
                </button>
              </li>
              <li className="nav-item">
                <button
                  href="#resume"
                  className="btn btn-link nav-link"
                  onClick={() => scrollToSection("resume")}
                >
                  Resume
                </button>
              </li>
            </ul>

            <ul className="navbar-nav brand">
            
                <img
                  src="assets/imgs/avatar.jpg"
                  alt="Avatar"
                  className="brand-img"
                />
              
              <li className="brand-txt scrolled">
                <h5 className="brand-title">Ahmed OTHMAN</h5>
                <div className="brand-subtitle">
                  Maintenance Manager &amp; Industrial Automation
                </div>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/projects" className="btn btn-link nav-link">
                  Projects
                </Link>
              </li>
              
              <li className="nav-item">
                <Link to="/simulator" className="btn btn-link nav-link">
                  Simulator
                </Link>
              </li>

              <li className="nav-item last-item">
              <button
                  href="#contact"
                  className="btn btn-link nav-link "
                  onClick={() => scrollToSection("contact")}
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
