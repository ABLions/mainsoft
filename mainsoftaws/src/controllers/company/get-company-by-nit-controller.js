const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const GetCompanyByNitService = require('./../../services/company/get-company-by-nit-service');

const getCompanyByNitController = async (event) => {
  try {
    const { nit } = event.pathParameters;

    if (!nit || typeof nit !== 'string' || nit.trim() === '') {
      return {
        status: 400,
        body: { message: 'Invalid nit' },
      };
    }

    const companyService = new GetCompanyByNitService();
    const result = await companyService.getCompanyByNitService(nit);

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
  getCompanyByNitController: middy(getCompanyByNitController).use(jsonBodyParser()),
};
