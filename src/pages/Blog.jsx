import React from "react";
import { Link } from "react-router-dom";
import { blogHighlights } from "../data/blogHighlights";
import { Navbar, Footer } from "../components";

const Blog = () => {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="blog-header text-center mb-5">
          <h1 className="fw-bold">Journal</h1>
          <p className="text-muted">Stories, styling tips, and care guides from Zairi.</p>
        </div>

        <div className="row g-4">
          {blogHighlights.map((post) => (
            <div key={post.id} className="col-md-6">
              <div className="blog-card h-100">
                <div className="blog-card-body">
                  <span className="blog-date">{post.date}</span>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                </div>
                <div className="blog-card-footer">
                  <Link to={post.slug}>Read article →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />

      <style>{`
        .blog-card {
          border: 1px solid #f0f0f0;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
        .blog-date {
          font-size: 12px;
          letter-spacing: 1px;
          color: #777;
          text-transform: uppercase;
        }
        .blog-title {
          font-size: 22px;
          margin: 12px 0;
          color: #111;
        }
        .blog-excerpt {
          font-size: 14px;
          color: #555;
        }
        .blog-card-footer a {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #111;
          text-decoration: none;
        }
      `}</style>
    </>
  );
};

export default Blog;

