import React from "react";
import { useParams, Link } from "react-router-dom";
import { blogHighlights } from "../data/blogHighlights";
import { Navbar, Footer } from "../components";
import SEO from "../components/SEO";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogHighlights.find((item) => item.slug === `/blog/${slug}`);

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <h2>Article not found</h2>
          <Link to="/blog" className="btn btn-outline-dark mt-3">
            Back to Journal
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // SEO for blog post
  const blogTitle = post.title;
  const blogDescription = post.excerpt;
  const blogUrl = `https://zairi.in${post.slug}`;
  const blogKeywords = post.slug.includes('anti-tarnish') 
    ? "anti tarnish jewellery, anti tarnish jewellery india, anti tarnish jewellery online, what is anti tarnish jewellery, anti tarnish jewellery benefits, best anti tarnish jewellery"
    : "jewelry care, jewelry maintenance, jewelry tips, jewelry guide";

  return (
    <>
      <SEO
        title={`${blogTitle} | Zairi Blog`}
        description={blogDescription}
        keywords={blogKeywords}
        url={blogUrl}
        type="article"
      />
      <Navbar />
      <div className="container py-5 blog-post-container">
        <Link to="/blog" className="blog-back-link">← Back to Journal</Link>
        <span className="blog-post-date">{post.date}</span>
        <h1 className="blog-post-title">{post.title}</h1>
        <p className="blog-post-excerpt">{post.excerpt}</p>
        <div className="blog-post-content">
          {post.content.split("\n").map((paragraph, idx) =>
            paragraph.trim() ? <p key={idx}>{paragraph.trim()}</p> : null
          )}
        </div>
      </div>
      <Footer />

      <style>{`
        .blog-post-container {
          max-width: 760px;
        }
        .blog-back-link {
          display: inline-block;
          margin-bottom: 16px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666;
        }
        .blog-post-date {
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #777;
        }
        .blog-post-title {
          font-size: 36px;
          margin: 12px 0;
          font-weight: 700;
          color: #111;
        }
        .blog-post-excerpt {
          font-size: 16px;
          color: #444;
          margin-bottom: 24px;
        }
        .blog-post-content p {
          font-size: 16px;
          line-height: 1.8;
          color: #222;
        }
      `}</style>
    </>
  );
};

export default BlogPost;

