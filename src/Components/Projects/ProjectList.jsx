import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import projects, { formatProjectDate } from "../../data/projects";
import "./Projects.css";

// Page #/projects: every project, newest first, each one opening its own page
const ProjectList = () => {
  return (
    <>
      <Navbar solid />

      <section className="section pj-page">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent px-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Projects
              </li>
            </ol>
          </nav>

          <h2 className="mb-3">
            <span className="text-danger">My</span> Projects
          </h2>
          <p className="pj-lead mb-5">
            Commissioning, automation and electrical projects from five years
            in cement plants. Open one to read how it went.
          </p>

          {projects.map((project) => (
            <div className="card pj-row" key={project.slug}>
              <div className="row no-gutters">
                <div className="col-md-4">
                  <Link to={`/projects/${project.slug}`} className="pj-thumb" tabIndex={-1} aria-hidden="true">
                    {project.cover ? (
                      <img src={project.cover} alt="" />
                    ) : (
                      <i className={`${project.icon} text-danger`} />
                    )}
                  </Link>
                </div>
                <div className="col-md-8">
                  <div className="card-body px-4 py-4">
                    <p className="pj-meta mb-2">
                      {[formatProjectDate(project.date), project.role, project.company]
                        .filter(Boolean)
                        .join(" | ")}
                    </p>
                    <h4 className="mb-3">
                      <Link to={`/projects/${project.slug}`} className="text-dark">
                        {project.title}
                      </Link>
                    </h4>
                    <p className="subtitle">{project.summary}</p>
                    <p className="mb-3">
                      {project.tags.map((tag) => (
                        <span className="badge badge-light pj-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </p>
                    <Link to={`/projects/${project.slug}`} className="btn btn-outline-danger btn-sm">
                      Read the project
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProjectList;
