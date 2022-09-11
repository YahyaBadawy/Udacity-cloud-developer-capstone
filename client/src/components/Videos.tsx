import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import * as uuid from 'uuid'
import {
    //    Button,
    //    Checkbox,
    Divider,
    Grid,
    //    Header,
    //    Icon,
    Input,
    //    Loader
} from 'semantic-ui-react'

import Auth from '../auth/Auth'
import { Video } from '../types/Video'

interface VideosProps {
    auth: Auth
    history: History
}

interface VideosState {
    videos: Video[]
    newVideoName: string
    loadingVideos: boolean
}

export class Videos extends React.PureComponent<VideosProps, VideosState> {
    state: VideosState = {
        videos: [],
        newVideoName: '',
        loadingVideos: true
    }

    handleVideoNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // if (event.target.value === "") {
        //     alert('Invalid video name')
        // }
        this.setState({ newVideoName: event.target.value })
    }

    onVideoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
        if (this.state.newVideoName === '') {
            alert('Video name should not be empty!')
        } else {
            try {
                const videoId = uuid.v4()
                const videoName = this.state.newVideoName
                this.props.history.push(`/videos/${videoName}/${videoId}/upload`)
            } catch {

            }
        }
    }

    handleVideoUpload = async (event: React.ChangeEvent<HTMLButtonElement>) => {
        this.setState({ newVideoName: event.target.value })

    }

    calculateDueDate(): string {
        const date = new Date()
        date.setDate(date.getDate())

        return dateFormat(date, 'yyyy-mm-dd') as string
    }

    render() {
        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <Input
                        action={{
                            color: 'green',
                            labelPosition: 'left',
                            icon: 'add',
                            content: 'New Vid',
                            onClick: this.onVideoCreate
                        }}
                        fluid
                        actionPosition="left"
                        placeholder="Kite Surfing and Fun!"
                        onChange={this.handleVideoNameChange}
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Divider />
                </Grid.Column>
            </Grid.Row>
        )
    }

}