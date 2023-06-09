const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const UpdateCompanyService = require('./../../services/company/update-company-service');

const updateCompanyController = async (event) => {
  try {
    const { nit } = event.pathParameters;
    const company = event.body;

    if (!company || typeof company !== 'object' || !('products' in company)) {
      return {
        status: 400,
        body: 'Invalid company data',
      };
    }

    const companyService = new UpdateCompanyService();
    const result = await companyService.updateCompanyService(nit, company);

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
  updateCompanyController: middy(updateCompanyController).use(jsonBodyParser()),
};
