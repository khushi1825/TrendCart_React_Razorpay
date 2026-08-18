# 🛍️ TrendCart – Smart Social Shopping Platform

**TrendCart** is a full-stack MERN e-commerce platform designed to make online shopping more interactive and decision-friendly.

Unlike traditional e-commerce applications, TrendCart introduces a unique **Vote-Before-You-Buy** feature that allows users to share products with friends and collect their opinions before making a purchase.

🌐 **Live Demo:** [TrendCart](https://trend-cart-react-razorpay-3x3v.vercel.app/)

---

## ✨ About TrendCart

TrendCart provides a complete online shopping experience with:

- Product browsing and search
- Wishlist management
- Shopping cart
- User authentication and authorization
- Friend management
- Social product voting
- WhatsApp sharing
- Online payment using Razorpay
- Order management
- Responsive user interface

The main idea behind TrendCart is to combine **e-commerce with social decision-making**, allowing users to get feedback from their friends before purchasing an outfit.

---

# 🚀 Key Features

## 👤 Authentication & Authorization

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected backend APIs
- User-specific data access
- Session persistence using authentication tokens

---

## 🛍️ Product Management

- Browse available products
- Search products
- View product details
- Products are stored in MongoDB
- Product data is retrieved through REST APIs

---

## 🛒 Shopping Cart

- Add products to cart
- Increase/decrease product quantity
- Remove products
- User-specific cart storage
- Cart data persists in MongoDB

If the same product is added multiple times, the existing cart item's **quantity is updated instead of creating duplicate cart items**.

---

## ❤️ Wishlist

- Add products to wishlist
- Remove products from wishlist
- User-specific wishlist
- Wishlist data stored persistently in MongoDB

---

# 🗳️ Vote-Before-You-Buy

### 💡 The unique feature of TrendCart

Sometimes users like an outfit but aren't sure whether they should buy it.

TrendCart solves this problem by allowing users to ask their friends for opinions before purchasing.

### Workflow

1. User selects an outfit.
2. User adds the outfit to a voting post.
3. Selected friends are associated with the voting post.
4. The user shares the voting invitation through WhatsApp.
5. Friends open TrendCart and view the shared outfit.
6. Friends can vote using:
   - 👍 Like
   - 👎 Dislike
   - ⭐ Excellent
7. The product owner can view the collected votes.
8. The user can make a more informed purchasing decision.

This transforms TrendCart from a traditional shopping platform into a **social shopping experience**.

---

# 💬 WhatsApp Product Sharing

TrendCart allows users to share voting invitations through WhatsApp.

The generated message contains:

- Product information
- Voting invitation
- Link to the voting page

The user can directly open WhatsApp and send the invitation to their selected friend.

---

# 👥 Friend Management

Users can:

- Add friends using their registered email
- View their friends
- Remove friends
- Use their friends for product voting

Friend relationships are stored in MongoDB and associated with the authenticated user.

---

# 💳 Razorpay Payment Integration

TrendCart integrates **Razorpay** for online payments.

### Payment Flow

1. User adds products to the cart.
2. User proceeds to checkout.
3. Backend creates a Razorpay order.
4. Razorpay Checkout is opened on the frontend.
5. User completes the payment.
6. Payment details are sent back to the backend.
7. Backend verifies the payment.
8. The order is stored against the authenticated user.
9. The order can be retrieved from the user's order history.

This keeps important payment-related operations on the backend rather than trusting the frontend.

---

# 📦 Order Management

- Create orders after successful payment
- Store order information in MongoDB
- Associate orders with the authenticated user
- View previous orders
- Maintain product, quantity and pricing information for the order

---

# 🔐 Security

TrendCart implements several security practices:

- JWT-based authentication
- Protected REST APIs
- bcrypt password hashing
- Backend authorization checks
- User-specific database queries
- Server-side payment verification
- Environment variables for sensitive configuration

The backend does not rely only on frontend checks when accessing user-specific resources.

---

# 🧠 Application Architecture

TrendCart follows a **client-server architecture**.

```text
                ┌──────────────────────┐
                │      React Frontend  │
                │                      │
                │  Components / Pages  │
                │  Context API         │
                └──────────┬───────────┘
                           │
                           │ REST API
                           ▼
                ┌──────────────────────┐
                │   Express Backend    │
                │                      │
                │ Routes / Middleware  │
                │ Controllers / Logic │
                └──────────┬───────────┘
                           │
                           │ Mongoose
                           ▼
                ┌──────────────────────┐
                │       MongoDB        │
                │                      │
                │ Users                │
                │ Products             │
                │ Cart                 │
                │ Wishlist             │
                │ Orders               │
                │ Friends              │
                │ Voting Posts         │
                └──────────────────────┘
