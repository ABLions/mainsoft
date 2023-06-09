// Controller
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const DeleteCompanyService = require('./../../services/company/delete-company-service');

const deleteCompanyController = async (event) => {
  try {
    const { nit } = event.pathParameters;

    if (!nit || typeof nit !== 'string' || nit.trim() === '') {
      return {
        status: 400,
        body: { message: 'Invalid nit' },
      };
    }

    const companyService = new DeleteCompanyService();
    const result = await companyService.deleteCompanyService(nit);

    return {
      status: result.status,
      body: result.body,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: { message: 'Internal Server Error' },
    };
  }
};

module.exports = {
  deleteCompanyController: middy(deleteCompanyController).use(jsonBodyParser()),
};