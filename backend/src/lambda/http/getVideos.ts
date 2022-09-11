import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getVideosForUser as getVideosForUser } from '../../../src/businessLogic/videos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    console.log('getting all videos', event)
    const userId = getUserId(event)
    
    console.log('userId: ', userId)
    const videos = await getVideosForUser(userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': '*'
      },
      body: JSON.stringify({items: videos})
    }
}