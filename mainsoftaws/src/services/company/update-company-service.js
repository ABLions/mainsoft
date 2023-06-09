const { getDynamoDBClient } = require('./../../utils/dinamo-db');
const ProductValidator = require('./../../utils/product-validator');

class UpdateCompanyService {
  constructor() {
    this.dynamodb = getDynamoDBClient();
  }

  async updateCompanyService(nit, company) {
    try {
      const dynamodb = this.dynamodb;
      const nitString = nit;
      const { companyName, address, phone, products } = company;

      const validatedProducts = ProductValidator.validateProducts(products);

      // Check if the products array is present and not empty
      if (products && (!Array.isArray(products) || products.length === 0)) {
        return {
          status: 400,
          body: { message: validatedProducts.message },
        };
      }

      await dynamodb
        .update({
          TableName: 'MainsoftTable',
          Key: {
            nit: nitString,
          },
          UpdateExpression: 'set companyName = :companyName, address = :address, phone = :phone, products = :products',
          ExpressionAttributeValues: {
            ':companyName': companyName,
            ':address': address,
            ':phone': phone,
            ':products': validatedProducts,
          },
          ReturnValues: 'ALL_NEW',
        })
        .promise();

      return {
        status: 200,
        body: { message: 'Company updated successfully', company },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        body: 'Internal Server Error',
      };
    }
  }
}
module.exports = UpdateCompanyService;