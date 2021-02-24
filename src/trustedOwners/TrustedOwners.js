import React from 'react';
import { Textinput } from '@yandex-lego/components/Textinput/desktop/bundle'

class TrustedOwners extends React.Component {
  render() {
    return (
      <div className="trusted-owners">
        <div className="bidders-map__heading-wrapper">
          <h2 className="trusted-owners__title">Trusted Owners</h2>
          <div className="help-icon">&#63;
              <div className="help-popup">Необязательный параметр. Если вы планируете передавать ставки в запросы других аккаунтов ADFOX через шаблон Проброс кода ADFOX [loader], укажите через запятую идентификаторы аккаунтов, коды из которых будут пробрасываться.</div>
            </div>
        </div>
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