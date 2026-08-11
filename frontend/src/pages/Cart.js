import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formatINR } from '../utils/currency';

const Cart = () => {
  const {
  cart,
  removeFromCart,
  updateQuantity,
  placeOrder
} = useAppContext();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Your cart is empty</h2>
        <p>Add some stylish outfits!</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ margin: '2rem 0' }}>Shopping Cart</h1>
      <ul className="cart-items" style={{ listStyle: 'none', padding: 0 }}>
        {cart.map(item => (
          <li key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', marginBottom: '1rem', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <img
  src={
    item.images?.[0] ||
    'https://via.placeholder.com/80x100?text=No+Image'
  }
  alt={item.name}
  style={{
    width: '80px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px'
  }}
/>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>{item.name}</h3>
              <p style={{ color: '#e91e63', fontWeight: 'bold' }}>{formatINR(item.price)}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="btn btn-sm">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="btn btn-sm">+</button>
                <button onClick={() => removeFromCart(item._id)} className="btn btn-outline btn-sm">Remove</button>
              </div>
            </div>
            <div style={{ fontWeight: 'bold' }}>{formatINR(item.price * item.quantity)}</div>
          </li>
        ))}
      </ul>
      <h3>Total: {formatINR(total)}</h3>
      <button
        className="btn btn-primary"
        style={{ marginTop: '1rem' }}
        onClick={placeOrder}
>
  Pay Now
</button>
    </div>
  );
};

export default Cart;