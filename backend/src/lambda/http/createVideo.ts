import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import { CreateVideoRequest } from '../../requests/CreateVideoRequest'
//import * as uuid from 'uuid'
import { getUserId } from '../utils';
import { createVideo } from '../../businessLogic/videos'
import { AttachmentUtils } from '../../../src/helpers/attachmentUtils'


const attachmentUtils = new AttachmentUtils()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newVideo: CreateVideoRequest = JSON.parse(event.body)
  // TODO: Implement creating a new VIDEO item
  const videoId = newVideo.id
  const userId = getUserId(event)
  const attachmentURL = await attachmentUtils.updateVideoAttachmentUrl(videoId, userId)
  const item = await createVideo(newVideo, userId, videoId, attachmentURL)


  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': '*'
    },
    body: JSON.stringify({ item: item })
  }
}