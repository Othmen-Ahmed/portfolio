import React from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import NotFound from "../NotFound";
import ProjectBlock from "./ProjectBlock";
import projects, { findProject, formatProjectDate } from "../../data/projects";
import "./Projects.css";

// Page #/projects/<slug>: one project, written like a blog post.
// Its text and photos come from src/data/projects.js
const ProjectPost = () => {
  const { slug } = useParams();
  const project = findProject(slug);

  if (!project) return <NotFound />;

  const index = projects.indexOf(project);
  const newer = projects[index - 1];
  const older = projects[index + 1];

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
              <li className="breadcrumb-item">
                <Link to="/projects">Projects</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {project.title}
              </li>
            </ol>
          </nav>

          <h1 className="pj-title">{project.title}</h1>
          <span className="line mb-4" />

          <ul className="list-unstyled pj-facts-line">
            {project.date && (
              <li>
                <i className="ti-calendar text-danger" aria-hidden="true" /> {formatProjectDate(project.date)}
              </li>
            )}
            {project.role && (
              <li>
                <i className="ti-user text-danger" aria-hidden="true" /> {project.role}
              </li>
            )}
            {project.company && (
              <li>
                <i className="ti-briefcase text-danger" aria-hidden="true" /> {project.company}
              </li>
            )}
            {project.location && (
              <li>
                <i className="ti-location-pin text-danger" aria-hidden="true" /> {project.location}
              </li>
            )}
          </ul>

          <div className="row">
            <div className="col-lg-8">
              <article className="pj-article">
                {project.cover && (
                  <figure className="pj-figure pj-cover">
                    <img src={project.cover} alt={project.title} className="img-fluid" />
                  </figure>
                )}

                <p className="pj-lead">{project.summary}</p>

                {project.content.map((block, i) => (
                  <ProjectBlock block={block} key={`${block.type}-${i}`} />
                ))}
              </article>
            </div>

            <div className="col-lg-4">
              {project.results.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <div className="mt-2">
                      <h4>Key results</h4>
                      <span className="line" />
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled mb-0 pj-results">
                      {project.results.map((result) => (
                        <li key={result}>
                          <i className="ti-check text-danger" aria-hidden="true" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="card">
                <div className="card-header">
                  <div className="mt-2">
                    <h4>Tools and topics</h4>
                    <span className="line" />
                  </div>
                </div>
                <div className="card-body">
                  {project.tags.map((tag) => (
                    <span className="badge badge-light pj-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="my-5" />

          <div className="row pj-neighbours">
            <div className="col-md-6 mb-3">
              {newer && (
                <Link to={`/projects/${newer.slug}`}>
                  <span className="pj-meta">
                    <i className="ti-arrow-left" aria-hidden="true" /> Newer project
                  </span>
                  <h6 className="mt-1 text-dark">{newer.title}</h6>
                </Link>
              )}
            </div>
            <div className="col-md-6 mb-3 text-md-right">
              {older && (
                <Link to={`/projects/${older.slug}`}>
                  <span className="pj-meta">
                    Older project <i className="ti-arrow-right" aria-hidden="true" />
                  </span>
                  <h6 className="mt-1 text-dark">{older.title}</h6>
                </Link>
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/projects" className="btn btn-outline-danger">
              All projects
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProjectPost;
