const mongoose = require('mongoose');
const ProductCategory = require('./models/ProductCategory');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eloska-admin')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const categories = [
  // Mirror Collection
  { collection: 'Mirror Collection', category: 'Regular Silver Mirrors', subcategory: 'Round' },
  { collection: 'Mirror Collection', category: 'Regular Silver Mirrors', subcategory: 'Square' },
  { collection: 'Mirror Collection', category: 'Regular Silver Mirrors', subcategory: 'Rectangle' },
  { collection: 'Mirror Collection', category: 'Regular Silver Mirrors', subcategory: 'Almond' },
  { collection: 'Mirror Collection', category: 'Regular Silver Mirrors', subcategory: 'Diamond' },
  { collection: 'Mirror Collection', category: 'Regular Silver Mirrors', subcategory: 'Eye' },
  { collection: 'Mirror Collection', category: 'Regular Silver Mirrors', subcategory: 'Triangle' },
  
  { collection: 'Mirror Collection', category: 'Artistic Mirrors', subcategory: 'Fancy Shape' },
  { collection: 'Mirror Collection', category: 'Artistic Mirrors', subcategory: 'Designer' },
  { collection: 'Mirror Collection', category: 'Artistic Mirrors', subcategory: 'Custom' },
  
  { collection: 'Mirror Collection', category: 'Acrylic Mirror', subcategory: 'Clear' },
  { collection: 'Mirror Collection', category: 'Acrylic Mirror', subcategory: 'Colored' },
  { collection: 'Mirror Collection', category: 'Acrylic Mirror', subcategory: 'Frosted' },
  
  { collection: 'Mirror Collection', category: 'Catalogues', subcategory: 'Design Book' },
  { collection: 'Mirror Collection', category: 'Catalogues', subcategory: 'Price List' },
  
  { collection: 'Mirror Collection', category: 'Mirrors Sheet', subcategory: 'Small' },
  { collection: 'Mirror Collection', category: 'Mirrors Sheet', subcategory: 'Medium' },
  { collection: 'Mirror Collection', category: 'Mirrors Sheet', subcategory: 'Large' },

  // Scarfs Collection
  { collection: 'Scarfs', category: 'Bandhani Scarf', subcategory: 'Black' },
  { collection: 'Scarfs', category: 'Bandhani Scarf', subcategory: 'Blue' },
  { collection: 'Scarfs', category: 'Bandhani Scarf', subcategory: 'Chikoo' },
  { collection: 'Scarfs', category: 'Bandhani Scarf', subcategory: 'Grey' },
  { collection: 'Scarfs', category: 'Bandhani Scarf', subcategory: 'Maroon' },
  { collection: 'Scarfs', category: 'Bandhani Scarf', subcategory: 'Peach' },
  { collection: 'Scarfs', category: 'Bandhani Scarf', subcategory: 'Pink' },
  { collection: 'Scarfs', category: 'Bandhani Scarf', subcategory: 'Red' },
  { collection: 'Scarfs', category: 'Bandhani Scarf', subcategory: 'Teal' },
  
  { collection: 'Scarfs', category: 'White Scarf', subcategory: 'Plain' },
  { collection: 'Scarfs', category: 'White Scarf', subcategory: 'Embroidered' },
  { collection: 'Scarfs', category: 'White Scarf', subcategory: 'Printed' },
  { collection: 'Scarfs', category: 'White Scarf', subcategory: 'Designer' },
  
  { collection: 'Scarfs', category: 'Baby Scarf', subcategory: 'Black Dhingli' },
  { collection: 'Scarfs', category: 'Baby Scarf', subcategory: 'Black Heart Heart' },
  { collection: 'Scarfs', category: 'Baby Scarf', subcategory: 'Black Star' },
  { collection: 'Scarfs', category: 'Baby Scarf', subcategory: 'Color Heart' },
  { collection: 'Scarfs', category: 'Baby Scarf', subcategory: 'Music' },
  { collection: 'Scarfs', category: 'Baby Scarf', subcategory: 'Tedy Bear' },

  // Bag Fabric
  { collection: 'Bag Fabric', category: 'Digital Print Fabric', subcategory: 'Cotton' },
  { collection: 'Bag Fabric', category: 'Digital Print Fabric', subcategory: 'Polyester' },
  { collection: 'Bag Fabric', category: 'Digital Print Fabric', subcategory: 'Canvas' },
  { collection: 'Bag Fabric', category: 'Digital Print Fabric', subcategory: 'Denim' },
  
  { collection: 'Bag Fabric', category: 'Water Resistant Antifree Fabric', subcategory: 'PVC' },
  { collection: 'Bag Fabric', category: 'Water Resistant Antifree Fabric', subcategory: 'PU Leather' },
  { collection: 'Bag Fabric', category: 'Water Resistant Antifree Fabric', subcategory: 'Nylon' },
  { collection: 'Bag Fabric', category: 'Water Resistant Antifree Fabric', subcategory: 'Polyester' },
  
  { collection: 'Bag Fabric', category: 'School Bag Fabric', subcategory: 'Heavy Duty' },
  { collection: 'Bag Fabric', category: 'School Bag Fabric', subcategory: 'Lightweight' },
  { collection: 'Bag Fabric', category: 'School Bag Fabric', subcategory: 'Waterproof' },
  { collection: 'Bag Fabric', category: 'School Bag Fabric', subcategory: 'Reinforced' }
];

async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...');
    
    // Clear existing categories
    await ProductCategory.deleteMany({});
    console.log('🗑️ Cleared existing categories');
    
    // Insert new categories
    await ProductCategory.insertMany(categories);
    console.log(`✅ Seeded ${categories.length} categories successfully`);
    
    // Display summary
    const collections = await ProductCategory.aggregate([
      { $group: { _id: '$collection', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📊 Categories by Collection:');
    collections.forEach(col => {
      console.log(`  ${col._id}: ${col.count} items`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
