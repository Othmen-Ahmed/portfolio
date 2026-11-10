import React from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Contact from "./Contact";
import { getProject } from "../data/projects";

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) {
    return (
      <>
        <Header />
        <Navbar />
        <section className="section text-center">
          <div className="container">
            <h2 className="mb-4">Project not found</h2>
            <p className="subtitle mb-4">
              This project does not exist (yet). Maybe it is still being written.
            </p>
            <Link to="/projects" className="btn btn-danger">
              Back to all projects
            </Link>
          </div>
        </section>
        <Contact />
      </>
    );
  }

  return (
    <>
      <Header />

      <Navbar />

      <section className="section" id="project">
        <div className="container">
          <p className="subtitle">
            <Link to="/projects">&larr; All projects</Link>
          </p>
          <h2 className="mb-2">{project.title}</h2>
          <p className="subtitle text-danger">
            {project.role}
            {project.date && <> &middot; {project.date}</>}
          </p>
          <span className="line mb-5" />

          <div className="row">
            <div className="col-lg-8">
              <h4 className="mb-3">About this project</h4>
              <p className="subtitle">{project.summary}</p>

              <h4 className="mt-4 mb-3">What I did</h4>
              <ul className="subtitle">
                {project.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>

              {project.link && (
                <Link
                  to={project.link.to}
                  className="btn btn-danger"
                  style={{ marginTop: "10px" }}
                >
                  {project.link.label}
                </Link>
              )}
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <div className="mt-2">
                    <h4>Gallery</h4>
                    <span className="line" />
                  </div>
                </div>
                <div className="card-body">
                  {project.images.length === 0 && (
                    <p className="subtitle">
                      Pictures coming soon. Add them in
                      <code> src/data/projects.js</code>.
                    </p>
                  )}
                  {project.images.map((image, i) => (
                    <figure className="text-center mb-4" key={i}>
                      <img
                        src={image.src}
                        alt={image.caption}
                        className="img-fluid"
                      />
                      <figcaption>{image.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
};

export default ProjectDetail;
