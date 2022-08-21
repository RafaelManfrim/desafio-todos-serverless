import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidV4 } from 'uuid'

import { document } from "../utils/dynamodbClient"

interface ICreateTodo {
  title: string
  deadline: string
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo
  const { user_id } = event.pathParameters

  const newTodo = {
    id: uuidV4(),
    user_id,
    title,
    done: false,
    deadline: new Date(deadline).toISOString()
  }

  await document.put({
    TableName: "user_todos",
    Item: newTodo
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify(newTodo),
  }
}