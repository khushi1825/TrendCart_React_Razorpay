import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';

import { useAuth } from './AuthContext';

const AppContext = createContext();

const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [friends, setFriends] = useState([]);
  const [votingPosts, setVotingPosts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  // =====================================================
  // HELPER
  // =====================================================

  const getToken = () => {
    return localStorage.getItem('token');
  };

  // =====================================================
  // PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError('');

      const response = await fetch(
        `${API_URL}/api/products`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch products: ${response.status}`
        );
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error(
        'Fetch products error:',
        error
      );

      setProductsError(
        error.message ||
          'Failed to fetch products'
      );
    } finally {
      setProductsLoading(false);
    }
  };

  // =====================================================
  // CART
  // =====================================================

  const formatCart = (items) => {
    return items.map(item => ({
      _id: item.productId,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      images: item.image
        ? [item.image]
        : []
    }));
  };

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/cart/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to fetch cart'
        );
      }

      setCart(formatCart(data));
    } catch (error) {
      console.error(
        'Fetch cart error:',
        error
      );
    }
  };

  const addToCart = async (product) => {
  if (!user) {
    alert('Please login first.');
    return;
  }

  try {
    const token = localStorage.getItem('token');

    const url = `${API_URL}/api/cart/${user.id}`;

    console.log('ADD TO CART URL:', url);
    console.log('TOKEN:', token);

    const response = await fetch(url, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        productId: product._id,
        name: product.name,
        price: product.price,
        image:
          product.images?.[0] ||
          product.image ||
          '',
        quantity: 1
      })
    });

    // IMPORTANT DEBUG
    const text = await response.text();

    console.log(
      'ADD TO CART STATUS:',
      response.status
    );

    console.log(
      'ADD TO CART RESPONSE:',
      text
    );

    if (!response.ok) {
      throw new Error(
        `Server error ${response.status}: ${text}`
      );
    }

    const data = JSON.parse(text);

    const formattedCart = data.map(item => ({
      _id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      images: item.image
        ? [item.image]
        : []
    }));

    setCart(formattedCart);

  } catch (error) {
    console.error(
      'Add to cart error:',
      error
    );

    alert(error.message);
  }
};

  const removeFromCart = async productId => {
    if (!user) {
      return;
    }

    try {
      const token = getToken();

      // IMPORTANT:
      // use productId here, NOT id
      const response = await fetch(
        `${API_URL}/api/cart/${user.id}/${productId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to remove item'
        );
      }

      setCart(formatCart(data));

    } catch (error) {
      console.error(
        'Remove cart error:',
        error
      );

      alert(
        error.message ||
          'Failed to remove item'
      );
    }
  };

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    if (!user) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/cart/${user.id}/${productId}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            quantity
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to update quantity'
        );
      }

      setCart(formatCart(data));

    } catch (error) {
      console.error(
        'Update quantity error:',
        error
      );

      alert(
        error.message ||
          'Failed to update quantity'
      );
    }
  };

  // =====================================================
  // WISHLIST
  // =====================================================

  const formatWishlist = items => {
    return items.map(item => ({
      _id: item.productId,
      name: item.name,
      price: Number(item.price),
      images: item.images || [],
      category: item.category || ''
    }));
  };

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/wishlist/${user.id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to fetch wishlist'
        );
      }

      setWishlist(
        formatWishlist(data)
      );

    } catch (error) {
      console.error(
        'Fetch wishlist error:',
        error
      );
    }
  };

  const addToWishlist = async (product) => {
  if (!user) {
    alert('Please login first.');
    return;
  }

  try {
    const token = localStorage.getItem('token');

    const url =
      `${API_URL}/api/wishlist/${user.id}`;

    console.log(
      'ADD WISHLIST URL:',
      url
    );

    const response = await fetch(url, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        productId: product._id,
        name: product.name,
        price: product.price,

        images:
          product.images ||
          (product.image
            ? [product.image]
            : []),

        category:
          product.category || ''
      })
    });

    const text = await response.text();

    console.log(
      'ADD WISHLIST STATUS:',
      response.status
    );

    console.log(
      'ADD WISHLIST RESPONSE:',
      text
    );

    if (!response.ok) {
      throw new Error(
        `Server error ${response.status}: ${text}`
      );
    }

    const data = JSON.parse(text);

    const formattedWishlist =
      data.map(item => ({
        _id: item.productId,
        name: item.name,
        price: item.price,
        images: item.images || [],
        category:
          item.category || ''
      }));

    setWishlist(formattedWishlist);

  } catch (error) {
    console.error(
      'Add wishlist error:',
      error
    );

    alert(error.message);
  }
};

  const removeFromWishlist = async productId => {
    if (!user) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/wishlist/${user.id}/${productId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to remove from wishlist'
        );
      }

      setWishlist(
        formatWishlist(data)
      );

    } catch (error) {
      console.error(
        'Remove wishlist error:',
        error
      );

      alert(
        error.message ||
          'Failed to remove from wishlist'
      );
    }
  };

  // =====================================================
  // FRIENDS
  // =====================================================

  const fetchFriends = async () => {
    if (!user) {
      setFriends([]);
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/friends`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to fetch friends'
        );
      }

      const formattedFriends =
        data.map(friend => ({
          id: friend.friendId,
          name: friend.name,
          email: friend.email,
          mobile: friend.mobile
        }));

      setFriends(formattedFriends);

    } catch (error) {
      console.error(
        'Fetch friends error:',
        error
      );
    }
  };

  const addFriend = async (
    name,
    email,
    mobile
  ) => {
    if (!user) {
      alert('Please login first.');
      return null;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/friends`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            email,
            mobile
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to add friend'
        );
      }

      const newFriend = {
        id: data.friendId,
        name: data.name,
        email: data.email,
        mobile: data.mobile
      };

      setFriends(prev => {
        const exists = prev.some(
          friend =>
            String(friend.id) ===
            String(newFriend.id)
        );

        if (exists) {
          return prev;
        }

        return [
          newFriend,
          ...prev
        ];
      });

      return newFriend;

    } catch (error) {
      console.error(
        'Add friend error:',
        error
      );

      alert(
        error.message ||
          'Failed to add friend'
      );

      return null;
    }
  };

  const removeFriend = async id => {
    if (!user) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/friends/${id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to remove friend'
        );
      }

      setFriends(prev =>
        prev.filter(
          friend =>
            String(friend.id) !==
            String(id)
        )
      );

    } catch (error) {
      console.error(
        'Remove friend error:',
        error
      );

      alert(
        error.message ||
          'Failed to remove friend'
      );
    }
  };

  // =====================================================
  // VOTING
  // =====================================================

  const fetchVotingPosts = async () => {
    if (!user) {
      setVotingPosts([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/voting/user/${user.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to fetch voting posts'
        );
      }

      setVotingPosts(data);

    } catch (error) {
      console.error(
        'Fetch voting posts error:',
        error
      );
    }
  };

  const fetchPendingVotingPosts = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/voting/pending/${user.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to fetch pending votes'
        );
      }

      setVotingPosts(prev => {
        const existingIds = new Set(
          prev.map(post => post._id)
        );

        const newPosts = data.filter(
          post =>
            !existingIds.has(post._id)
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

  const addVotingPost = async product => {
    if (!user) {
      alert('Please login first.');
      return null;
    }

    if (friends.length === 0) {
      alert(
        'Please add friends first.'
      );
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/voting`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            productId:
              product._id,

            productName:
              product.name,

            productImage:
              product.images?.[0] ||
              product.image ||
              '',

            productPrice:
              product.price,

            addedBy:
              user.id,

            friends:
              friends.map(friend => ({
                friendId:
                  friend.id,

                friendName:
                  friend.name
              }))
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to create voting post'
        );
      }

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

  const removeVotingPost = async postId => {
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
          data.error ||
            'Failed to delete voting post'
        );
      }

      setVotingPosts(prev =>
        prev.filter(
          post =>
            String(post._id) !==
            String(postId)
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
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            friendId,
            friendName,
            vote: voteValue
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to submit vote'
        );
      }

      setVotingPosts(prev =>
        prev.map(post =>
          String(post._id) ===
          String(data.post._id)
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

      return null;
    }
  };

  const getFriendVoteStatus = (
    postId,
    friendId
  ) => {
    const post =
      votingPosts.find(
        p =>
          String(p._id) ===
          String(postId)
      );

    if (!post) {
      return null;
    }

    const vote =
      post.votes?.find(
        v =>
          String(v.friendId) ===
          String(friendId)
      );

    return vote?.vote || null;
  };

  const getPendingVotesForFriend =
    friendId => {
      return votingPosts.filter(
        post => {
          const isRecipient =
            post.friends?.some(
              friend =>
                String(
                  friend.friendId
                ) ===
                String(friendId)
            );

          const alreadyVoted =
            post.votes?.some(
              vote =>
                String(
                  vote.friendId
                ) ===
                String(friendId)
            );

          return (
            isRecipient &&
            !alreadyVoted
          );
        }
      );
    };

  const getVoteCounts = postId => {
    const post =
      votingPosts.find(
        p =>
          String(p._id) ===
          String(postId)
      );

    const counts = {
      like: 0,
      dislike: 0,
      excellent: 0
    };

    if (!post) {
      return counts;
    }

    (post.votes || []).forEach(
      vote => {
        if (
          vote.vote === 'like'
        ) {
          counts.like++;
        }

        if (
          vote.vote === 'dislike'
        ) {
          counts.dislike++;
        }

        if (
          vote.vote === 'excellent'
        ) {
          counts.excellent++;
        }
      }
    );

    return counts;
  };

  // =====================================================
  // ORDERS
  // =====================================================

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to fetch orders'
        );
      }

      setOrders(
        data.orders || []
      );

    } catch (error) {
      console.error(
        'Fetch orders error:',
        error
      );
    }
  };

  // =====================================================
  // RAZORPAY
  // =====================================================

  const placeOrder = async () => {
    if (!user) {
      alert(
        'Please login before placing an order.'
      );
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert('Please login again.');
        return;
      }

      // -----------------------------------------------
      // CREATE BACKEND ORDER
      // -----------------------------------------------

      const response = await fetch(
        `${API_URL}/api/orders/create`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            items: cart
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to create payment order'
        );
      }

      // -----------------------------------------------
      // RAZORPAY OPTIONS
      // -----------------------------------------------

      const options = {
        key: data.key,

        amount: data.amount,

        currency:
          data.currency,

        name: 'TrendCart',

        description:
          'Women Fashion Order',

        order_id:
          data.razorpayOrderId,

        handler:
          async paymentResponse => {
            try {
              const verifyResponse =
                await fetch(
                  `${API_URL}/api/orders/verify`,
                  {
                    method: 'POST',

                    headers: {
                      'Content-Type':
                        'application/json',

                      Authorization:
                        `Bearer ${token}`
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

              setOrders(prev => [
                verifyData.order,
                ...prev
              ]);

              // Clear frontend cart
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
          name:
            user.name || '',

          email:
            user.email || ''
        },

        theme: {
          color: '#25671E'
        }
      };

      if (!window.Razorpay) {
        alert(
          'Razorpay failed to load. Please refresh the page.'
        );
        return;
      }

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        'payment.failed',
        response => {
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

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!user) {
      setCart([]);
      setWishlist([]);
      setFriends([]);
      setVotingPosts([]);
      setOrders([]);
      return;
    }

    fetchCart();
    fetchWishlist();
    fetchFriends();
    fetchOrders();
    fetchVotingPosts();
    fetchPendingVotingPosts();

  }, [user]);

  // =====================================================
  // PROVIDER
  // =====================================================

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

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useAppContext = () =>
  useContext(AppContext);