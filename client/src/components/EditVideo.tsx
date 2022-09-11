import * as React from 'react'
import dateFormat from 'dateformat'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/videos-api'
import { Video } from '../types/Video'
import { createVideo } from '../api/videos-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditVideoProps {
  match: {
    params: {
      videoId: string
      videoName: string
    }
  }
  auth: Auth
}

interface EditVideoState {
  file: any
  uploadState: UploadState
  videos: Video[],
  newVideoName: ''
}

export class EditVideo extends React.PureComponent<
  EditVideoProps,
  EditVideoState
> {
  state: EditVideoState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    videos: [],
    newVideoName: ''
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.videoId)

      //Create video item in the DB (videoName, createdAt)

      const createdAt = this.calculateDueDate()
      //const attachmentURL = ''
      const videoName = this.props.match.params.videoName
      const newVideo = await createVideo(this.props.auth.getIdToken(), {
           id: this.props.match.params.videoId,
           name: videoName,
           createdAt
      })
      this.setState({
          videos: [...this.state.videos, newVideo],
          newVideoName: ''
      })

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Upload new Video</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="video/*"
              placeholder="Video to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading video metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate())
  
    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}



