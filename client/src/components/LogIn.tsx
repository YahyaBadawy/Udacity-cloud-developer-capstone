import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}


export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }


  render() {
    return (
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '80vh'}}>
        <p>Please log in to see your content&nbsp;&nbsp;</p>

        <Button onClick={this.onLogin} size="large" color="olive">
          Log in
        </Button>
      </div>
    )
  }
}
