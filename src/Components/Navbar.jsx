import React, { useEffect, useState } from "react";

const Navbar = () => {

    // State to track if the user has scrolled
    const [scrolled, setScrolled] = useState(false);
    const [NavClass, setNavClass] = useState("");
    

    // Function to handle scrolling
    useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 550) { // Adjust this value as per your needs
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
    
  const scrollToPortfolio = () => {
    const portfolioSection = document.getElementById("portfolio");
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToContact = () => {
    const portfolioSection = document.getElementById("contact");
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToResume = () => {
    const portfolioSection = document.getElementById("resume");
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAbout = () => { 
    const portfolioSection = document.getElementById("about");
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToHome = () => {  
    const portfolioSection = document.getElementById("home");
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: "smooth" });
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
                  onClick={scrollToHome}
                >
                  Home
                </button>
              </li>
              <li className="nav-item">

                <button
                  href="#about"
                  className="btn btn-link nav-link"
                  onClick={scrollToAbout}
                >
                  About
                </button>
              </li>
              <li className="nav-item">
                <button
                  href="#resume"
                  className="btn btn-link nav-link"
                  onClick={scrollToResume}
                >
                  Resume
                </button>
              </li>
            </ul>

            <ul className="navbar-nav brand">
              {/* Conditionally render avatar image based on scroll state */}
              {!scrolled && (
                <img
                  src="assets/imgs/avatar.jpg"
                  alt="Avatar"
                  className="brand-img"
                />
              )}
              <li className="brand-txt scrolled">
                <h5 className="brand-title">Ahmed OTHMAN</h5>
                <div className="brand-subtitle">
                  OT Engineer | Mechatronics Grad
                </div>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <button
                  href="#portfolio"
                  className="btn btn-link nav-link"
                  onClick={scrollToPortfolio}
                >
                  Portfolio
                </button>
              </li>
              
              <li className="nav-item last-item">
              <button
                  href="#contact"
                  className="btn btn-link nav-link "
                  onClick={scrollToContact}
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
