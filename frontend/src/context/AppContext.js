import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';

import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const AppContext = createContext();

const API_URL = 'http://localhost:5000';

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  // ==============================
  // PRODUCTS
  // ==============================

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  // ==============================
  // OTHER APPLICATION STATE
  // ==============================

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [friends, setFriends] = useState([]);
  const [votingPosts, setVotingPosts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  // ==============================
  // FETCH PRODUCTS FROM BACKEND
  // ==============================

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError('');

      console.log('Fetching products...');

      const response = await fetch('/api/products');

      console.log('Products response:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log('Products received:', data);

      setProducts(data);
    } catch (error) {
      console.error('FETCH PRODUCTS ERROR:', error);

      setProductsError(
        error.message || 'Failed to fetch products'
      );
    } finally {
      setProductsLoading(false);
    }
  };

  fetchProducts();
}, []);
  // ==============================
  // LOAD USER-SPECIFIC DATA
  // ==============================

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(
        `trendcart_cart_${user.id}`
      );

      setCart(
        savedCart ? JSON.parse(savedCart) : []
      );

      const savedWishlist = localStorage.getItem(
        `trendcart_wishlist_${user.id}`
      );

      setWishlist(
        savedWishlist ? JSON.parse(savedWishlist) : []
      );

      const savedFriends = localStorage.getItem(
        `trendcart_friends_${user.id}`
      );

      setFriends(
        savedFriends ? JSON.parse(savedFriends) : []
      );

      const savedPosts = localStorage.getItem(
        `trendcart_votingPosts_${user.id}`
      );

      setVotingPosts(
        savedPosts ? JSON.parse(savedPosts) : []
      );

      const savedOrders = localStorage.getItem(
        `trendcart_orders_${user.id}`
      );

      setOrders(
        savedOrders ? JSON.parse(savedOrders) : []
      );
    } else {
      setCart([]);
      setWishlist([]);
      setFriends([]);
      setVotingPosts([]);
      setOrders([]);
    }
  }, [user]);

  // ==============================
  // SAVE CART
  // ==============================

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `trendcart_cart_${user.id}`,
        JSON.stringify(cart)
      );
    }
  }, [cart, user]);

  // ==============================
  // SAVE WISHLIST
  // ==============================

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `trendcart_wishlist_${user.id}`,
        JSON.stringify(wishlist)
      );
    }
  }, [wishlist, user]);

  // ==============================
  // SAVE FRIENDS
  // ==============================

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `trendcart_friends_${user.id}`,
        JSON.stringify(friends)
      );
    }
  }, [friends, user]);

  // ==============================
  // SAVE VOTING POSTS
  // ==============================

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `trendcart_votingPosts_${user.id}`,
        JSON.stringify(votingPosts)
      );
    }
  }, [votingPosts, user]);

  // ==============================
  // SAVE ORDERS
  // ==============================

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `trendcart_orders_${user.id}`,
        JSON.stringify(orders)
      );
    }
  }, [orders, user]);

  // =====================================================
  // CART FUNCTIONS
  // =====================================================

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(
        item => item._id === product._id
      );

      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1
        }
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev =>
      prev.filter(item => item._id !== id)
    );
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item._id === id
          ? {
              ...item,
              quantity
            }
          : item
      )
    );
  };

  // =====================================================
  // WISHLIST FUNCTIONS
  // =====================================================

  const addToWishlist = (product) => {
    if (
      !wishlist.find(
        item => item._id === product._id
      )
    ) {
      setWishlist(prev => [
        ...prev,
        product
      ]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev =>
      prev.filter(item => item._id !== id)
    );
  };

  // =====================================================
  // FRIEND FUNCTIONS
  // =====================================================

  const addFriend = (name, mobile) => {
    const newFriend = {
      id: uuidv4(),
      name,
      mobile
    };

    setFriends(prev => [
      ...prev,
      newFriend
    ]);
  };

  const removeFriend = (id) => {
    setFriends(prev =>
      prev.filter(friend => friend.id !== id)
    );
  };

  // =====================================================
  // VOTING FUNCTIONS
  // =====================================================

  const addVotingPost = (product) => {
    const newPost = {
      id: uuidv4(),

      productId: product._id,

      productName: product.name,

      productImage: product.image,

      productPrice: product.price,

      addedBy: user?.id || 'unknown',

      timestamp: Date.now(),

      votes: {}
    };

    setVotingPosts(prev => [
      ...prev,
      newPost
    ]);

    return newPost;
  };

  const removeVotingPost = (postId) => {
    setVotingPosts(prev =>
      prev.filter(
        post => post.id !== postId
      )
    );
  };

  const voteOnPost = (
    postId,
    friendId,
    voteValue
  ) => {
    setVotingPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const updatedVotes = {
            ...post.votes
          };

          updatedVotes[friendId] = {
            vote: voteValue,
            votedAt: Date.now()
          };

          return {
            ...post,
            votes: updatedVotes
          };
        }

        return post;
      })
    );
  };

  const getFriendVoteStatus = (
    postId,
    friendId
  ) => {
    const post = votingPosts.find(
      p => p.id === postId
    );

    return (
      post?.votes?.[friendId]?.vote || null
    );
  };

  const getPendingVotesForFriend = (
    friendId
  ) => {
    return votingPosts.filter(
      post => !post.votes?.[friendId]
    );
  };

  const getVoteCounts = (postId) => {
    const post = votingPosts.find(
      p => p.id === postId
    );

    if (!post) {
      return {
        like: 0,
        dislike: 0,
        excellent: 0
      };
    }

    const counts = {
      like: 0,
      dislike: 0,
      excellent: 0
    };

    Object.values(post.votes || {}).forEach(vote => {
      if (vote.vote === 'like') {
        counts.like++;
      } else if (vote.vote === 'dislike') {
        counts.dislike++;
      } else if (vote.vote === 'excellent') {
        counts.excellent++;
      }
    });

    return counts;
  };

  // =====================================================
  // TEMPORARY ORDER FUNCTION
  // =====================================================
  // We will REMOVE this when we implement Razorpay.
  // =====================================================

  

  // =====================================================
// RAZORPAY PAYMENT
// =====================================================

const placeOrder = async () => {
  if (!user) {
    alert('Please login before placing an order.');
    return;
  }

  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  try {
    // ============================================
    // STEP 1: CREATE ORDER ON OUR BACKEND
    // ============================================

    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login again.');
      return;
    }

    const response = await fetch(
      `${API_URL}/api/orders/create`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },

        body: JSON.stringify({
          items: cart
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to create payment order'
      );
    }

    console.log(
      'Razorpay order created:',
      data
    );

    // ============================================
    // STEP 2: OPEN RAZORPAY CHECKOUT
    // ============================================

    const options = {
      key: data.key,

      amount: data.amount,

      currency: data.currency,

      name: 'TrendCart',

      description: 'Women Fashion Order',

      order_id: data.razorpayOrderId,

      handler: async function (paymentResponse) {

        console.log(
          'Razorpay payment response:',
          paymentResponse
        );

        // ========================================
        // STEP 3: VERIFY PAYMENT ON BACKEND
        // ========================================

        try {

          const verifyResponse = await fetch(
            `${API_URL}/api/orders/verify`,
            {
              method: 'POST',

              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },

              body: JSON.stringify({
                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature
              })
            }
          );

          const verifyData =
            await verifyResponse.json();

          if (!verifyResponse.ok) {
            throw new Error(
              verifyData.error ||
              'Payment verification failed'
            );
          }

          // ======================================
          // PAYMENT SUCCESS
          // ======================================

          console.log(
            'Payment verified:',
            verifyData
          );

          // Add verified order to React state
          setOrders(prev => [
            verifyData.order,
            ...prev
          ]);

          // Clear cart
          setCart([]);

          alert(
            '✅ Payment successful! Your order has been placed.'
          );

        } catch (error) {

          console.error(
            'Payment verification error:',
            error
          );

          alert(
            'Payment was completed, but verification failed. Please contact support.'
          );
        }
      },

      prefill: {
        name: user.name || '',
        email: user.email || ''
      },

      theme: {
        color: '#25671E'
      }
    };

    // ============================================
    // CHECK RAZORPAY IS LOADED
    // ============================================

    if (!window.Razorpay) {
      alert(
        'Razorpay failed to load. Please refresh the page.'
      );
      return;
    }

    // ============================================
    // OPEN CHECKOUT
    // ============================================

    const razorpay =
      new window.Razorpay(options);

    razorpay.on(
      'payment.failed',
      function (response) {

        console.error(
          'Payment failed:',
          response.error
        );

        alert(
          '❌ Payment failed. Please try again.'
        );
      }
    );

    razorpay.open();

  } catch (error) {

    console.error(
      'Place order error:',
      error
    );

    alert(
      error.message ||
      'Something went wrong while creating the payment.'
    );
  }
};

  return (
    <AppContext.Provider
      value={{
        // Products
        products,
        productsLoading,
        productsError,    

        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,

        // Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,

        // Friends
        friends,
        addFriend,
        removeFriend,

        // Voting
        votingPosts,
        addVotingPost,
        removeVotingPost,
        voteOnPost,
        getFriendVoteStatus,
        getPendingVotesForFriend,
        getVoteCounts,

        // Orders
        orders,
        placeOrder,

        // Search
        searchTerm,
        setSearchTerm
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () =>
  useContext(AppContext);