import { Component } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import './App.css'
import Container from 'react-bootstrap/Container';
import Auth from './auth/Auth'
import { EditTodo } from './components/EditTodo'
import { EditVideo } from './components/EditVideo'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Todos } from './components/Todos'
import Button from '@mui/material/Button';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export interface AppProps { }

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState { }

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)

  }

  handleLogin(e: React.MouseEvent<HTMLElement>) {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (

      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link to="/"><h3 style={{ color: 'white' }}>Home</h3></Link>
              </Typography>
              {this.logInLogOutButton1()}

            </Toolbar>
          </AppBar>
          {this.generateCurrentPage()}
        </Box>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton1()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item class="menu-item" name="login" onClick={this.handleLogin}>
          Login
        </Menu.Item>
      )
    }
  }

  logInLogOutButton1() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Button color="inherit" name="logout" onClick={this.handleLogout}>
          Log Out
        </Button>
      )
    } else {
      return (
        <Button color="inherit" name="login" onClick={this.handleLogin}>
          Login
        </Button>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <section>
          <Container className="p-3">
            <Container className="p-5 mb-4 bg-light rounded-3">
              <Route
                path="/"
                exact
                render={props => {
                  return <Todos {...props} auth={this.props.auth} />
                }}
              />


              <Route
                path="/todos/:todoId/edit"
                exact
                render={props => {
                  return <EditTodo {...props} auth={this.props.auth} />
                }}
              />

              <Route
                path="/videos/:videoName/:videoId/upload"
                exact
                render={props => {
                  return <EditVideo {...props} auth={this.props.auth} />
                }}
              />
            </Container>
          </Container>
        </section>


        <Route component={NotFound} />
      </Switch>
    )
  }
}
