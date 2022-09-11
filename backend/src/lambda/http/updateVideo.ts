import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { updateVideo } from '../../businessLogic/videos'
import { UpdateVideoRequest } from '../../requests/UpdateVideoRequest'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const videoId = event.pathParameters.videoId
  const updatedVideo: UpdateVideoRequest = JSON.parse(event.body)
  // TODO: Update a VIDEO item with the provided id using values in the "updatedVideo" object
  const userId = getUserId(event)

  console.log('userId: ', userId)
  const video = await updateVideo(videoId, updatedVideo, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': '*'
    },
    body:
      JSON.stringify({items: video})
  }
}