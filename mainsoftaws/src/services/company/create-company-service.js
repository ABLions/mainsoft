// create-company-service.js
const { v4 } = require('uuid');
const { getDynamoDBClient } = require('./../../utils/dinamo-db');
const ProductValidator = require('./../../utils/product-validator');

class CreateCompanyService {
  constructor() {
    this.dynamodb = getDynamoDBClient();
  }

  async createCompanyService(company) {
    try {
      const dynamodb = this.dynamodb;

      const { nit, companyName, address,  phone, products } = company;

      if (typeof nit !== 'string' || nit.trim() === '') {
        return {
          status: 400,
          body: 'Invalid nit',
        };
      }

      const validatedProducts = ProductValidator.validateProducts(products);

      const createdAt = new Date().toISOString();
      const id = v4();

      const newCompany = {
        nit: nit.toString(),
        id,
        companyName,
        address,
        phone,
        products: validatedProducts,
        createdAt,
      };

      await dynamodb
        .put({
          TableName: 'MainsoftTable',
          Item: newCompany,
          Key: {
            nit: nit ? nit.toString() : '',
          },
        })
        .promise();

      return {
        status: 201,
        body: newCompany,
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

module.exports = CreateCompanyService;
