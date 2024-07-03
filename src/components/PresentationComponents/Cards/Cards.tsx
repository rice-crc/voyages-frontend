import { Card, Collapse } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  setCardDataArray,
  setCardFileName,
  setIsModalCard,
} from '@/redux/getCardFlatObjectSlice';
import { processCardData } from '@/utils/functions/processCardData';
// Voyages Card
import CARDS_TRANSATLANTIC_COLLECTION from '@/utils/flatfiles/voyages/voyages_transatlantic_card.json';
import CARDS_INTRAAMERICAN_COLLECTION from '@/utils/flatfiles/voyages/voyages_intraamerican_card.json';
import CARDS_ALLVOYAGES_COLLECTION from '@/utils/flatfiles/voyages/voyages_all_card.json';
// Enslaved Card
import CARDS_ENSLAVED_african_origins from '@/utils/flatfiles/enslaved/enslaved_african_origins_card.json';
import CARDS_ALLENSLAVED from '@/utils/flatfiles/enslaved/enslaved_all_card_menu.json';
import CARDS_TEXAS_ENSLAVED from '@/utils/flatfiles/enslaved/enslaved_texas_card.json';
// Enslavers Card
import CARDS_ENSLAVERS_COLLECTION from '@/utils/flatfiles/enslavers/enslavers_card.json';

import {
  ALLVOYAGESFILECARD,
  ENSLAVED_african_origins_CARDFILE,
  ENSLAVED_ALL_CARDFILE,
  ENSLAVED_TEXAS_CARDFILE,
  ENSLAVEDNODE,
  ENSLAVERSCARDFILE,
  ENSLAVERSNODE,
  INTRAAMERICANFILECARD,
  TRANSATLANTICFILECARD,
  VOYAGESNODE,
  VOYAGESNODECLASS,
} from '@/share/CONST_DATA';
import '@/style/cards.scss';
import { TransatlanticCardProps } from '@/share/InterfaceTypes';
import { AppDispatch, RootState } from '@/redux/store';
import { CardHeaderCustom } from '@/styleMUI';
import { styleCard } from '@/styleMUI/customStyle';
import { fetchVoyageCard } from '@/fetch/voyagesFetch/fetchVoyageCard';
import { fetchPastEnslaversCard } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversCard';
import { fetchPastEnslavedCard } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedCard';
import { DocumentItemInfo, DocumentViewerContext, createDocKey } from '@/utils/functions/documentWorkspace';
import { numberWithCommas } from '@/utils/functions/numberWithCommas';
import PopoverWrapper from './PopoverWrapper';

type DocumentReference = String & {
  sources__has_published_manifest: boolean
  sources__zotero_group_id: string
  sources__zotero_item_id: string
  sources__thumbnail?: string | null
}

function isDocumentReference(s?: string | DocumentReference): s is DocumentReference {
  const cast = s as DocumentReference
  return cast?.sources__has_published_manifest &&
    !!cast.sources__zotero_group_id &&
    !!cast.sources__zotero_item_id
}

const getSourceBib = (value: any) => {
  const bib: string | undefined = value?.sources__bib
  return bib
}

const VoyageCard = () => {
  const dispatch: AppDispatch = useDispatch();
  const [globalExpand, setGlobalExpand] = useState(true);
  const [expandedHeaders, setExpandedHeaders] = useState<string[]>([]);
  const [cardData, setCardData] = useState<Record<string, any>[]>([])
  const { setDoc } = useContext(DocumentViewerContext)

  const { cardRowID, cardFileName, cardDataArray, nodeTypeClass } =
    useSelector((state: RootState) => state.getCardFlatObjectData);

  const { networkID } = useSelector(
    (state: RootState) => state.getPastNetworksGraphData
  );
  const effectOnce = useRef(false);

  useEffect(() => {
    let newCardFileName: string = '';
    const newCardDataArray: TransatlanticCardProps[] = [];
    switch (nodeTypeClass) {
      case VOYAGESNODECLASS:
      case VOYAGESNODE:
        newCardFileName = TRANSATLANTICFILECARD;
        newCardDataArray.push(...CARDS_TRANSATLANTIC_COLLECTION);
        break;
      case VOYAGESNODECLASS:
      case VOYAGESNODE:
        newCardFileName = INTRAAMERICANFILECARD;
        newCardDataArray.push(...CARDS_INTRAAMERICAN_COLLECTION);
        break;
      case VOYAGESNODECLASS:
      case VOYAGESNODE:
        newCardFileName = ALLVOYAGESFILECARD;
        newCardDataArray.push(...CARDS_ALLVOYAGES_COLLECTION);
        break;
      case ENSLAVEDNODE:
        newCardFileName = ENSLAVED_african_origins_CARDFILE;
        newCardDataArray.push(...CARDS_ENSLAVED_african_origins);
        break;
      case ENSLAVEDNODE:
        newCardFileName = ENSLAVED_TEXAS_CARDFILE;
        newCardDataArray.push(...CARDS_TEXAS_ENSLAVED);
        break;
      case ENSLAVEDNODE:
        newCardFileName = ENSLAVED_ALL_CARDFILE;
        newCardDataArray.push(...CARDS_ALLENSLAVED);
        break;
      case ENSLAVERSNODE:
        newCardFileName = ENSLAVERSCARDFILE;
        newCardDataArray.push(...CARDS_ENSLAVERS_COLLECTION);
        break;
      default:
        newCardFileName = '';
    }
    dispatch(setCardFileName(newCardFileName));
    dispatch(setCardDataArray(newCardDataArray));
  }, [nodeTypeClass]);

  const fetchData = async () => {
    const ID = networkID || cardRowID;
    try {
      let response = null;

      switch (nodeTypeClass || VOYAGESNODE) {
        case VOYAGESNODECLASS:
        case VOYAGESNODE:
          response = await dispatch(fetchVoyageCard(ID)).unwrap();
          break;
        case ENSLAVEDNODE:
          response = await dispatch(
            fetchPastEnslavedCard(ID)
          ).unwrap();
          break;
        case ENSLAVERSNODE:
          response = await dispatch(
            fetchPastEnslaversCard(ID)
          ).unwrap();
          break;
        default:
          response = null;
      }


      if (response) {
        setCardData(response.data);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (!effectOnce.current) {
      fetchData();
    }
    return () => {
      setCardData([])
    };
  }, [dispatch, nodeTypeClass, cardRowID]);


  const newCardData = processCardData([cardData], cardDataArray, cardFileName);


  const toggleExpand = (header: string) => {
    if (!globalExpand) {
      // If globalExpand is false, just toggle the individual header
      if (expandedHeaders.includes(header)) {
        // If the header is already expanded, collapse it
        setExpandedHeaders((prevHeaders) =>
          prevHeaders.filter((prevHeader) => prevHeader !== header)
        );
      } else {
        // If the header is not expanded, expand it
        setExpandedHeaders((prevHeaders) => [...prevHeaders, header]);
      }
    } else {
      // Then toggle the individual header
      if (expandedHeaders.includes(header)) {
        // If the header is already expanded, keep it expanded
        setExpandedHeaders((prevHeaders) => [...prevHeaders]);
      } else {
        // If the header is not expanded, expand it
        setExpandedHeaders((prevHeaders) => [...prevHeaders, header]);
      }
      // If globalExpand is true, toggle the globalExpand state
      setGlobalExpand(!globalExpand);
    }
  };

  const toggleExpandAll = () => {
    if (globalExpand) {
      // If globalExpand is true, collapse all headers
      setExpandedHeaders([]);
    } else {
      // If globalExpand is false, expand all headers
      setExpandedHeaders(newCardData.map((element) => element.header));
    }
    setGlobalExpand(!globalExpand);
  };

  return (
    <div>
      <p className="body-text">
        Here are the currently available details for this voyage.{' '}
        <a href="#" onClick={toggleExpandAll}>
          {!globalExpand ? 'Expand All' : 'Collapse All'}
        </a>{' '}
        to see/hide all.
      </p>
      <Card style={{ border: '1px solid rgba(0,0,0,.1)' }}>
        {newCardData.length > 0 &&
          newCardData.map((element, index) => {
            const childValue = element.childValue;
            const isExpanded =
              expandedHeaders.includes(element.header) || globalExpand;

            return (
              <div key={`${element.label}-${uuidv4()}`}>
                <CardHeaderCustom
                  style={{ border: '1px solid rgba(0,0,0,.1)' }}
                  onClick={() => toggleExpand(element.header)}
                  subheader={
                    <div style={{ fontSize: 14 }}>{element.header}</div>
                  }
                />

                <Collapse in={isExpanded}>
                  <div className="container-card-body">
                    {childValue.map((child: any) => {
                      const values = child.value;
                      const numberFormat = child.number_format
                      if (Array.isArray(values)) {
                        const renderedValues = values.map(
                          (value: string | DocumentReference, index: number) => {
                            let valueToRender = value?.replace(
                              /<[^>]*>/g,
                              ' '
                            );

                            const additionalProps: any = {}
                            const additionalStyles: React.CSSProperties = {};
                            const extraElements: JSX.Element[] = []
                            if (isDocumentReference(value)) {
                              valueToRender += ' '
                              extraElements.push(<i key={`${index}-${uuidv4()}`} className="fa fa-file-text" aria-hidden="true"></i>);
                              additionalStyles.borderColor = 'blue';
                              additionalStyles.borderWidth = 1;
                              additionalStyles.borderStyle = 'solid';
                              const doc: DocumentItemInfo = {
                                label: value + '',
                                key: createDocKey(value.sources__zotero_group_id, value.sources__zotero_item_id),
                                revision_number: 1,
                                thumb: value.sources__thumbnail ?? null
                              };
                              additionalProps.onClick = () => {
                                setDoc(doc);
                                dispatch(setIsModalCard(false));
                              }
                            }
                            let component = valueToRender ? (
                              <div
                                key={`${index}-${value}-${uuidv4()}`}
                                style={{ padding: '2px 0' }}
                              >
                                <span
                                  key={`${index}-${value}-${uuidv4()}`}
                                  {...additionalProps}
                                  style={{ ...styleCard, ...additionalStyles }}
                                >{`${valueToRender}`}
                                  {extraElements}
                                </span>
                                <br />
                              </div>
                            ) : null
                            const bib = getSourceBib(value)
                            if (component && bib) {
                              component = <PopoverWrapper key={uuidv4()} padding={4} popoverContents={<div dangerouslySetInnerHTML={{ __html: bib }} />}>
                                {component}
                              </PopoverWrapper>
                            }
                            return component ?? '-';
                          }
                        );
                        return (
                          <div
                            className="grid-container-card-body"
                            key={`${child.label}-${index}-${uuidv4()}`}
                          >
                            <div className="grid-item-card" key={`${child.label}-${index}-${uuidv4()}`}>{child.label}</div>
                            <div
                              className="grid-itenewCardDatam-card"
                              key={`${child.label}-${index}-${uuidv4()}`}
                              style={{ maxWidth: '100%', overflowX: 'auto' }}
                            >
                              {renderedValues}
                            </div>
                          </div>
                        );
                      } else {
                        let valueFormat = values;
                        if (numberFormat === 'comma') {
                          valueFormat = numberWithCommas(values)
                        } else if (numberFormat === 'percent') {
                          const percent = values * 100
                          valueFormat = values === '--' ? '0.0%' : `${percent.toFixed(1)}%`
                        }
                        return values && (
                          <div
                            className="grid-container-card-body"
                            key={`${child.label}-${index}-${uuidv4()}`}
                          >
                            <div className="grid-item-card">{child.label}</div>
                            <div
                              className="grid-itenewCardDatam-card"
                              style={{ display: 'block' }}
                            >
                              {valueFormat}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </Collapse>
              </div>
            );
          })}
      </Card>
    </div>
  );
};

export default VoyageCard;
