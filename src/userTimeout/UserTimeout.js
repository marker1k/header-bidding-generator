import React from 'react';
import { Textinput } from '@yandex-lego/components/Textinput/desktop/bundle'

class UserTimeout extends React.Component {
  render() {
    return (
      <div className="user-timeout">
        <h2 className="user-timeout__title">User Timeout</h2>
        <div className="user-timeout__input">
          <Textinput
              baseline="true"
              size="m"
              view="default"
              type="number"
              placeholder="Таймаут в миллисекундах"
              value={this.props.userTimeout.value}
              state={this.props.userTimeout.state}
              hint={this.props.userTimeout.hint}
              onChange={(e) => {this.props.userTimeoutInput(e)}}
          />
        </div>
      </div>
    )
  }
}

export default UserTimeout;