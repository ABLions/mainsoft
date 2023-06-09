const AWS = require('aws-sdk');

const getDynamoDBClient = () => {
  try {
    // Create and configure the DynamoDB client
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    return dynamodb;
    
  } catch (error) {
    console.error('Failed to create DynamoDB client:', error);
    throw error;
  }
};

module.exports = { getDynamoDBClient };
