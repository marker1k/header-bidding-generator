import React from 'react';
import shortid from 'shortid';
import AdUnitBiddersPlacementIdInput from './AdUnitBiddersPlacementIdInput';
import AdUnitBiddersAdfoxParamsInput from './AdUnitBiddersAdfoxParamsInput';

import { configureRootTheme } from '@yandex-lego/components/Theme'
import { theme } from '@yandex-lego/components/Theme/presets/default'

import { Button } from '@yandex-lego/components/Button/desktop/bundle'
import { Select } from '@yandex-lego/components/Select/desktop/bundle'

configureRootTheme({ theme })

class AdUnitBidders extends React.Component {
  componentDidUpdate(prevProps) {
    // prevProps.adUnitsUsed[this.props.adUnitIndex].sizes;
    // prevProps.adUnitsUsed[this.props.adUnitIndex].sizes;
    if (this.props.adUnitsUsed[this.props.adUnitIndex].bidders !== prevProps.adUnitsUsed[this.props.adUnitIndex].bidders) {
      this.props.requireSizes(this.props.adUnitIndex);
    }
  }

  // Функция для генерации списка биддеров при добавлении биддера в adUnit
  getSelectOptions = () => {
    let currentCodeType = this.props.codeType;
    let adUnitIndex = this.props.adUnitIndex;
    let bidderIndex = this.props.bidderIndex;
    // Биддеры, которые добавлены в biddersMap
    let availableBidders = this.props.biddersMap.map((elem => {
      return elem.checked;
    }));
    // Биддеры, которые заиспользованы в текущем adUnit
    let biddersUsedInCurrentAdUnit = this.props.adUnitsUsed[adUnitIndex].bidders.map((elem, idx) => {
      if (idx !== bidderIndex) {
        return elem.checked;
      }
    });
    let list = this.props.biddersList.map((elem) => {
      if (availableBidders.includes(elem.value) === true &&
          biddersUsedInCurrentAdUnit.includes(elem.value) === false &&
          elem.codeTypes.includes(currentCodeType)
        ) {
        return {value: elem.value, content: elem.name}
      }
    }).filter(item => item !== undefined);
    return list
  }

  render() {
    let adUnitIndex = this.props.adUnitIndex;
    let bidderIndex = this.props.bidderIndex;
    let adUnitsUsed = this.props.adUnitsUsed;
    return (
      <div className="ad-units-bidder">
        <div className="ad-units-bidder__options">
          <p className="ad-units-bidder__bidder-label">Bidder:</p>
          <div className="ad-units-bidder__bidder-select">
            <Select
              key={shortid.generate()}
              width="max"
              baseline="true"
              size="m"
              view="default"
              onChange={(e) => {this.props.adUnitBidderSelect(e, adUnitIndex, bidderIndex)}}
              value={adUnitsUsed[adUnitIndex].bidders[bidderIndex].checked}
              options={this.getSelectOptions()}
            />
          </div>
          {adUnitsUsed[adUnitIndex].bidders[bidderIndex].checked === "adfox" ? (
            <AdUnitBiddersAdfoxParamsInput 
              adfoxParamsInput={this.props.adfoxParamsInput}
              adUnitsUsed={this.props.adUnitsUsed}
              bidderIndex={this.props.bidderIndex}
              adUnitIndex={this.props.adUnitIndex}
            />
          ) : (
            <AdUnitBiddersPlacementIdInput 
              placementIdInput={this.props.placementIdInput}
              adUnitsUsed={this.props.adUnitsUsed}
              bidderIndex={this.props.bidderIndex}
              adUnitIndex={this.props.adUnitIndex}
            />
          )}
          <div className="ad-units-bidder__remove-button">
            <Button view="action" size="m"
              onClick={(e) => {this.props.removeBidderFromAdUnit(adUnitIndex, bidderIndex)}}
            >
              ✕
            </Button>
          </div>
        </div>
        {
          adUnitsUsed[adUnitIndex].codeType === "instream" && 
          <div className="ad-units-bidder__ad-breaks">
            <label htmlFor="preroll">Preroll</label>
            <input 
              className="ad-units-bidder__ad-break-input" 
              type="checkbox" 
              id="preroll" 
              name="preroll" 
              checked={adUnitsUsed[adUnitIndex].bidders[bidderIndex].adBreakTypes.preroll} 
              onChange={(e) => {this.props.adBreakTypeHandler(e, adUnitIndex, bidderIndex)}}
            />

            <label htmlFor="midroll">Midroll</label>
            <input 
              className="ad-units-bidder__ad-break-input" 
              type="checkbox" 
              id="midroll" 
              name="midroll" 
              checked={adUnitsUsed[adUnitIndex].bidders[bidderIndex].adBreakTypes.midroll} 
              onChange={(e) => {this.props.adBreakTypeHandler(e, adUnitIndex, bidderIndex)}}
            />

            <label htmlFor="postroll">Postroll</label>
            <input 
              className="ad-units-bidder__ad-break-input" 
              type="checkbox" 
              id="postroll" 
              name="postroll" 
              checked={adUnitsUsed[adUnitIndex].bidders[bidderIndex].adBreakTypes.postroll} 
              onChange={(e) => {this.props.adBreakTypeHandler(e, adUnitIndex, bidderIndex)}}
            />
          </div>
        }
      </div>
    )
  }
}

export default AdUnitBidders;
