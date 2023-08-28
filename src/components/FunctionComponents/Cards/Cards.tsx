import { Card, Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import { CardHeaderCustom } from '@/styleMUI';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVoyageOptionsAPI } from '@/fetchAPI/voyagesApi/fetchVoyageOptionsAPI';
import { setCardData } from '@/redux/getCardsFlatObjSlice';
import { processCardData } from '@/utils/functions/processCardData';
import '@/style/cards.scss';

const VoyageCard = () => {
  const dispatch: AppDispatch = useDispatch();

  const [globalExpand, setGlobalExpand] = useState(false);
  const [expandedHeaders, setExpandedHeaders] = useState<string[]>([]);

  const { cardData, cardRowID } = useSelector(
    (state: RootState) => state.getCardFlatObjectData
  );

  useEffect(() => {
    let subscribed = true;
    const fetchData = async () => {
      const newFormData: FormData = new FormData();
      newFormData.append('id', String(cardRowID));
      newFormData.append('id', String(cardRowID));
      try {
        const response = await dispatch(
          fetchVoyageOptionsAPI(newFormData)
        ).unwrap();
        if (response && subscribed) {
          dispatch(setCardData(response.data));
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchData();
    return () => {
      subscribed = false;
    };
  }, [dispatch]);

  const newCardData = processCardData(cardData);

  const toggleExpand = (header: string, isExpanded: boolean) => {
    if (header === 'all') {
      setGlobalExpand(!globalExpand);
      setExpandedHeaders([]);
    } else if (isExpanded) {
      setExpandedHeaders((prevHeders) =>
        prevHeders.filter((prevHeder) => prevHeder !== header)
      );
    } else {
      setExpandedHeaders((prevHeaders) => [...prevHeaders, header]);
    }
  };

  return (
    <div>
      <p className="body-text">
        Here are the currently available details for this voyage.{' '}
        <a href="#" onClick={() => toggleExpand('all', false)}>
          Expand/Collapse
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
                  onClick={() => toggleExpand(element.header, isExpanded)}
                  subheader={
                    <div style={{ fontSize: 14 }}>{element.header}</div>
                  }
                />
                <Collapse in={!isExpanded}>
                  <div className="container-card-body">
                    {childValue.map((child: any) => (
                      <div
                        className="grid-container-card-body"
                        key={`${child.label}-${index}`}
                      >
                        <div className="grid-item-card">{child.label}</div>
                        <div className="grid-item-card">{child.value}</div>
                      </div>
                    ))}
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
