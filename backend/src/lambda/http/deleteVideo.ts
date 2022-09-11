"use strict"

import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteVideo } from '../../businessLogic/videos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const videoId = event.pathParameters.videoId
    // TODO: Remove a VIDEO item by id
    const userId = getUserId(event)
    
    console.log('userId: ', userId)

    const msg = await deleteVideo(videoId, userId)
    
    return {
      statusCode: 202,
      body: 
      JSON.stringify({'update message': msg})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      headers: 'Access-Control-Allow-Origin'
    })
  )
