import { Card, Collapse } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCardDataArray,
  setCardFileName,
} from '@/redux/getCardFlatObjectSlice';
import { processCardData } from '@/utils/functions/processCardData';
import CARDS_VOYAGES_COLLECTION from '@/utils/flatfiles/transatlantic_voyages_card.json';
import CARDS_ENSLAVED_COLLECTION from '@/utils/flatfiles/enslaved_card.json';
import CARDS_ENSLAVERS_COLLECTION from '@/utils/flatfiles/enslavers_card.json';
import {
  ENSLAVEDCARDFILE,
  ENSLAVEDNODE,
  ENSLAVERSCARDFILE,
  ENSLAVERSNODE,
  VOYAGESNODE,
  VOYAGESNODECLASS,
  YOYAGESCARDFILE,
} from '@/share/CONST_DATA';
import '@/style/cards.scss';
import { TransatlanticCardProps } from '@/share/InterfaceTypes';
import { AppDispatch, RootState } from '@/redux/store';
import { CardHeaderCustom } from '@/styleMUI';
import { styleCard } from '@/styleMUI/customStyle';
import { fetchVoyageCard } from '@/fetch/voyagesFetch/fetchVoyageCard';
import { fetchPastEnslaversCard } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversCard';
import { fetchPastEnslavedCard } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedCard';

const VoyageCard = () => {
  const dispatch: AppDispatch = useDispatch();
  const [globalExpand, setGlobalExpand] = useState(true);
  const [expandedHeaders, setExpandedHeaders] = useState<string[]>([]);
  const [cardData, setCardData] = useState<Record<string, any>[]>([])

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
        newCardFileName = YOYAGESCARDFILE;
        newCardDataArray.push(...CARDS_VOYAGES_COLLECTION);
        break;
      case ENSLAVEDNODE:
        newCardFileName = ENSLAVEDCARDFILE;
        newCardDataArray.push(...CARDS_ENSLAVED_COLLECTION);
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

      switch (nodeTypeClass) {
        case VOYAGESNODECLASS:
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
              <div key={`${element.label}-${index}`}>
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

                      if (Array.isArray(values)) {
                        const renderedValues = values.map(
                          (value: string, index: number) => {
                            const valueToRender = value?.replace(
                              /<[^>]*>/g,
                              ' '
                            );
                            return (
                              <div
                                key={`${index}-${value}`}
                                style={{ padding: '2px 0' }}
                              >
                                <span
                                  style={styleCard}
                                >{`${valueToRender}`}</span>
                                <br />
                              </div>
                            );
                          }
                        );
                        return (
                          <div
                            className="grid-container-card-body"
                            key={`${child.label}-${index}`}
                          >
                            <div className="grid-item-card">{child.label}</div>
                            <div
                              className="grid-itenewCardDatam-card"
                              style={{ maxWidth: '100%', overflowX: 'auto' }}
                            >
                              {renderedValues}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className="grid-container-card-body"
                            key={`${child.label}-${index}`}
                          >
                            <div className="grid-item-card">{child.label}</div>
                            <div
                              className="grid-itenewCardDatam-card"
                              style={{ display: 'block' }}
                            >
                              {values}
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
