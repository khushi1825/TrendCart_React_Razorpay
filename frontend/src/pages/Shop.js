import React from 'react';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

const Shop = () => {
  const {
    products,
    productsLoading,
    productsError,
    searchTerm
  } = useAppContext();

  if (productsLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1 style={{ margin: '2rem 0 1rem' }}>
          Shop New Arrivals
        </h1>

        <p>Loading products...</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1 style={{ margin: '2rem 0 1rem' }}>
          Shop New Arrivals
        </h1>

        <p>
          Failed to load products: {productsError}
        </p>
      </div>
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes((searchTerm || '').toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>

      <h1 style={{ margin: '2rem 0 1rem' }}>
        Shop New Arrivals
      </h1>

      {filteredProducts.length === 0 ? (
        <p>No products match your search.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '2rem'
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Shop;