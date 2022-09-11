"use strict"

import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { VideosAccess } from '../../dataLayer/videosAccess'

import { createAttachmentPresignedUrl } from '../../businessLogic/videos'
import { getUserId } from '../utils'
//import * as uuid from 'uuid'

const videoAccess = new VideosAccess()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const videoId = event.pathParameters.videoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const userId = getUserId(event)

    console.log('userId: ' + userId + 'videoId: ' + videoId)

    const url = await createAttachmentPresignedUrl(videoId)

    await videoAccess.updateVideoAttachmentUrl(videoId, userId)

    return {
      statusCode: 201,
      body:
        JSON.stringify({
          uploadUrl: url
        })
    };
  }
);

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      headers: 'Access-Control-Allow-Origin'
    })
  )
