import React from 'react';
import shortid from 'shortid';

import { configureRootTheme } from '@yandex-lego/components/Theme'
import { theme } from '@yandex-lego/components/Theme/presets/default'

import { Button } from '@yandex-lego/components/Button/desktop/bundle'
import { Select } from '@yandex-lego/components/Select/desktop/bundle'
import { Textinput } from '@yandex-lego/components/Textinput/desktop/bundle'

configureRootTheme({ theme })

class BiddersMapBidder extends React.Component {
  render() {
    return (
      <div key={this.props.idx} className="bidders-map__item">
          <div className="bidders-map__bidder-select">
            <Select
              key={shortid.generate()}
              width="max"
              baseline="true"
              size="m"
              view="default"
              onChange={(e) => {this.props.bidderSelect(e, this.props.index)}}
              value={this.props.biddersUsed[this.props.index].checked}
              options={this.props.biddersList}
            />
          </div>
          <div className="bidders-map__campaign-id">
            <Textinput
              state={this.props.biddersUsed[this.props.index].state}
              hint={this.props.biddersUsed[this.props.index].hint}
              baseline="true"
              type="number"
              size="m"
              view="default"
              placeholder="ID"
              value={this.props.biddersUsed[this.props.index].value}
              onChange={(e) => {this.props.campaignIdInput(e, this.props.index)}}
            />
          </div>
          {
            this.props.biddersUsed[this.props.index].hasOwnProperty("biddersName") &&
            <div className="bidders-map__bidders-name">
              <Textinput
                baseline="true"
                size="m"
                view="default"
                placeholder="Логин"
                state={this.props.biddersUsed[this.props.index].biddersNameState}
                hint={this.props.biddersUsed[this.props.index].biddersNameHint}
                value={this.props.biddersUsed[this.props.index].biddersName}
                onChange={(e) => {this.props.biddersNameInput(e, this.props.index)}}
              />
            </div>
          }
          <Button
            className="bidders-map__remove-button"
            view="action" 
            size="m"
            onClick={(e) => {this.props.removeBidder(this.props.index)}}
          >
            ✕
          </Button>
      </div>
    )
  }
}

export default BiddersMapBidder;
