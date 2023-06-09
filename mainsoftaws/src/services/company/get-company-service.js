const { getDynamoDBClient } = require('./../../utils/dinamo-db');

class GetAllCompaniesService {
  constructor() {
    this.dynamodb = getDynamoDBClient();
  }

  async getAllCompaniesService() {
    try {
      const dynamodb = this.dynamodb;

      const result = await dynamodb.scan({
        TableName: 'MainsoftTable',
      }).promise();

      const companyList = result.Items;

      return {
        status: 200,
        body: companyList,
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

module.exports = GetAllCompaniesService;