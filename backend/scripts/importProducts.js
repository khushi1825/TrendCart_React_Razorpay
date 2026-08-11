const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

const products = [
  {
    name: 'Floral Summer Dress',
    price: 49.99,
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=400&fit=crop',
    category: 'dress'
  },

  {
    name: 'Elegant Blazer',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop',
    category: 'jacket'
  },

  {
    name: 'Casual Denim Jeans',
    price: 59.99,
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop',
    category: 'jeans'
  },

  {
    name: 'Silk Evening Gown',
    price: 129.99,
    image:
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop',
    category: 'dress'
  },

  {
    name: 'Leather Handbag',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop',
    category: 'accessory'
  }
];

const dressImages = [
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop'
];

const topImages = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1434389676691-211dd2d1ef1d?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=300&h=400&fit=crop'
];

const skirtImages = [
  'https://images.unsplash.com/photo-1551803091-e20673f15770?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop'
];

for (let i = 7; i <= 26; i++) {
  products.push({
    name: `Stylish Dress ${i}`,
    price: 999 + i * 50,
    image: dressImages[i % dressImages.length],
    category: 'dress'
  });
}

for (let i = 27; i <= 41; i++) {
  products.push({
    name: `Fashion Top ${i}`,
    price: 699 + i * 30,
    image: topImages[i % topImages.length],
    category: 'top'
  });
}

for (let i = 42; i <= 56; i++) {
  products.push({
    name: `Trendy Skirt ${i}`,
    price: 799 + i * 40,
    image: skirtImages[i % skirtImages.length],
    category: 'skirt'
  });
}

const importProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ MongoDB connected');

    // Prevent duplicate products if script is accidentally run again
    await Product.deleteMany({});

    const formattedProducts = products.map((product, index) => ({
      name: product.name,

      slug: `${product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}-${index + 1}`,

      sku: `TC-${String(index + 1).padStart(4, '0')}`,

      description: `Beautiful ${product.category} from TrendCart.`,

      brand: 'TrendCart',

      category: product.category,

      subcategory: '',

      price: product.price,

      compareAtPrice: null,

      images: [product.image],

      stock: 50,

      sizes: ['S', 'M', 'L', 'XL'],

      colors: ['Default'],

      isActive: true
    }));

    const insertedProducts = await Product.insertMany(
      formattedProducts
    );

    console.log(
      `✅ ${insertedProducts.length} products inserted successfully`
    );

    await mongoose.connection.close();

    console.log('✅ Database connection closed');

  } catch (error) {

    console.error('❌ Product import failed:', error);

    process.exit(1);
  }
};

importProducts();