import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';

//import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const AppContext = createContext();

const API_URL = process.env.REACT_APP_API_URL;

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
// FETCH VOTING POSTS FROM BACKEND
// ==============================

const fetchVotingPosts = async () => {
  if (!user) return;

  try {
    const response = await fetch(
      `${API_URL}/api/voting/user/${user.id}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to fetch voting posts'
      );
    }

    console.log('Voting posts received:', data);

    setVotingPosts(data);

  } catch (error) {
    console.error(
      'Fetch voting posts error:',
      error
    );
  }
};


const fetchPendingVotingPosts = async () => {
  if (!user) return;

  try {
    const response = await fetch(
      `${API_URL}/api/voting/pending/${user.id}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to fetch pending voting posts'
      );
    }

    console.log(
      'Pending voting posts:',
      data
    );

    setVotingPosts(prev => {
      const existingIds = new Set(
        prev.map(post => post._id)
      );

      const newPosts = data.filter(
        post => !existingIds.has(post._id)
      );

      return [
        ...prev,
        ...newPosts
      ];
    });

  } catch (error) {
    console.error(
      'Fetch pending voting posts error:',
      error
    );
  }
};

useEffect(() => {
  if (user) {
    fetchVotingPosts();
    fetchPendingVotingPosts();
  } else {
    setVotingPosts([]);
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


  const addFriend = async (name, email, mobile) => {
  try {
    const response = await fetch(
      `${API_URL}/api/user-by-email/${encodeURIComponent(email)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Friend account not found'
      );
    }

    const newFriend = {
  id: data.id,
  name: data.name,
  email: data.email,
  mobile: mobile
};

console.log('FRIEND ADDED:', newFriend);

    setFriends(prev => {
      // Prevent duplicate friend
      if (prev.some(friend => friend.id === data.id)) {
        alert('Friend already added.');
        return prev;
      }

      return [
        ...prev,
        newFriend
      ];
    });

  } catch (error) {
    console.error('Add friend error:', error);

    alert(
      error.message ||
      'Failed to add friend'
    );
  }
};

  const removeFriend = (id) => {
    setFriends(prev =>
      prev.filter(friend => friend.id !== id)
    );
  };

  // =====================================================
  // VOTING FUNCTIONS
  // =====================================================

  const addVotingPost = async (product) => {
  if (!user) {
    alert('Please login first.');
    return null;
  }

  if (friends.length === 0) {
    alert('Please add friends first.');
    return null;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/voting`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product._id,
          productName: product.name,
          productImage: product.images?.[0] || '',
          productPrice: product.price,
          addedBy: user.id,

          friends: friends.map(friend => ({
            friendId: friend.id,
            friendName: friend.name
          }))
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to create voting post'
      );
    }

    console.log('Voting post created:', data);

    // Add backend post to frontend state
    setVotingPosts(prev => [
      data,
      ...prev
    ]);

    return data;

  } catch (error) {
    console.error(
      'Add voting post error:',
      error
    );

    alert(
      error.message ||
      'Failed to add dress for voting'
    );

    return null;
  }
};

  const removeVotingPost = async (postId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/voting/${postId}`,
      {
        method: 'DELETE'
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to delete voting post'
      );
    }

    setVotingPosts(prev =>
      prev.filter(
        post => post._id !== postId
      )
    );

  } catch (error) {
    console.error(
      'Remove voting post error:',
      error
    );

    alert(
      error.message ||
      'Failed to remove dress'
    );
  }
};

  const voteOnPost = async (
  postId,
  friendId,
  voteValue,
  friendName
) => {
  try {
    const response = await fetch(
      `${API_URL}/api/voting/${postId}/vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          friendId,
          friendName,
          vote: voteValue
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to submit vote'
      );
    }

    console.log('Vote saved:', data);

    // Update frontend state
    setVotingPosts(prev =>
      prev.map(post =>
        post._id === data.post._id
          ? data.post
          : post
      )
    );

    return data;

  } catch (error) {
    console.error(
      'Vote error:',
      error
    );

    alert(
      error.message ||
      'Failed to submit vote'
    );
  }
};

  const getFriendVoteStatus = (
  postId,
  friendId
) => {
  const post = votingPosts.find(
    p => p._id === postId
  );

  if (!post) {
    return null;
  }

  const vote = post.votes?.find(
  v => String(v.friendId) === String(friendId)
);

  return vote?.vote || null;
};

  const getPendingVotesForFriend = (friendId) => {

    return votingPosts.filter(post => {

      // Is this user actually invited to vote?
      const isRecipient = post.friends?.some(
        friend => String(friend.friendId) === String(friendId)
      );

      // Has this user already voted?
      const alreadyVoted = post.votes?.some(
        vote => String(vote.friendId) === String(friendId)
      );

      return isRecipient && !alreadyVoted;
    });

  };

  const getVoteCounts = (postId) => {
  const post = votingPosts.find(
    p => p._id === postId
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

  // Backend votes is an ARRAY
  (post.votes || []).forEach(vote => {
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