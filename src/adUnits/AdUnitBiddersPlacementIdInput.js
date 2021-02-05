import React from 'react';
import { Textinput } from '@yandex-lego/components/Textinput/desktop/bundle'

class AdUnitBiddersPlacementIdInput extends React.Component {
    render() {
        let adUnitIndex = this.props.adUnitIndex;
        let bidderIndex = this.props.bidderIndex;
        let adUnitsUsed = this.props.adUnitsUsed;
        return(
            <div className="ad-units-bidder__placement-id-input">
            <p className="ad-units-bidder__placement-id-label">placementId:</p>
            <Textinput
              baseline="true"
              width="max"
              size="m"
              view="default"
              value={adUnitsUsed[adUnitIndex].placementId}
              onChange={(e) => {this.props.placementIdInput(e, adUnitIndex, bidderIndex)}}
            />
          </div>
        )
    }
}

export default AdUnitBiddersPlacementIdInput;