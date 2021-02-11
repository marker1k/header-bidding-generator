import React from 'react';
import { Textinput } from '@yandex-lego/components/Textinput/desktop/bundle'

class TrustedOwners extends React.Component {
  render() {
    return (
      <div className="trusted-owners">
        <h2 className="trusted-owners__title">Trusted Owners</h2>
        <div className="trusted-owners__input">
          <Textinput
              baseline="true"
              size="m"
              view="default"
              placeholder="11111,22222,33333,444444"
              value={this.props.trustedOwners.value}
              state={this.props.trustedOwners.state}
              hint={this.props.trustedOwners.hint}
              onChange={(e) => {this.props.trustedOwnersInput(e)}}
          />
        </div>
      </div>
    )
  }
}

export default TrustedOwners;