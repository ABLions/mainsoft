const { v4 } = require('uuid');

class ProductValidator {
  static validateProducts(products) {
    if (!Array.isArray(products)) {
      throw new Error('Invalid products. Products must be an array.');
    }

    const validatedProducts = [];

    for (const product of products) {
      
      const { productName, description, image, price, quantity } = product;


      if (description && (typeof description !== 'string' || description.trim() === '')) {
        throw new Error('Invalid product description.');
      }

      if (image && (typeof image !== 'string' || image.trim() === '')) {
        throw new Error('Invalid product image.');
      }

      if (price && (typeof price !== 'number' || price <= 0)) {
        throw new Error('Invalid product price.');
      }

      if (productName && (typeof productName !== 'string' || productName.trim() === '')) {
        throw new Error('Invalid product name.');
      }

      if (quantity && (typeof quantity !== 'number' || quantity <= 0)) {
        throw new Error('Invalid product quantity.');
      }

      const productId = v4(); // Generate a unique product ID using v4()
      validatedProducts.push({ ...product, productId });
    }

    return validatedProducts;
  }
}

module.exports = ProductValidator;
