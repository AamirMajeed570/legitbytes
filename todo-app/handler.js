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
    const { id, content, statuss } = JSON.parse(event.body);

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        ID: id,
        content,
        statuss,
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

exports.updateTodo = async (event) =>{
    const {id} = event.pathParameters;
    let content,statuss;
    try {
      const {content:newContent,state:newStatus} = JSON.parse(event.body);
      content = newContent;
      statuss = newStatus;
    } catch (error) {
      console.log('Error Parsing Request Body:', error.message);
      return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid request body' }),
      };
    }
    console.log('Data--->', id,content,statuss)
    const params = {
      TableName: TABLE_NAME,
      Key: {ID:id},
      UpdateExpression: 'set content = :content,statuss = :statuss',
      ExpressionAttributeValues: {
        ':content': content,
        ':statuss': statuss,
      },
      ReturnValues: 'ALL_NEW',
    };
    try {
      const result = await dynamoDb.update(params).promise()
      console.log('Updated Data is --->', result);
      return {
        statusCode: 200,
        body: JSON.stringify(result.Attributes),
      }
    } catch (error) {
      console.log('Error Updating Todo--->', error?.message);
      return {
        statusCode: 500,
        body: JSON.stringify({message:'Internal Server error (updateTodo)'}),
      }
    }
}

exports.deleteTodo = async (event) =>{
  const {id} = event.pathParameters;
  const params = {
    TableName: TABLE_NAME,
    Key: {ID:id},
  }
  try {
    await dynamoDb.delete(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify({message: 'Todo Deleted Succesfully'})
    }
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({message:'Something went Wrong While Deleting Todo'})
    }
  }
}