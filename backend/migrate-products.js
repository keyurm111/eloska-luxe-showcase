const mongoose = require('mongoose');
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eloska-admin')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

async function migrateProducts() {
  try {
    console.log('🔄 Starting product migration...');
    
    // Get all products that don't have collection field
    const productsToMigrate = await Product.find({ 
      $or: [
        { collection: { $exists: false } },
        { minimumQuantity: { $exists: false } }
      ]
    });
    
    console.log(`📦 Found ${productsToMigrate.length} products to migrate`);
    
    for (const product of productsToMigrate) {
      const updates = {};
      
      // Set collection based on category
      if (!product.collection) {
        if (product.category.includes('mirror') || product.category.includes('silver')) {
          updates.collection = 'Mirror Collection';
        } else if (product.category.includes('scarf') || product.category.includes('bandhani')) {
          updates.collection = 'Scarfs';
        } else if (product.category.includes('fabric') || product.category.includes('bag')) {
          updates.collection = 'Bag Fabric';
        } else {
          updates.collection = 'Mirror Collection'; // Default
        }
      }
      
      // Set minimum quantity
      if (!product.minimumQuantity) {
        updates.minimumQuantity = 1;
      }
      
      // Update the product
      await Product.findByIdAndUpdate(product._id, updates);
      console.log(`✅ Updated product: ${product.name}`);
    }
    
    console.log('🎉 Product migration completed successfully!');
    
    // Display summary
    const collections = await Product.aggregate([
      { $group: { _id: '$collection', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📊 Products by Collection:');
    collections.forEach(col => {
      console.log(`  ${col._id}: ${col.count} products`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

migrateProducts();
