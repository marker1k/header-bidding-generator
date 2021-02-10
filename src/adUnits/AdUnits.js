import React from 'react';
import AdUnitsUnit from './AdUnitsUnit';

import { configureRootTheme } from '@yandex-lego/components/Theme'
import { theme } from '@yandex-lego/components/Theme/presets/default'
import { Button } from '@yandex-lego/components/Button/desktop/bundle'

configureRootTheme({ theme })

class AdUnits extends React.Component {
  render() {
    return (
      <div className="ad-units__wrapper">
        {
          this.props.adUnitsUsed.map(
            (row, idx) => {
              return(
                <AdUnitsUnit
                  adUnitsUsed={this.props.adUnitsUsed}
                  biddersMap={this.props.biddersMap}
                  key={idx}
                  index={idx}
                  codeTypeSelect={this.props.codeTypeSelect}
                  codeTypes={this.props.codeTypes}
                  containerIdInput={this.props.containerIdInput}
                  addBiddertoUnit={this.props.addBiddertoUnit}
                  adUnitBidderSelect={this.props.adUnitBidderSelect}
                  placementIdInput={this.props.placementIdInput}
                  adfoxParamsInput={this.props.adfoxParamsInput}
                  biddersList={this.props.biddersList}
                  removeBidderFromAdUnit={this.props.removeBidderFromAdUnit}
                  removeAdUnit={this.props.removeAdUnit}
                  requireSizes={this.props.requireSizes}
                  clearSizesWhenNoBiddersAdded={this.props.clearSizesWhenNoBiddersAdded}
                  disableAddBidderButton={this.props.disableAddBidderButton}
                  sizesInput={this.props.sizesInput}
                  adBreakTypeHandler={this.props.adBreakTypeHandler}
                  />
                )
              }
            )
          }
        <Button view="action" size="m" disabled={this.props.buttonDisabled}
          onClick={this.props.addUnit}
          >
          Добавить контейнер
        </Button>
      </div>
    )
  }
}

export default AdUnits;
