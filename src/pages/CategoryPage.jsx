import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Footer, Navbar } from '../components';
import SEO from '../components/SEO';
import Product from '../components/Products';
import { categoryConfigs } from '../data/categoryConfigs';

const CategoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get category slug from URL path
  const categorySlug = location.pathname.replace('/', '');
  
  // Get category config
  const config = categoryConfigs[categorySlug];
  
  // If category not found, redirect to 404
  React.useEffect(() => {
    if (!config) {
      navigate('/404', { replace: true });
    }
  }, [config, navigate]);
  
  if (!config) {
    return null;
  }

  return (
    <>
      <SEO
        title={config.title}
        description={config.description}
        keywords={config.keywords}
        url={`https://zairi.in/${categorySlug}`}
      />
      <Navbar />
      
      <div className="container my-5">
        {/* SEO Content Section */}
        <div 
          className="seo-content-section" 
          style={{ 
            marginBottom: '40px', 
            padding: '30px', 
            background: '#f8f9fa', 
            borderRadius: '8px' 
          }}
        >
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '20px', color: '#000' }}>
            {config.h1}
          </h1>
          
          <div 
            style={{ 
              fontSize: '16px', 
              lineHeight: '1.8', 
              color: '#333' 
            }}
            dangerouslySetInnerHTML={{ __html: config.content }}
          />
        </div>

        {/* FAQ Section */}
        {config.faqs && config.faqs.length > 0 && (
          <div 
            className="faq-section" 
            style={{ 
              marginTop: '40px', 
              padding: '30px', 
              background: '#fff', 
              borderRadius: '8px', 
              border: '1px solid #e0e0e0' 
            }}
          >
            <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '25px' }}>
              Frequently Asked Questions
            </h2>
            
            {config.faqs.map((faq, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                  {faq.q}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Products Section - Uses existing Product component */}
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '30px', textAlign: 'center' }}>
            Shop Our {config.h1.split('–')[0].trim()} Collection
          </h2>
          {/* Existing Product component - no changes to logic */}
          <Product />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CategoryPage;

