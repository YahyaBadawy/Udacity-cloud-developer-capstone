import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Loader
} from 'semantic-ui-react'

import { deleteVideo, getVideos, patchVideo } from '../api/videos-api'
import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'
import { Video } from '../types/Video'
import { Videos } from './Videos'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
  videos: Video[]
  newVideoName: string
  loadingVideos: boolean
}


export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true,
    videos: [],
    newVideoName: '',
    loadingVideos: true
  }


  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }


  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        dueDate
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: ''
      })
    } catch {
      alert('video creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('video deletion failed')
    }
  }
  onVideoDelete = async (videoId: string) => {
    try {
      await deleteVideo(this.props.auth.getIdToken(), videoId)
      this.setState({
        videos: this.state.videos.filter(video => video.videoId !== videoId)
      })
    } catch {
      alert('video deletion failed')
    }
  }


  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('todo update failed')
    }
  }

  onVideoCheck = async (pos: number) => {
    try {
      const video = this.state.videos[pos]
      await patchVideo(this.props.auth.getIdToken(), video.videoId, {
        name: video.name,
        createdAt: video.createdAt,
        done: !video.done
      })
      this.setState({
        videos: update(this.state.videos, {
          [pos]: { done: { $set: !video.done } }
        })
      })
    } catch {
      alert('video update failed')
    }
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })

      const videos = await getVideos(this.props.auth.getIdToken())
      this.setState({
        videos,
        loadingVideos: false
      })
    } catch (e) {
      alert(`Failed to fetch posts: ${(e as Error).message}`)
    }
  }



  render() {
    return (
      <div>
        <Header as="h2">ViPost Hub</Header>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;The right place to privately share your favorite posts and cool video content over the cloud.</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;Simple yet fun. Just upload your posts beside videos and privately check them and tick the box if done watching/reading. Have fun!</p>
        {this.renderCreateTodoInput()}

        {this.renderCreateVideo()}

        {this.renderTodos()}

        {this.renderVideos()}
      </div>
    )
  }

  renderCreateVideo() {
    return (
      <Videos {...this.props} auth={this.props.auth} />
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'yellow',
              labelPosition: 'right',
              icon: 'add',
              content: 'New Post',
              onClick: this.onTodoCreate
            }}
            fluid
            placeholder="What's in your mind!"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderVideos() {
    if (this.state.loadingVideos) {
      return this.renderVLoading()
    }

    return this.renderVideosList()
  }

  renderVLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Your Videos
        </Loader>
      </Grid.Row>
    )
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Your Posts
          <Divider />
        </Loader>
      </Grid.Row>
    )
  }

  readOrUnread(value: boolean) {
    return value ? <p>read</p> : <p>unread</p>
  }

  watchedOrUnwatched(value: boolean) {
    return value ? <p>watched</p> : <p>unwatched</p>
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={2} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                />
                {this.readOrUnread(todo.done)}
              </Grid.Column>
              <Grid.Column width={9} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                {/* <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="pencil" />
                </Button> */}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (<video className="video-js" width="550" height="300" controls preload="auto" >
                <source src={todo.attachmentUrl} type="video/mp4" />
              </video>)}
              <Grid.Column width={15}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>

    )
  }

  renderVideosList() {
    return (
      <Grid padded>
        {this.state.videos.map((video, pos) => {
          return (
            <Grid.Row key={video.videoId}>
              <Grid.Column width={2} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onVideoCheck(pos)}
                  checked={video.done}
                />
                {this.watchedOrUnwatched(video.done)}
              </Grid.Column>
              <Grid.Column width={9} verticalAlign="middle">
                {video.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {video.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                {/* <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="pencil" />
                </Button> */}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onVideoDelete(video.videoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {video.attachmentUrl && (<video className="video-js" width="550" height="300" controls preload="auto" >
                <source src={video.attachmentUrl} type="video/mp4" />
              </video>)}
              <Grid.Column width={15}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>

    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate())

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
