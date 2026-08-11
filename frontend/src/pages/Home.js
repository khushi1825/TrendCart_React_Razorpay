import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const { products } = useAppContext();
  const featuredProducts = products.slice(0, 4); // Show first 4 dresses

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&h=800&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '85vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}></div>
        <div style={{ position: 'relative', color: '#fff', padding: '2rem', maxWidth: '600px', marginLeft: '10%' }}>
          <p style={{ letterSpacing: '2px', fontSize: '0.9rem' }}>SUMMER'25 EDIT</p>
          <h1 style={{ fontSize: '4rem', margin: '0.5rem 0', fontWeight: '300' }}>Effortless elegance</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.5' }}>
            Discover timeless silhouettes, natural fabrics, and the quiet luxury of women's clothing designed to move with you.
          </p>
          <Link to="/shop" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem', backgroundColor: '#fff', color: '#e91e63' }}>Shop now →</Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Featured Collection</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/shop" className="btn btn-primary">View All →</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;