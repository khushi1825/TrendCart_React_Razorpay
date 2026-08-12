
import React from 'react';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const {
    addToCart,
    addToWishlist,
    wishlist,
    friends,
    addVotingPost
  } = useAppContext();

  const isWishlisted = wishlist.some(
    item => item._id === product._id
  );

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  // =====================================================
  // ADD PRODUCT FOR VOTING
  // =====================================================

  const handleAddForVote = async () => {

      console.log("========== VOTE DEBUG ==========");
  console.log("PRODUCT RECEIVED BY PRODUCT CARD:", product);
  console.log("PRODUCT ID:", product._id);
  console.log("PRODUCT NAME:", product.name);
  console.log("PRODUCT IMAGE:", product.images?.[0]);
  console.log("================================");
    // ============================================
    // 1. CHECK FRIENDS
    // ============================================

    if (!friends || friends.length === 0) {
      alert(
        '❌ No friends added. Go to Friends page first!'
      );
      return;
    }

    // ============================================
    // 2. PREPARE WHATSAPP MESSAGE
    // ============================================

    const votingLink =
      `${window.location.origin}/vote`;

    const messageTemplate = (friendName) => {
      return `👗 Hi ${friendName}!

${product.name} has been added for voting on TrendCart!

💰 Price: ${formatPrice(product.price)}

🔗 Vote here: ${votingLink}

Vote options:

👍 Like
👎 Dislike
🌟 Excellent

- TrendCart 🌸`;
    };

    // ============================================
    // 3. OPEN WHATSAPP WINDOWS IMMEDIATELY
    // ============================================
    //
    // IMPORTANT:
    // window.open() is called directly from the
    // user's button click so Chrome is less likely
    // to block it.
    //

    const whatsappWindows = [];

    friends.forEach((friend) => {

      // Friend has no mobile number
      if (!friend.mobile) {
        console.warn(
          `No mobile number found for ${friend.name}`
        );
        return;
      }

      // Remove spaces, +, -, brackets etc.
      let number = String(friend.mobile).replace(
        /\D/g,
        ''
      );

      // Add India country code
      // if user entered a 10-digit number.
      if (number.length === 10) {
        number = '91' + number;
      }

      const message =
        messageTemplate(friend.name);

      // IMPORTANT:
      // Correct WhatsApp URL
      const whatsappUrl =
        `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

      // ==========================================
      // OPEN BLANK TAB IMMEDIATELY
      // ==========================================

      const newWindow = window.open(
        'about:blank',
        '_blank'
      );

      if (newWindow) {

        whatsappWindows.push({
          window: newWindow,
          url: whatsappUrl,
          friendName: friend.name
        });

      } else {

        console.warn(
          `Popup blocked for ${friend.name}`
        );

      }
    });

    // ============================================
    // 4. CREATE VOTING POST IN BACKEND
    // ============================================

    const result =
      await addVotingPost(product);

    // ============================================
    // 5. BACKEND FAILED
    // ============================================

    if (!result) {

      // Close blank tabs if voting post
      // could not be created.
      whatsappWindows.forEach((item) => {

        try {
          item.window.close();
        } catch (error) {
          console.error(error);
        }

      });

      return;
    }

    // ============================================
    // 6. BACKEND SUCCESS
    // ============================================

    whatsappWindows.forEach((item) => {

      try {

        item.window.location.href =
          item.url;

      } catch (error) {

        console.error(
          `Could not open WhatsApp for ${item.friendName}`,
          error
        );

      }

    });

    // ============================================
    // 7. SUCCESS MESSAGE
    // ============================================

    alert(
      "👗 Dress added successfully! ✨"
    );
  };

  // =====================================================
  // BUTTON STYLES
  // =====================================================

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

  // =====================================================
  // UI
  // =====================================================

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

            e.currentTarget.style.color =
              '#fff';
          }}

          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              '#f5f5f5';

            e.currentTarget.style.color =
              '#333';
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

