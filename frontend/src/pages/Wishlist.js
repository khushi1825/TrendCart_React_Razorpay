// src/pages/Wishlist.js
import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist } = useAppContext();

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Your wishlist is empty</h2>
        <p>Add items you love!</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ margin: '2rem 0' }}>Your Wishlist</h1>
      <div className="products-grid">
        {wishlist.map(product => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;