import React from 'react';
import BiddersMapBidder from './BiddersMapBidder';
import shortid from 'shortid';

import { configureRootTheme } from '@yandex-lego/components/Theme'
import { theme } from '@yandex-lego/components/Theme/presets/default'
import { Button } from '@yandex-lego/components/Button/desktop/bundle'

configureRootTheme({ theme })

class BiddersMap extends React.Component {
  render() {
    return (
      <div className="bidders-map__wrapper">
          {
            this.props.biddersUsed.map(
              (row, idx) => {
                return(
                  <BiddersMapBidder
                    biddersUsed={this.props.biddersUsed}
                    key={idx}
                    biddersList={row.list}
                    checked={this.props.biddersUsed[idx].checked}
                    index={idx}
                    campaignIdInput={this.props.campaignIdInput}
                    biddersNameInput={this.props.biddersNameInput}
                    bidderSelect={this.props.bidderSelect}
                    removeBidder={this.props.removeBidder}
                  />
                )
              }
            )
          }
        <Button 
          view="action" 
          size="m"
          className="bidders-map__add-button"
          disabled={this.props.buttonDisabled}
          onClick={this.props.addBidder}
        >
          Добавить биддера
        </Button>
      </div>
    )
  }
}

export default BiddersMap;
