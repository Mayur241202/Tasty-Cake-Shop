const mongoose = require("mongoose");
const Product = require("./models/Product");

async function cleanupInvalidProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tasty-cake-shop", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // First, let's see all products
    const allProducts = await Product.find();
    console.log("\nAll products in database:");
    allProducts.forEach(product => {
      console.log(`- ID: ${product._id}, Name: "${product.name}", Unit: "${product.unit}", Branch: "${product.branch}"`);
    });

    // Find products where name or unit is only numbers
    const invalidProducts = await Product.find({
      $or: [
        { name: /^\d+$/ },
        { unit: /^\d+$/ }
      ]
    });

    console.log("\nFound invalid products:", invalidProducts.length);
    
    if (invalidProducts.length > 0) {
      invalidProducts.forEach(product => {
        console.log(`Deleting: ${product._id} - Name: ${product.name}, Unit: ${product.unit}`);
      });

      const result = await Product.deleteMany({
        $or: [
          { name: /^\d+$/ },
          { unit: /^\d+$/ }
        ]
      });

      console.log(`Deleted ${result.deletedCount} invalid products`);
    } else {
      console.log("No invalid products found - validations are working!");
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Error cleaning up products:", error);
    process.exit(1);
  }
}

cleanupInvalidProducts();
