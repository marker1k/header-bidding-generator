import React from 'react';
import shortid from 'shortid';
import AdUnitBidders from './AdUnitBidders';

import { configureRootTheme } from '@yandex-lego/components/Theme'
import { theme } from '@yandex-lego/components/Theme/presets/default'

import { Button } from '@yandex-lego/components/Button/desktop/bundle'
import { Select } from '@yandex-lego/components/Select/desktop/bundle'
import { Textinput } from '@yandex-lego/components/Textinput/desktop/bundle'

configureRootTheme({ theme })

class AdUnitsUnit extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.adUnitsUsed[this.props.index].bidders !== prevProps.adUnitsUsed[this.props.index].bidders) {
      this.props.clearSizesWhenNoBiddersAdded(this.props.index);
      // Дизейблим кнопку добавить биддера, когда больше нет доступных биддеров для добавления
      this.props.disableAddBidderButton(this.props.index);
    }
  }
  render() {
    let index = this.props.index;
    let adUnitsUsed = this.props.adUnitsUsed;
    return (
      <div key={this.props.idx} className="ad-units__item">
        <div className="ad-units__close-button">
          <Button view="action" size="m"
            onClick={(e) => {this.props.removeAdUnit(e, index)}}
          >
            ✕
          </Button>
        </div>
      <div className="ad-units-options">
        {/* <p className="ad-units-options__container-id-label">ID контейнера:</p> */}
        <div className="ad-units-options__container-id-input">
          <Textinput
            baseline="true"
            size="m"
            view="default"
            placeholder="ID контейнера"
            value={adUnitsUsed[index].containerId}
            state={adUnitsUsed[index].state}
            hint={adUnitsUsed[index].hint}
            onChange={(e) => {this.props.containerIdInput(e, index)}}
          />  
        </div>
        <p className="ad-units-options__code-type-label">codeType:</p>
        <div className="ad-units-options__code-type-select">
          <Select
            key={shortid.generate()}
            baseline="true"
            size="m"
            view="default"
            onChange={(e) => {this.props.codeTypeSelect(e, index)}}
            value={adUnitsUsed[this.props.index].codeType}
            options={this.props.codeTypes}
          />
        </div>
        {(adUnitsUsed[index].sizes !== undefined && adUnitsUsed[index].codeType !== 'instream') && 
          <div className="ad-units-options__sizes">
            <Textinput
              size="m"
              view="default"
              placeholder="Sizes"
              value={adUnitsUsed[index].sizes}
              state={adUnitsUsed[index].sizesState}
              hint={adUnitsUsed[index].sizesHint}
              onChange={(e) => {this.props.sizesInput(e, index)}}
            />
          </div>
        }
      </div>
        <div className="adUnitBidders">
          {
            adUnitsUsed[index].bidders.map(
              (row, idx) => {
                return(
                  <AdUnitBidders
                    key={idx}
                    adUnitIndex={index}
                    bidderIndex={idx}
                    adUnitsUsed={adUnitsUsed}
                    biddersMap={this.props.biddersMap}
                    adUnitBidderSelect={this.props.adUnitBidderSelect}
                    placementIdInput={this.props.placementIdInput}
                    adfoxParamsInput={this.props.adfoxParamsInput}
                    biddersList={this.props.biddersList}
                    codeType={this.props.adUnitsUsed[this.props.index].codeType}
                    removeBidderFromAdUnit={this.props.removeBidderFromAdUnit}
                    requireSizes={this.props.requireSizes}
                    adBreakTypeHandler={this.props.adBreakTypeHandler}
                  />
                  )
                }
              )
            }
        </div>
        <div className="ad_units__button">
          <Button view="action" size="m"
            onClick={(e) => {this.props.addBiddertoUnit(e, index)}}
            disabled={adUnitsUsed[index].addButtonDisabled}
            >
            Добавить биддера
          </Button>
        </div>
      </div>
    )
  }
}

export default AdUnitsUnit;
