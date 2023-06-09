const { getDynamoDBClient } = require('./../../utils/dinamo-db');

class GetCompanyByNitService {
  constructor() {
    this.dynamodb = getDynamoDBClient();
  }

  async getCompanyByNitService(nit) {
    try {
      const dynamodb = this.dynamodb;
      const nitString = nit.toString();

      const result = await dynamodb
        .get({
          TableName: 'MainsoftTable',
          Key: {
            nit: nitString,
          },
        })
        .promise();

      if (!result.Item) {
        return {
          status: 404,
          body: { message: 'Company not found' },
        };
      }

      return {
        status: 200,
        body: result.Item,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        body: { message: 'Internal Server Error', error },
      };
    }
  }
}

module.exports = GetCompanyByNitService;

