const { getDynamoDBClient } = require('./../../utils/dinamo-db');

class DeleteCompanyService {
  constructor() {
    this.dynamodb = getDynamoDBClient();
  }

  async deleteCompanyService(nit) {
    try {
      const dynamodb = this.dynamodb;
      const nitString = nit.toString();

      await dynamodb
        .delete({
          TableName: 'MainsoftTable',
          Key: {
            nit: nitString,
          },
        })
        .promise();

      return {
        status: 200,
        body: { message: 'Company deleted successfully' },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        body: { message: 'Internal Server Error' },
      };
    }
  }
}

module.exports = DeleteCompanyService;