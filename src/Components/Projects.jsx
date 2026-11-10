import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Contact from "./Contact";
import projects from "../data/projects";

const Projects = () => {
  return (
    <>
      <Header />

      <Navbar />

      <section className="section" id="projects">
        <div className="container">
          <h2 className="mb-5 pb-4">
            <span className="text-danger">My</span> Projects
          </h2>
          <p className="subtitle mb-5">
            Industrial automation, electrical and maintenance projects. Open a
            project for the full story and pictures.
          </p>
          <div className="row">
            {projects.map((project) => (
              <div className="col-md-4 col-sm-6" key={project.slug}>
                <div className="card mb-5">
                  <div className="card-header has-icon">
                    <i className={`${project.icon} text-danger`} aria-hidden="true" />
                  </div>
                  <div className="card-body px-4 py-3">
                    <h5 className="mb-3 card-title text-dark">{project.title}</h5>
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

      <Contact />
    </>
  );
};

export default Projects;
