const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const CreateCompanyService = require('./../../services/company/create-company-service');
const ProductValidator = require('./../../utils/product-validator');

const createCompanyController = async (event) => {
  try {
    const { nit, companyName, address,  phone, products } = event.body;

    if (typeof nit !== 'string' || nit.trim() === '') {
      return {
        status: 400,
        body: { error: 'Invalid nit' },
      };
    }

    const validatedProducts = ProductValidator.validateProducts(products);

    const createCompanyService = new CreateCompanyService();

    const result = await createCompanyService.createCompanyService({
      companyName,
      address,
      nit: nit.trim(),
      phone,
      products: validatedProducts
    });

    return {
      status: result.status,
      body: result.body,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: 'Internal Server Error',
    };
  }
};

module.exports = {
  createCompanyController: middy(createCompanyController).use(jsonBodyParser()),
};
