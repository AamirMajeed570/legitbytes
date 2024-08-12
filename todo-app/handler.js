const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;
exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
    }),
  };
};

exports.createTodo = async (event) => {
  let statusCode = 200;
  let responseMessage = 'Todo Created Successfully';
  console.log('Hello World ---1223')
  try {
    const { id, content, status } = JSON.parse(event.body);

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        ID: id,
        content,
        status,
        createdAt: new Date().toISOString(),
      },
    };

    await dynamoDb.put(params).promise();

  } catch (error) {
    console.error('Error creating todo:', error);
    statusCode = 500;
    responseMessage = 'Internal Server Error 500';
  }

  return {
    statusCode,
    body: JSON.stringify({ message: responseMessage }),
  };
};


exports.getTodo = async (event) =>{
  const {id} = event.pathParameters;
  console.log('Received ID is ---> ', id);
  const params = {
    TableName: TABLE_NAME,
    Key:{ID:id},
  }
  try {
    const result = await dynamoDb.get(params).promise();
    if(!result.Item){
      return{
        statusCode:200,
        body: JSON.stringify(result.Item),
      }
    }
  } catch (error) {
    console.log('Error Fetching Todo');
    return {
      statusCode: 500,
      body: JSON.stringify({message:'Internal Server Error Ocurred'})
    }
  }

}