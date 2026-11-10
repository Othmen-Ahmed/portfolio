import React from "react";
import { Link } from "react-router-dom";

// One block of a project page. The block types are listed at the top of src/data/projects.js
const ProjectBlock = ({ block }) => {
  switch (block.type) {
    case "heading":
      return <h4 className="pj-heading">{block.text}</h4>;

    case "paragraph":
      return <p>{block.text}</p>;

    case "list":
      return (
        <ul className="pj-list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );

    case "image":
      return (
        <figure className="pj-figure">
          <a href={block.src} target="_blank" rel="noopener noreferrer">
            <img src={block.src} alt={block.caption || ""} className="img-fluid" loading="lazy" />
          </a>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case "gallery":
      return (
        <div className="pj-gallery">
          {block.images.map((image) => (
            <figure className="pj-figure" key={image.src}>
              <a href={image.src} target="_blank" rel="noopener noreferrer">
                <img src={image.src} alt={image.caption || ""} loading="lazy" />
              </a>
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </div>
      );

    case "table":
      return (
        <div className="table-responsive">
          <table className="table table-sm pj-table">
            {block.head && (
              <thead>
                <tr>
                  {block.head.map((cell) => (
                    <th key={cell}>{cell}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, i) => (
                    <td key={`${i}-${cell}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "quote":
      return (
        <blockquote className="pj-quote">
          <p>{block.text}</p>
          {block.by && <footer>{block.by}</footer>}
        </blockquote>
      );

    case "link":
      return (
        <p>
          {block.to ? (
            <Link to={block.to} className="btn btn-danger">
              {block.label}
            </Link>
          ) : (
            <a href={block.href} className="btn btn-outline-danger" target="_blank" rel="noopener noreferrer">
              {block.label}
            </a>
          )}
        </p>
      );

    default:
      return null;
  }
};

export default ProjectBlock;
