const mongoose = require('mongoose');
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eloska-admin')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const sampleProducts = [
  // Mirror Collection Products
  {
    name: "Premium Silver Round Mirror",
    description: "Exquisite silver mirror with intricate designs, perfect for sarees and traditional wear",
    price: 250,
    originalPrice: 350,
    collection: "Mirror Collection",
    category: "Regular Silver Mirrors",
    subcategory: "Round",
    images: ["https://picsum.photos/300x300/8B0000/FFFFFF?text=Silver+Mirror"],
    features: ["Premium Quality", "Handcrafted", "Traditional Design"],
    status: "active",
    featured: true,
    inStock: true,
    stockQuantity: 50,
    minimumQuantity: 1,
    tags: ["saree", "traditional", "premium"],
    createdBy: "admin"
  },
  {
    name: "Artistic Designer Mirror",
    description: "Beautiful artistic mirror with custom designs and fancy shapes",
    price: 180,
    originalPrice: 250,
    collection: "Mirror Collection",
    category: "Artistic Mirrors",
    subcategory: "Designer",
    images: ["https://picsum.photos/300x300/FF6B6B/FFFFFF?text=Artistic+Mirror"],
    features: ["Custom Design", "Artistic Pattern", "Unique Shape"],
    status: "active",
    featured: true,
    inStock: true,
    stockQuantity: 30,
    minimumQuantity: 1,
    tags: ["artistic", "designer", "custom"],
    createdBy: "admin"
  },
  {
    name: "Clear Acrylic Mirror",
    description: "High-quality clear acrylic mirror with modern design",
    price: 120,
    originalPrice: 180,
    collection: "Mirror Collection",
    category: "Acrylic Mirror",
    subcategory: "Clear",
    images: ["https://picsum.photos/300x300/4ECDC4/FFFFFF?text=Acrylic+Mirror"],
    features: ["Clear Finish", "Modern Design", "Durable"],
    status: "active",
    featured: false,
    inStock: true,
    stockQuantity: 75,
    minimumQuantity: 1,
    tags: ["acrylic", "clear", "modern"],
    createdBy: "admin"
  },

  // Scarfs Collection Products
  {
    name: "Bandhani Silk Scarf",
    description: "Beautiful bandhani printed silk scarf with traditional patterns and vibrant colors",
    price: 180,
    originalPrice: 250,
    collection: "Scarfs",
    category: "Bandhani Scarf",
    subcategory: "Silk",
    images: ["https://picsum.photos/300x300/FF6B6B/FFFFFF?text=Bandhani+Scarf"],
    features: ["Pure Silk", "Hand Printed", "Traditional Pattern"],
    status: "active",
    featured: true,
    inStock: true,
    stockQuantity: 30,
    minimumQuantity: 1,
    tags: ["silk", "bandhani", "traditional"],
    createdBy: "admin"
  },
  {
    name: "White Embroidered Scarf",
    description: "Elegant white scarf with delicate embroidery work",
    price: 150,
    originalPrice: 200,
    collection: "Scarfs",
    category: "White Scarf",
    subcategory: "Embroidered",
    images: ["https://picsum.photos/300x300/F8F8FF/000000?text=White+Scarf"],
    features: ["Pure Cotton", "Hand Embroidered", "Elegant Design"],
    status: "active",
    featured: false,
    inStock: true,
    stockQuantity: 40,
    minimumQuantity: 1,
    tags: ["white", "embroidered", "cotton"],
    createdBy: "admin"
  },
  {
    name: "Baby Soft Cotton Scarf",
    description: "Ultra-soft cotton scarf perfect for babies, gentle on sensitive skin",
    price: 80,
    originalPrice: 120,
    collection: "Scarfs",
    category: "Baby Scarf",
    subcategory: "Soft Cotton",
    images: ["https://picsum.photos/300x300/FFE4E1/000000?text=Baby+Scarf"],
    features: ["Ultra Soft", "Baby Safe", "Hypoallergenic"],
    status: "active",
    featured: true,
    inStock: true,
    stockQuantity: 60,
    minimumQuantity: 1,
    tags: ["baby", "soft", "cotton"],
    createdBy: "admin"
  },

  // Bag Fabric Collection Products
  {
    name: "Digital Print Cotton Fabric",
    description: "High-quality cotton fabric with digital print designs, perfect for bags and accessories",
    price: 120,
    originalPrice: 180,
    collection: "Bag Fabric",
    category: "Digital Print Fabric",
    subcategory: "Cotton",
    images: ["https://picsum.photos/300x300/4ECDC4/FFFFFF?text=Digital+Fabric"],
    features: ["100% Cotton", "Digital Print", "Durable"],
    status: "active",
    featured: true,
    inStock: true,
    stockQuantity: 100,
    minimumQuantity: 1,
    tags: ["cotton", "digital", "fabric"],
    createdBy: "admin"
  },
  {
    name: "Waterproof School Bag Fabric",
    description: "Heavy-duty waterproof fabric perfect for school bags and backpacks",
    price: 200,
    originalPrice: 280,
    collection: "Bag Fabric",
    category: "School Bag Fabric",
    subcategory: "Waterproof",
    images: ["https://picsum.photos/300x300/2E8B57/FFFFFF?text=School+Bag"],
    features: ["Waterproof", "Heavy Duty", "Durable"],
    status: "active",
    featured: false,
    inStock: true,
    stockQuantity: 50,
    minimumQuantity: 1,
    tags: ["waterproof", "school", "heavy-duty"],
    createdBy: "admin"
  },
  {
    name: "PU Leather Fabric",
    description: "Premium PU leather fabric for luxury bags and accessories",
    price: 300,
    originalPrice: 400,
    collection: "Bag Fabric",
    category: "Water Resistant Antifree Fabric",
    subcategory: "PU Leather",
    images: ["https://picsum.photos/300x300/8B4513/FFFFFF?text=PU+Leather"],
    features: ["PU Leather", "Water Resistant", "Luxury Finish"],
    status: "active",
    featured: true,
    inStock: true,
    stockQuantity: 25,
    minimumQuantity: 1,
    tags: ["leather", "luxury", "water-resistant"],
    createdBy: "admin"
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Seeding products...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${sampleProducts.length} products successfully`);
    
    // Display summary by collection
    const collections = await Product.aggregate([
      { $group: { _id: '$collection', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📊 Products by Collection:');
    collections.forEach(col => {
      console.log(`  ${col._id}: ${col.count} products`);
    });
    
    // Display categories for each collection
    console.log('\n📋 Categories by Collection:');
    for (const collection of collections) {
      const categories = await Product.aggregate([
        { $match: { collection: collection._id } },
        { $group: { _id: '$category', subcategories: { $addToSet: '$subcategory' } } },
        { $sort: { _id: 1 } }
      ]);
      
      console.log(`\n  ${collection._id}:`);
      categories.forEach(cat => {
        console.log(`    - ${cat._id}: ${cat.subcategories.join(', ')}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
