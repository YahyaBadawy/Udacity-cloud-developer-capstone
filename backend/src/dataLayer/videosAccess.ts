import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { VideoItem } from '../models/VideoItem'
import { VideoUpdate } from '../models/VideoUpdate'
import { AttachmentUtils } from '../helpers/attachmentUtils'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()

export class VideosAccess {
    
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly videosTable = process.env.VIDEOS_TABLE,
        private readonly videoTableGsi = process.env.VIDEOS_CREATED_AT_INDEX 
    ){ 
    }

    async getVideosPerUser(userId: string): Promise<VideoItem[]> {
        console.log('Getting video for user', userId)

        const result = await this.docClient.query({
            TableName: this.videosTable,
            IndexName: this.videoTableGsi,
            KeyConditionExpression: 'userId = :param',
            ExpressionAttributeValues: {
                ':param': userId 
            }
        }).promise()

        const items = result.Items

        console.log('Returning videos for user: ' + userId + ', and items: ' + JSON.stringify({items}))
        return items as VideoItem[]
    }

    
    async createVideo(video: VideoItem): Promise<VideoItem> {
        console.log('creating new video')

        await this.docClient.put({
            TableName: this.videosTable,
            Item: video
        }).promise()
        
        console.log('returning newly created video', video)
        
        return video
    }

    async updateVideo(videoId: string, video: VideoUpdate, userId: string): Promise<VideoUpdate> {
        console.log('updating the video item')

        await this.docClient.update({
            TableName: this.videosTable,
            Key: {
                "videoId": videoId,
                "userId": userId
            },
            UpdateExpression: "set #nameAttribute = :n, dueDate = :d, done = :x",
            ExpressionAttributeNames: {"#nameAttribute": "name"},
            ExpressionAttributeValues: { ':n': video.name, ':d': video.createdAt, ':x': video.done}
        }).promise()
        
        return video
    }

    // async todoExists(todoId: string) {
    //     const result = await this.docClient
    //       .get({
    //         TableName: this.todosTable,
    //         Key: {
    //           id: todoId
    //         }
    //       })
    //       .promise()
      
    //     console.log('Get group: ', result)
    //     return !!result.Item
    // }

    async createAttachmentPresignedUrl(attachmentId: string): Promise<String>{
        console.log('getting the presigned url')
        const url = await attachmentUtils.getUploadURL(attachmentId)
        return url
    }

    async updateVideoAttachmentUrl(videoId: string, userId: string) {
        logger.info(`Updating videoId ${videoId} for user ${userId}`)
        console.log('updating the presigned url')
        await attachmentUtils.updateVideoAttachmentUrl(videoId, userId) 
    }

    async deleteVideo(videoId: string, userId: string): Promise<String> {
        logger.info("Deleting video:", {videoId: videoId});
        await this.docClient.delete({
            TableName: this.videosTable,
            Key: {
                "videoId": videoId,
                "userId": userId
            }
        }).promise();
        logger.info("Delete complete.", {videoId: videoId});

        return "video deleted"
    }
}
// TODO: Implement the dataLayer logic