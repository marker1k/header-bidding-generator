import React from 'react';
import {list} from './bidderList/bidderList.js';
import BiddersMap from './biddersMap/BiddersMap';
import AdUnits from './adUnits/AdUnits';
import './App.css';
import './blocks/bidders-map.css';
import './blocks/ad-units.css';

import { configureRootTheme } from '@yandex-lego/components/Theme'
import { theme } from '@yandex-lego/components/Theme/presets/default'
import { Button } from '@yandex-lego/components/Button/desktop/bundle'

 const codeTypes = [
   { value: 'banner', content: 'Banner' },
   { value: 'combo', content: 'Combo' },
   { value: 'inpage', content: 'InPage' },
   { value: 'instream', content: 'InStream' }
 ]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.bidderSelect = this.bidderSelect.bind(this);
    this.campaignIdInput = this.campaignIdInput.bind(this);
    this.biddersNameInput = this.biddersNameInput.bind(this);
    this.removeBidder = this.removeBidder.bind(this);
    this.addUnit = this.addUnit.bind(this);
    this.codeTypeSelect = this.codeTypeSelect.bind(this);
    this.containerIdInput = this.containerIdInput.bind(this);
    this.addBiddertoUnit = this.addBiddertoUnit.bind(this);
    this.adUnitBidderSelect = this.adUnitBidderSelect.bind(this);
    this.placementIdInput = this.placementIdInput.bind(this);
    this.adfoxParamsInput = this.adfoxParamsInput.bind(this);
    this.removeBidderFromAdUnit = this.removeBidderFromAdUnit.bind(this);
    this.removeAdUnit = this.removeAdUnit.bind(this);
    this.requireSizes = this.requireSizes.bind(this);
    this.clearSizesWhenNoBiddersAdded = this.clearSizesWhenNoBiddersAdded.bind(this);
    this.disableAddBidderButton = this.disableAddBidderButton.bind(this);
    this.enableAddBidderButtons = this.enableAddBidderButtons.bind(this);
    this.sizesInput = this.sizesInput.bind(this);
    this.adBreakTypeHandler = this.adBreakTypeHandler.bind(this);
    this.state = {
      biddersMapButtonDisabled: false,
      adUnitsButtonDisabled: false,
      biddersMap: [{"list":[{"value":"default","content":"---"},{"value":"criteo","content":"Criteo"},{"value":"adriver","content":"Soloway"},{"value":"hpmd","content":"HPMD"},{"value":"buzzoola","content":"Buzzoola"},{"value":"myTarget","content":"Mytarget"},{"value":"facebook","content":"Facebook"},{"value":"betweenDigital","content":"Between Digital"},{"value":"aio","content":"All in One Media"},{"value":"getintent","content":"GetIntent"},{"value":"tinkoff","content":"Tinkoff"},{"value":"videonow","content":"Videonow"},{"value":"rtbhouse","content":"RTB House"},{"value":"relap","content":"Relap"},{"value":"pladform","content":"Pladform"},{"value":"alfasense","content":"Alfasense"},{"value":"fotostrana","content":"Fotostrana"},{"value":"hybrid","content":"Hybrid"},{"value":"mgid","content":"Mgid"},{"value":"dgt_ssp","content":"DGT SSP"},{"value":"adspend","content":"ADSPEND"},{"value":"mediatoday","content":"MediaToday"},{"value":"redllama","content":"Redllama"},{"value":"qvant_dsp","content":"Qvant DSP"},{"value":"adfox","content":"ADFOX HB"}],
      "checked":"criteo","value":"1234","state":"","hint":""}],
      adUnits: [{"addButtonDisabled": false, "containerId":"13123123123","codeType":"banner", "state": "", "hint": "","bidders":[{"checked":"criteo","placementId":"99999"}]}]
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.biddersMap !== prevState.biddersMap) {
      this.enableAddBidderButtons();
    }
  }

  bidderSelect = (event, index) => {
    // Обработчик смены биддера в выпадающем меню
    this.setState(prevState => {
      const biddersMap = prevState.biddersMap.map((item, idx) => {
        if (idx === index) {
          // Указываем что-выбран конкретный биддер
          if (event.target.value === "adfox") {
            return Object.assign({}, item, {checked: event.target.value, biddersName: ""});
          } else {
            return Object.assign({}, item, {checked: event.target.value});
          }
        } else {
          // Если выбран какой-то конкретный, то в остальных он не должен присутствовать (кроме ADFOX)
          let modifiedList = item.list.filter(i => {
            return i.value !== event.target.value || i.value === "adfox"
          });
          return Object.assign({}, item, {list: modifiedList});
        }
      })
      // Записываем модифицированные rows в state
      return {biddersMap};
    });
  }

  campaignIdInput = (event, index) => {
    event.persist();
    let currentCmpaignId = event.target.value.trim();
    this.setState(prevState => {
      let usedCampaignIds = this.state.biddersMap.map((bidder, idx) => {if (index !== idx) {return bidder.value}});
      const biddersMap = prevState.biddersMap.map((item, idx) => {
        // Если idx в map совпадает с index ноды, то меняем value
        if (idx === index) {
          // Если такой id уже есть, то подсвечиваем поле как error
          if (usedCampaignIds.includes(currentCmpaignId)) {
            return Object.assign({}, item, {value: currentCmpaignId, state: "error", hint: "Такой id уже используется"});
          } else {
            return Object.assign({}, item, {value: currentCmpaignId, state: "", hint: ""});
          }
        // Остальные оставляем без изменений
        } else {
          return item;
        }
      })
      // Записываем модифицированные rows в state
      return {biddersMap};
    });
  }

  addBidder = (bidder, campaignId) => {
    // Смотрим какие биддеры выбраны в данный момент и добавляем их в массив использованных
    let used = this.state.biddersMap.map((elem) => {
      // --- и adfox дожны быть в списке всегда
      if (elem.checked !== "default" && elem.checked !== "adfox") {
        return elem.checked;
      }
    });
    // Отрисовываем биддеров в выпадающее меню
    let biddersList = Object.keys(list).map((bidder) => {
      if (!used.includes(bidder)) {
        return {content: list[bidder].value, value: bidder};
      }
    })
    // Что-то отфильровываем (?)
    .filter(e => e !== undefined);
    this.setState((prevState) => ({
    // Checked -- это биддер, который выбран в данный момент в row. value -- campaignId
      biddersMap: [...prevState.biddersMap, {list: biddersList, checked: "default", value: "", state: "", hint: ""}]
    }));
  }

  biddersNameInput = (event, idx) => {
    event.persist();
    const index = idx;
    this.setState(prevState => {
      let usedBidderNames = this.state.biddersMap.map((bidder, index) => {if (index !== idx) {return bidder.biddersName}});
      const biddersMap = prevState.biddersMap.map((item, idx) => {
        if (idx === index) {
          if (usedBidderNames.includes(event.target.value)) {
            return Object.assign({}, item, {biddersName: event.target.value, biddersNameState: "error", biddersNameHint: "Логин уже используется"});
          } else {
            return Object.assign({}, item, {biddersName: event.target.value, biddersNameState: "", biddersNameHint: ""});
          }
        } else {
          return item;
        }
      })
      return {biddersMap};
    });
  }

  removeBidder = (index) => {
    this.setState(prevState => {
      const biddersMap = prevState.biddersMap.filter((item, idx) => index !== idx);
      return { biddersMap };
    });
  }

  addUnit = (containerId) => {
    this.setState((prevState) => ({
      adUnits: [...prevState.adUnits, { containerId: "", addButtonDisabled: false, codeType: "banner", state: "", hint: "", bidders: [] }]
    }));
  }

  codeTypeSelect = (event, idx) => {
    // const index = idx;
    this.setState(prevState => {
      const adUnits = prevState.adUnits.map((item, index) => {
        if (idx === index) {
          return Object.assign({}, item, {codeType: event.target.value});
        } else {
          return item;
        }
      })
      return {adUnits};
    });
  }

  // let biddersList = Object.keys(list).map((bidder) => {
  //   if (!used.includes(list[bidder].value)) {
  //     return {content: list[bidder].value, value: bidder};
  //   }
  // })

  // -------  old version  --------
  // let requireSizesList = list.map((elem) => {
  //   if (elem.requireSizes) {
  //     return elem.value;
  //   }
  // }).filter(item => item !== undefined);

  requireSizes = (adUnitIndex) => {
    let requireSizesList = Object.keys(list).map((bidder) => {
      if (list[bidder].requireSizes) {
        return bidder;
      }
    }).filter(e => e !== undefined);;

    let currentAdUnitBidders = this.state.adUnits[adUnitIndex].bidders.map((elem) => {
      return elem.checked;
    });
    // console.log(requireSizesList);
    // console.log(currentAdUnitBidders);

    const compareArraysWithSome = (arr1, arr2) => {
        const [smallArray, bigArray] =
          arr1.length < arr2.length ? [arr1, arr2] : [arr2, arr1];
        return smallArray.some(c => bigArray.includes(c));
    };

    if ( compareArraysWithSome(requireSizesList, currentAdUnitBidders) ) {
      this.setState(prevState => {
        const adUnits = prevState.adUnits.map((item, index) => {
          if (adUnitIndex === index) {
            return Object.assign({}, item, {sizes: []});
          } else {
            return item;
          }
        })
        return {adUnits};
      });
    } else {
      this.setState(prevState => {
        const adUnits = prevState.adUnits.map((item, index) => {
          if (adUnitIndex === index) {
            return Object.assign({}, item, {sizes: undefined});
          } else {
            return item;
          }
        })
        return {adUnits};
      });
    }
  }

  clearSizesWhenNoBiddersAdded = (adUnitIndex) => {
    if (this.state.adUnits[adUnitIndex].bidders.length === 0) {
      this.setState(prevState => {
        const adUnits = prevState.adUnits.map((item, index) => {
          if (adUnitIndex === index) {
            return Object.assign({}, item, {sizes: undefined});
          } else {
            return item;
          }
        })
        return {adUnits};
      });
    }
  }

  disableAddBidderButton = (adUnitIndex) => {
    const biddersMapLength = this.state.biddersMap.length;
    const currentAdUnitBiddersLength = this.state.adUnits[adUnitIndex].bidders.length;
    if (currentAdUnitBiddersLength >= biddersMapLength) {
      this.setState(prevState => {
        const adUnits = prevState.adUnits.map((item, index) => {
          if (adUnitIndex === index) {
            return Object.assign({}, item, {addButtonDisabled: true});
          } else {
            return item;
          }
        })
        return {adUnits};
      });
    } else {
      this.setState(prevState => {
        const adUnits = prevState.adUnits.map((item, index) => {
          if (adUnitIndex === index) {
            return Object.assign({}, item, {addButtonDisabled: false});
          } else {
            return item;
          }
        })
        return {adUnits};
      });
    }
  }

  enableAddBidderButtons = () => {
    this.setState(prevState => {
      const adUnits = prevState.adUnits.map((item) => {
        return Object.assign({}, item, {addButtonDisabled: false});
      })
      return {adUnits};
    });
  }

  containerIdInput = (event, idx) => {
    event.persist();
    this.setState(prevState => {
      let containerIdUsed = prevState.adUnits.map((adUnit, index) => {if (index !== idx) {return adUnit.containerId}});
      const adUnits = prevState.adUnits.map((item, index) => {
        if (idx === index) {
          if (containerIdUsed.includes(event.target.value)) {
            return Object.assign({}, item, {containerId: event.target.value, state: "error", hint: "ID контейнера уже используется"});
          } else {
            return Object.assign({}, item, {containerId: event.target.value, state: "", hint: ""});
          }
        } else {
          return item;
        }
      })
      return {adUnits};
    });
  }

  sizesInput = (event, adUnitId) => {
    event.persist();
    this.setState(prevState => {
      const adUnits = prevState.adUnits.map((item, index) => {
        if (adUnitId === index) {
          return Object.assign({}, item, {sizes: event.target.value});
        } else {
          return item;
        }
      })
      return {adUnits};
    });
  }

  removeAdUnit = (e, adUnitIndex) => {
    this.setState(prevState => {
      const adUnits = prevState.adUnits.filter((item, idx) => adUnitIndex !== idx);
      return { adUnits };
    });
  }

  addBiddertoUnit = (event, idx) => {
    // const index = idx;
    this.setState(prevState => {
      const adUnits = prevState.adUnits.map((item, index) => {
        if (idx === index) {
          // { checked: "", list: [ { value: 'default', content: '---' }, { value: 'banner', content: 'Banner' }, { value: 'banner', content: 'Banner' } ] }
          // [...prevState.biddersMap, {list: biddersList, checked: "default", value: ""}]
          if (prevState.adUnits[index].codeType === "instream") {
            return Object.assign({}, item,
              {
                bidders: [...prevState.adUnits[index].bidders,
                {
                  checked: "",
                  placementId: "",
                  adBreakTypes: {
                    preroll: false,
                    midroll: false,
                    postroll: false
                  } 
                }
                ]
              }
            );
          } else {
            return Object.assign({}, item,
              {
                bidders: [...prevState.adUnits[index].bidders,
                {
                  checked: "",
                  placementId: ""
                }
                ]
              }
            );
          }
        } else {
          return item;
        }
      })
      return {adUnits};
    });
  }

  adUnitBidderSelect = (event, adUnitIndex, bidderIndex) => {
    this.setState(prevState => {
      const bidders = prevState.adUnits[adUnitIndex].bidders.map((item, index) => {
        if (bidderIndex === index) {
          return Object.assign({}, item, {checked: event.target.value});
        } else {
          return item;
        }
      });
      const adUnits = prevState.adUnits.map((item, index) => {
        if (adUnitIndex === index) {
          return Object.assign({}, item, {bidders});
        } else {
          return item;
        }
      });
      return {adUnits};
    });

    // let requireSizesList = list.map((elem) => {
    //   if (elem.requireSizes) {
    //     return elem.value;
    //   }
    // }).filter(item => item !== undefined);

    // let requireSizesList = Object.keys(list).map((bidder) => {
    //   if (list[bidder].requireSizes) {
    //     return bidder;
    //   }
    // });
  }

  placementIdInput = (event, adUnitIndex, bidderIndex) => {
    event.persist();
    this.setState(prevState => {
      const bidders = prevState.adUnits[adUnitIndex].bidders.map((item, index) => {
        if (bidderIndex === index) {
          return Object.assign({}, item, {placementId: event.target.value});
        } else {
          return item;
        }
      });
      const adUnits = prevState.adUnits.map((item, index) => {
        if (adUnitIndex === index) {
          return Object.assign({}, item, {bidders});
        } else {
          return item;
        }
      });
      return {adUnits};
    });
  }

  adfoxParamsInput = (event, adUnitIndex, bidderIndex) => {
    event.persist();
    let adfoxCode = event.target.value;
    const parser = new DOMParser();
    let parsedAdfoxCode = parser.parseFromString(adfoxCode, "text/html");
    let adfoxParamsParsed;
    parsedAdfoxCode.querySelectorAll("script").forEach((element, index, array) => {
      if (element.innerText.includes("adfoxCode")) {
        adfoxParamsParsed = eval(array[index].innerText);
      }  
    });
    
    this.setState(prevState => {
      const bidders = prevState.adUnits[adUnitIndex].bidders.map((item, index) => {
        if (bidderIndex === index) {
          return Object.assign({}, item, {params: adfoxParamsParsed.params});
        } else {
          return item;
        }
      });
      const adUnits = prevState.adUnits.map((item, index) => {
        if (adUnitIndex === index) {
          return Object.assign({}, item, {bidders});
        } else {
          return item;
        }
      });
      return {adUnits};
    });
  }

  removeBidderFromAdUnit = (adUnitIndex, bidderIndex) => {
    this.setState(prevState => {
      const bidders = prevState.adUnits[adUnitIndex].bidders.filter((item, idx) => bidderIndex !== idx);

      const adUnits = prevState.adUnits.map((item, index) => {
        if (adUnitIndex === index) {
          return Object.assign({}, item, {bidders});
        } else {
          return item;
        }
      });
      return {adUnits};
    });
  }

  adBreakTypeHandler = (e, adUnitIndex, bidderIndex) => {
    e.persist();
    this.setState(prevState => {
      const bidders = prevState.adUnits[adUnitIndex].bidders.map((item, index) => {
        if (bidderIndex === index) {
          return Object.assign({}, item, {adBreakType: e.target.name});
        } else {
          return item;
        }
      });

      const adUnits = prevState.adUnits.map((item, index) => {
        if (adUnitIndex === index) {
          return Object.assign({}, item, {bidders});
        } else {
          return item;
        }
      });

      return {adUnits};
    });
  }

  render() {
    return (
      <div className="main-wrapper">
        <div className="bidders-map">
          <h2 className="bidders-map__heading">Bidders Map</h2>
            <BiddersMap
              adUnitsUsed={this.state.adUnits}
              availableBidders={list}
              biddersUsed={this.state.biddersMap}
              addBidder={this.addBidder}
              campaignIdInput={this.campaignIdInput}
              bidderSelect={this.bidderSelect}
              biddersNameInput={this.biddersNameInput}
              removeBidder={this.removeBidder}
              buttonDisabled={this.state.biddersMapButtonDisabled}
            />
        </div>

        <div className="ad-units">
          <h2>Ad Units</h2>
          <AdUnits
            buttonDisabled={this.state.adUnitsButtonDisabled}
            adUnitsUsed={this.state.adUnits}
            biddersMap={this.state.biddersMap}
            addUnit={this.addUnit}
            codeTypes={codeTypes}
            codeTypeSelect={this.codeTypeSelect}
            containerIdInput={this.containerIdInput}
            addBiddertoUnit={this.addBiddertoUnit}
            adUnitBidderSelect={this.adUnitBidderSelect}
            placementIdInput={this.placementIdInput}
            biddersList={list}
            removeAdUnit={this.removeAdUnit}
            removeBidderFromAdUnit={this.removeBidderFromAdUnit}
            requireSizes={this.requireSizes}
            clearSizesWhenNoBiddersAdded={this.clearSizesWhenNoBiddersAdded}
            disableAddBidderButton={this.disableAddBidderButton}
            sizesInput={this.sizesInput}
            adBreakTypeHandler={this.adBreakTypeHandler}
            adfoxParamsInput={this.adfoxParamsInput}
          />
          <button onClick={()=>{console.log(this.state)}}>Show state</button>
        </div>

        <div className="result">
          <textarea className="result__code"></textarea>
        </div>
        <Button view="action" size="m" className="result__button">
            Сгенерировать
        </Button>

        
      </div>
    )
  }
}

export default App;
