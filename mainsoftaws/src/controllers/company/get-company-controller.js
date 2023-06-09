const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const GetAllCompaniesService = require('./../../services/company/get-company-service');

const getAllCompaniesController = async () => {
  try {
    const companyService = new GetAllCompaniesService();
    const result = await companyService.getAllCompaniesService();

    return {
      status: result.status,
      body: result.body,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: { message: 'Internal Server Error', error },
    };
  }
};

module.exports = {
  getAllCompaniesController: middy(getAllCompaniesController).use(jsonBodyParser()),
};


