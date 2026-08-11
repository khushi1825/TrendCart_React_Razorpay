import React from 'react';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const {
    addToCart,
    addToWishlist,
    wishlist,
    addVotingPost
  } = useAppContext();

  const isWishlisted = wishlist.some(
    item => item._id === product._id
  );

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  const handleAddForVote = () => {

    // Add product to voting posts
    addVotingPost(product);

    // Get current user
    const currentUser = JSON.parse(
      localStorage.getItem('trendcart_current_user')
    );

    // Get friends
    const friendsList = JSON.parse(
      localStorage.getItem(
        `trendcart_friends_${currentUser?.id}`
      ) || '[]'
    );

    console.log(
      'Friends list from localStorage:',
      friendsList
    );

    if (friendsList.length === 0) {
      alert(
        '❌ No friends added. Go to Friends page first!'
      );
      return;
    }

    const votingLink =
      `${window.location.origin}/vote`;

    const messageTemplate = (friendName) => {
      return `👗 Hi ${friendName}!

${product.name} has been added for voting on TrendCart!

💰 Price: ${formatPrice(product.price)}

🔗 Vote here: ${votingLink}

Vote options: 👍 Like | 👎 Dislike | 🌟 Excellent

- TrendCart 🌸`;
    };

    let openedCount = 0;

    friendsList.forEach(friend => {

      let number = friend.mobile.replace(
        /\D/g,
        ''
      );

      if (number.length === 10) {
        number = '91' + number;
      }

      const message =
        messageTemplate(friend.name);

      const whatsappUrl =
        `https://wa.me/${number}?text=${encodeURIComponent(
          message
        )}`;

      window.open(
        whatsappUrl,
        '_blank'
      );

      openedCount++;
    });

    alert(
      `📢 "${product.name}" added for voting!\n\n` +
      `📱 WhatsApp opened for ${openedCount} friend(s).\n\n` +
      `👉 Click "Send" on each WhatsApp tab!`
    );
  };

  const btnPrimaryStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: 'none'
  };

  const btnOutlineStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#333',
    border: '1px solid #ddd'
  };

  return (
    <div
      style={{
        border: '1px solid #eee',
        borderRadius: '12px',
        padding: '1rem',
        backgroundColor: '#fff'
      }}
    >

      {/* Product Image */}
      <img
        src={
          product.images?.[0] ||
          'https://via.placeholder.com/300x400?text=No+Image'
        }
        alt={product.name}
        style={{
          width: '100%',
          height: '300px',
          objectFit: 'cover',
          borderRadius: '10px'
        }}
      />

      {/* Product Information */}
      <div style={{ paddingTop: '1rem' }}>

        <h3>
          {product.name}
        </h3>

        <p>
          {formatPrice(product.price)}
        </p>

        <p
          style={{
            color: '#777',
            fontSize: '0.9rem'
          }}
        >
          {product.category}
        </p>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          style={btnPrimaryStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              '#e91e63';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              '#f5f5f5';
            e.currentTarget.style.color = '#333';
          }}
        >
          Add to Cart
        </button>

        {/* Wishlist */}
        <button
          onClick={() => addToWishlist(product)}
          style={btnOutlineStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor =
              '#e91e63';
            e.currentTarget.style.color =
              '#e91e63';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor =
              '#ddd';
            e.currentTarget.style.color =
              '#333';
          }}
        >
          {isWishlisted
            ? '❤️ Added'
            : '🤍 Wishlist'}
        </button>

        {/* Voting */}
        <button
          onClick={handleAddForVote}
          style={btnOutlineStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor =
              '#e91e63';
            e.currentTarget.style.color =
              '#e91e63';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor =
              '#ddd';
            e.currentTarget.style.color =
              '#333';
          }}
        >
          🗳️ Add for Vote
        </button>

      </div>
    </div>
  );
};

export default ProductCard;