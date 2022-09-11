      
import { VideosAccess } from '../dataLayer/videosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { VideoItem } from '../models/VideoItem'
import { VideoUpdate } from '../models/VideoUpdate'
import { CreateVideoRequest } from '../requests/CreateVideoRequest'
import { UpdateVideoRequest } from '../requests/UpdateVideoRequest'
import { createLogger } from '../utils/logger'
import * as createError from 'http-errors'
// TODO: Implement businessLogic

const videosAccess = new VideosAccess()
const attachmentUtils = new AttachmentUtils()

export async function createVideo (createVideoRequest: CreateVideoRequest, userId: string, videoId: string, attachmentURL: string): Promise<VideoItem> {
    createLogger(`Creating todoId ${videoId} for user ${userId}}`)
    console.log('calling dataLayer Fn')
    return await videosAccess.createVideo({
        userId,
        videoId,
        name: createVideoRequest.name,
        createdAt: createVideoRequest.createdAt,
        attachmentUrl: attachmentURL
    })
}

export async function updateVideo (videoId: string, updateVideoRequest: UpdateVideoRequest, userId: string): Promise<VideoUpdate> {
    createLogger(`Updating videoId ${videoId}`)

    return await videosAccess.updateVideo(videoId, updateVideoRequest, userId)
}

export async function createAttachmentPresignedUrl(videoId: string): Promise<String> {
    return await attachmentUtils.getUploadURL(videoId)
}

export async function deleteVideo(videoId: string, userId: string): Promise<String> {
    return await videosAccess.deleteVideo(videoId, userId)
}

export async function getVideosForUser(userId: string): Promise<VideoItem[]> {
    try {
        return await videosAccess.getVideosPerUser(userId)
    }catch(e){
        createError('failed to get videos for user', e)
        return e
    }
}