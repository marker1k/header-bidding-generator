import React from 'react';
import {list} from './bidderList/bidderList.js';
import BiddersMap from './biddersMap/BiddersMap';
import AdUnits from './adUnits/AdUnits';
import TrustedOwners from './trustedOwners/TrustedOwners';
import UserTimeout from './userTimeout/UserTimeout';

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
    this.trustedOwnersInput = this.trustedOwnersInput.bind(this);
    this.userTimeoutInput = this.userTimeoutInput.bind(this);
    this.state = {
      biddersMap: [],
      adUnits: [],
      addUnitButtonDisabled: true,
      generateButtonDisabled: true,
      trustedOwners: {
        value: "",
        state: "",
        hint: ""
      },
      userTimeout: {
        value: "1000"
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.biddersMap !== prevState.biddersMap) {
      this.enableAddBidderButtons();
      this.toggleAddUnitButton();
    }
    if (this.state.adUnits !== prevState.adUnits) {
      this.toggleGenerateButton();
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
          if (usedCampaignIds.includes(currentCmpaignId) && currentCmpaignId !== "") {
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

  requireSizes = (adUnitIndex) => {
    let requireSizesList = Object.keys(list).map((bidder) => {
      if (list[bidder].requireSizes) {
        return bidder;
      }
    }).filter(e => e !== undefined);;

    let currentAdUnitBidders = this.state.adUnits[adUnitIndex].bidders.map((elem) => {
      return elem.checked;
    });

    const compareArraysWithSome = (arr1, arr2) => {
        const [smallArray, bigArray] =
          arr1.length < arr2.length ? [arr1, arr2] : [arr2, arr1];
        return smallArray.some(c => bigArray.includes(c));
    };

    if ( compareArraysWithSome(requireSizesList, currentAdUnitBidders) ) {
      this.setState(prevState => {
        const adUnits = prevState.adUnits.map((item, index) => {
          if (adUnitIndex === index) {
            if (item.sizes === undefined) {
              return Object.assign({}, item, {sizes: []});
            } else {
              return item;
            }
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

  disableAddBidderButton = (adUnitIndex, codeType) => {
    const biddersMapLength = this.state.biddersMap.length;
    const currentAdUnitBiddersLength = this.state.adUnits[adUnitIndex].bidders.length;
    // if (currentAdUnitBiddersLength >= biddersMapLength)
    // debugger;
    // const bidderInBidMap = this.state.biddersMap.map((bidder) => {
    //   return bidder.checked;
    // });
    // const biddersAvailableForThisCodeType = Object.keys(list).map((bidder) => {
    //   if (bidderInBidMap.includes(bidder) && list[bidder].codeTypes.includes(codeType)) {
    //     return bidder;
    //   }
    // }).filter((elem) => {return elem !== undefined});
    // console.log(bidderInBidMap);
    // console.log(biddersAvailableForThisCodeType);

    //if (biddersAvailableForThisCodeType.length >= bidderInBidMap.length)
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
          if (containerIdUsed.includes(event.target.value) && event.target.value !== "") {
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
          try {
            JSON.parse(`[${event.target.value}]`);
            return Object.assign({}, item, {sizes: event.target.value, sizesState: "", sizesHint: ""});
          } catch (e) {
            return Object.assign({}, item, {sizes: event.target.value, sizesState: "error", sizesHint: "Некорректно заполнено поле"});
          }
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
                  state: "", 
                  hint: "",
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
                  placementId: "",
                  state: "", 
                  hint: ""
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
  }

  placementIdInput = (event, adUnitIndex, bidderIndex) => {
    event.persist();
    this.setState(prevState => {
      const bidders = prevState.adUnits[adUnitIndex].bidders.map((item, index) => {

        let anotherBidsOfThisBidder = this.state.adUnits.filter((adUnit, index) => {
          return index !== adUnitIndex}
        ).map((unit) => {
          return unit.bidders;
        }).flat();

        if (bidderIndex === index) {
          if (anotherBidsOfThisBidder.some(elem => elem.placementId === event.target.value) && event.target.value !== "") {
            return Object.assign({}, item, {placementId: event.target.value, state: "error", hint: "Такой placementId уже используется"});
          } else {
            return Object.assign({}, item, {placementId: event.target.value, state: "", hint: ""});
          }
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
    if (adfoxCode !== "") {
      parsedAdfoxCode.querySelectorAll("script").forEach((element, index, array) => {
        if (element.innerText.includes("adfoxCode")) {
          eval(array[index].innerText);
          let str = window.yaContextCb[0].toString();
          adfoxParamsParsed = eval(str.slice(5).slice(0, -1));
          window.yaContextCb = [];
        }  
      });
    } else {
      adfoxParamsParsed = {};
      adfoxParamsParsed.params = "";
    }
    
    this.setState(prevState => {
      const bidders = prevState.adUnits[adUnitIndex].bidders.map((item, index) => {
        if (bidderIndex === index) {
          if (adfoxParamsParsed === undefined) {
            return Object.assign({}, item, {params: "", paramsState: "error", paramsHint: "Введите код вставки ADFOX полностью", adfoxCodeRaw: adfoxCode});
          } else {
            return Object.assign({}, item, {params: adfoxParamsParsed.params, paramsState: "", paramsHint: "", adfoxCodeRaw: adfoxCode});
          }
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
    console.log(e.target.checked);
    this.setState(prevState => {
      const bidders = prevState.adUnits[adUnitIndex].bidders.map((item, index) => {
        if (bidderIndex === index) {
          // return Object.assign({}, item, {adBreakType: e.target.name});
          if (e.target.checked) {
            return {
              ...item,
              adBreakTypes: {
                ...item.adBreakTypes,
                [e.target.name]: true
              }
            }
          } else {
            return {
              ...item,
              adBreakTypes: {
                ...item.adBreakTypes,
                [e.target.name]: false
              }
            }
          }
          
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

  trustedOwnersInput = (e) => {
    const trustedOwners = {...this.state.trustedOwners};
    const input = e.target.value;
    if (!/(^\d+$)|(^\d+(?:,\d+)+$)/.test(input) && input !=="") {
      trustedOwners.state = "error";
      trustedOwners.hint = "Введите id кампании(й) через запятую";
      this.setState({trustedOwners});
    } else {
      trustedOwners.state = "";
      trustedOwners.hint = "";
      this.setState({trustedOwners});
    }
    trustedOwners.value = input;
    this.setState({trustedOwners});
  }

  userTimeoutInput = (e) => {
    const userTimeout = {...this.state.userTimeout};
    const input = e.target.value;
    userTimeout.value = input;
    this.setState({userTimeout});
  }

  handleGenerateButtonClick = () => {
    const biddersMap = this.state.biddersMap;
    const adUnits = this.state.adUnits;
    const trustedOwners = this.state.trustedOwners;
    const userTimeout = this.state.userTimeout.value;
    // Валидация id кампании
    if (biddersMap.some((elem) => elem.state === 'error')) {
      this.showError("Bidders Map", "Исправьте все ошибки в biddersMap");
      return;
    }

    if (biddersMap.some((bidder) => bidder.checked === "default")) {
      this.showError("Bidders Map", "Проверьте, что во всех позициях выбран биддер");
      return;
    }

    if (biddersMap.some((bidder) => bidder.value === "")) {
      this.showError("Bidders Map", "Проверьте, что во всех позициях указан id кампании");
      return;
    }

    if (adUnits.some((elem) => elem.state === 'error')) {
      // alert("Исправьте все ошибки в adUnits");
      this.showError("Ad Units", "Исправьте все ошибки в Ad Units");
      return;
    }

    if (adUnits.some((elem) => elem.bidders.length === 0)) {
      // alert("adUnit не может быть без биддеров");
      this.showError("Ad Units", "Ad Unit не может быть без биддеров");
      return;
    }

    if (adUnits.some((elem) => elem.containerId === "")) {
      // alert("Проверьте, что во всех adUnit заполнен Id контейнера");
      this.showError("Ad Units", "Проверьте, что во всех adUnit заполнен Id контейнера");
      return;
    }

    if (adUnits.some((elem) => elem.codeType !== 'instream' && elem.sizes !== undefined && elem.sizes.length === 0)) {
      // alert("Проверьте, что во всех adUnit заполнен Id контейнера");
      this.showError("Ad Units", "Проверьте, что во всех adUnit заполнено поле sizes");
      return;
    }

    if (adUnits.some((elem) => elem.sizesState === 'error')) {
      // alert("Проверьте, что во всех adUnit заполнен Id контейнера");
      this.showError("Ad Units", "Исправьте ошибки заполнения полей sizes");
      return;
    }

    const flattedBidders = adUnits.map((adUnit) => {
      return adUnit.bidders;
    }).flat();

    if (flattedBidders.some((elem) => elem.checked === "")) {
      // alert("Проверьте, что во всех adUnit выбраны все биддеры");
      this.showError("Ad Units", "Проверьте, что во всех adUnit выбраны биддеры");
      return;
    }

    if (flattedBidders.some((elem) => elem.placementId === "" && elem.params === undefined)) {
      console.log(flattedBidders);
      this.showError("Ad Units", "Проверьте, что во всех adUnit заполнены placementId биддеров");
      return;
    }

    if (flattedBidders.some((elem) => elem.placementId === "" && Object.keys(elem.params).length === 0)) {
      console.log(flattedBidders);
      this.showError("Ad Units", "Проверьте, что во всех adUnit заполнены коды вставки ADFOX");
      return;
    }

    if (flattedBidders.some((elem) => elem.state === "error")) {
      this.showError("Ad Units", "Исправьте все ошибки в Ad Units");
      return;
    }

    if (flattedBidders.some((elem) => elem.adBreakTypes !== undefined && elem.adBreakTypes.preroll === false && elem.adBreakTypes.midroll === false && elem.adBreakTypes.postroll === false)) {
      this.showError("Ad Units", "В instream adUnit должен быть выбран хотя бы один adBreakType");
      return;
    }

    if (trustedOwners.value !== "") {
      if (trustedOwners.state === "error") {
        // alert("Исправьте ошибку в Trusted Owners");
        this.showError("Trusted Owners", "Исправьте ошибку в Trusted Owners");
        return;
      }
    }

    const resultElement = document.querySelector(".result__code");
    // Формируем biddersMaps
    const newBiddersMap = {};
    biddersMap.forEach((elem) => {
      if (elem.checked === "adfox") {
        newBiddersMap[`adfox_${elem.biddersName}`] = elem.value;
      } else {
        newBiddersMap[elem.checked] = elem.value;
      }
    });
    // Формируем adUnits
    const newAdUnits = adUnits.map((unitElem) => {
      const codeType = unitElem.codeType;
      let adUnit = {
          code: unitElem.containerId
      };
      if (codeType !== "banner") {
        adUnit.codeType = codeType;
      }
      if (unitElem.sizes !== undefined && codeType !== "instream") {
        try {
          adUnit.sizes = JSON.parse(`[${unitElem.sizes}]`);
        } catch (e) {
          this.showError("Sizes", "Некорректно заполнены sizes");
        }
      }
      // Формируем массив bids для adUnit
      adUnit.bids = unitElem.bidders.map((bidElem) => {
          let bid = {
              bidder: bidElem.checked,
          };
          // Если instream, то записываем adBreakTypes
          if (codeType === "instream") {
            bid.adBreakTypes = Object.keys(bidElem.adBreakTypes).map((adBreak) => {
              if (bidElem.adBreakTypes[adBreak] === true) {
                return adBreak;
              } else {
                return false;
              }
            }).filter(e => e !== false);
          }
          // Если это монетизатор adfox, то в params кладём параметры из кода вставки
          if (bidElem.checked.includes("adfox_") === true && bidElem.checked.indexOf("adfox_") === 0) {
            bid.params = Object.assign({}, bidElem.params)
            return bid;
          // Если остальные то в параметрах placementId
          } else {
            bid.params = {};
            bid.params.placementId = bidElem.placementId;
            return bid;
          }
      });
      return adUnit;
    });

    const newBiddersMapBeautifyed = JSON.stringify(newBiddersMap, null, 2);
    const newAdUnitsBeautifyed = JSON.stringify(newAdUnits, null, 2);
    let tail;
    if (this.state.trustedOwners.value !== "") {
      tail = "\n\nwindow.YaHeaderBiddingSettings = {\n  biddersMap: adfoxBiddersMap,\n  adUnits: adUnits,\n  timeout: userTimeout,\n  trustedOwners: [" + this.state.trustedOwners.value + "]\n};"
    } else {
      tail = "\n\nwindow.YaHeaderBiddingSettings = {\n  biddersMap: adfoxBiddersMap,\n  adUnits: adUnits,\n  timeout: userTimeout\n};"
    }
    resultElement.value = 
      `<script async src="https://yandex.ru/ads/system/header-bidding.js"></script>\n<script>\nvar adfoxBiddersMap = ${newBiddersMapBeautifyed};\n\nvar adUnits = ${newAdUnitsBeautifyed};\n\nvar userTimeout = ${userTimeout === "" ? "1000" : userTimeout};${tail}\n</script>\n<script>window.yaContextCb = window.yaContextCb || []</script>\n<script src="https://yandex.ru/ads/system/context.js" async></script>`;
  }

  toggleAddUnitButton = () => {
    if (this.state.biddersMap.length === 0) {
      this.setState({addUnitButtonDisabled: true});
    } else {
      this.setState({addUnitButtonDisabled: false});
    }
  }

  toggleGenerateButton = () => {
    if (this.state.adUnits.length === 0) {
      this.setState({generateButtonDisabled: true});
    } else {
      this.setState({generateButtonDisabled: false});
    }
  }

  showError = (errorTitle, errorText) => {
    const errors = document.querySelector('.errors');
    const title = errors.querySelector('.errors__title');
    const text = errors.querySelector('.errors__text');
    title.textContent = errorTitle;
    text.textContent = errorText;
    errors.style.display = 'flex';
    setTimeout(() => {errors.style.display = 'none'}, 5000)
  };

  render() {
    return (
      <div className="main-wrapper">
        <div className="bidders-map">
          <div className="bidders-map__heading-wrapper">
            <h2 className="bidders-map__heading">Bidders Map</h2>
            <div className="help-icon">&#63;
              <div className="help-popup">Выберите из списка биддеров и укажите для него id рекламной кампании, созданной в вашем аккаунте ADFOX.</div>
            </div>
          </div>
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
          <div className="bidders-map__heading-wrapper">
          <h2 className="ad-units__heading">Ad Units</h2>
            <div className="help-icon">&#63;
              <div className="help-popup">Для каждого рекламного места (контейнера) нажмите кнопку "Добавить биддера" и укажите набор биддеров, участвующих в торгах за показ на этом месте с их placementId.</div>
            </div>
          </div>
          <AdUnits
            buttonDisabled={this.state.addUnitButtonDisabled}
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

          <TrustedOwners 
            trustedOwners={this.state.trustedOwners}
            trustedOwnersInput={this.trustedOwnersInput}
          />

          <UserTimeout 
            userTimeout={this.state.userTimeout}
            userTimeoutInput={this.userTimeoutInput}
          />

          {/* <button onClick={()=>{console.log(this.state)}}>Show state</button> */}
        </div>

        <div className="result">
          <textarea className="result__code"></textarea>
          <Button 
            view="action" 
            size="m" 
            className="result__button"
            disabled={this.state.generateButtonDisabled}
            onClick={(e) => {this.handleGenerateButtonClick()}}
          >
            Сгенерировать
          </Button>
        </div>
        <div className="errors">
          <h2 className="errors__title">Ad Units</h2>
          <p className="errors__text">eiufehrifefuyryr</p>
        </div>
      </div>
    )
  }
}

export default App;
