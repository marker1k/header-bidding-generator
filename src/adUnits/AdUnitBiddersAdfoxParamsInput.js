import React from 'react';
import { Textarea } from '@yandex-lego/components/Textarea/desktop/bundle'

class AdUnitBiddersAdfoxParamsInput extends React.Component {
    render() {
        let adUnitIndex = this.props.adUnitIndex;
        let bidderIndex = this.props.bidderIndex;
        let adUnitsUsed = this.props.adUnitsUsed;
        return(
            <div className="ad-units-bidder__adfox-params-input">
            <p className="ad-units-bidder__adfox-params-label">Код вставки:</p>
            <Textarea
              baseline="true"
              width="max"
              size="m"
              view="default"
              value={adUnitsUsed[adUnitIndex].placementId}
              onChange={(e) => {this.props.adfoxParamsInput(e, adUnitIndex, bidderIndex)}}
            />
          </div>
        )
    }
}

export default AdUnitBiddersAdfoxParamsInput;