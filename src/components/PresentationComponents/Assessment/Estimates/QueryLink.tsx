import { Button, Input } from 'antd';
import '@/style/estimates.scss';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { CreateAQueryLinkRequest } from '@/share/InterfaceTypes';
import { fetchQueryLinkSaveSearch } from '@/fetch/estimateFetch/fetchQueryLinkSaveSearch';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const QueryLink = () => {
    const dispatch: AppDispatch = useDispatch();
    const [link, setNewLink] = useState<string>('');
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const navigate = useNavigate();

    const dataSend: CreateAQueryLinkRequest = {
        filter: filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : []
    };
    const fetchData = async () => {
        try {
            const response = await dispatch(fetchQueryLinkSaveSearch(dataSend)).unwrap();
            if (response) {
                const { data } = response;
                const alphanumericPattern = link.split('/').pop();
                setNewLink(data);
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {


    }, [dispatch]);

    const handleChangeLink = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewLink(value);
    }

    const handleCreateLink = () => {
        // navigate(`/voyages/${link}`)
        fetchData();
    };

    return (
        <div>
            <div className='sidebar-label'>To reactivate the current query in the future, copy the following URL and then paste it into the address bar:</div>
            <div className='text-query-link'>
                <TextArea rows={2} maxLength={6} style={{ borderColor: '#1b1a1a' }} value={link} onChange={handleChangeLink} name="save-search-url" />
            </div>
            <div className="reset-btn-estimate">
                <Button className='selected-all-btn' onClick={handleCreateLink}>Create Link</Button>
            </div>
        </div>
    )
}

export default QueryLink;

/*
import { Button, Input } from 'antd';
import { useState } from 'react';

const { TextArea } = Input;

const QueryLink = () => {
  const [link, setLink] = useState('');

  const saveFilter = async () => {
    // Implement logic to send filter object and get the generated query link
    const response = await fetch('/save-filter/voyages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filterObject: yourFilterObject }),
    });

    if (response.ok) {
      const data = await response.json();
      setLink(data.queryLink);
    }
  };

  const loadFilter = async () => {
    // Extract alphanumeric pattern from the link input
    const alphanumericPattern = link.split('/').pop();

    // Implement logic to send the alphanumeric pattern and get results
    const response = await fetch(`/load-filter/${alphanumericPattern}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Loaded filter type: ${data.objectType}`);
      console.log(`Results:`, data.results);
      // Display the results in your table
    } else {
      console.error('Filter not found');
    }
  };

  return (
    <div>
      <div>To reactivate the current query in the future, copy the following URL and then paste it into the address bar:</div>
      <div>
        <TextArea rows={2} maxLength={6} style={{ borderColor: '#1b1a1a' }} value={link} onChange={(e) => setLink(e.target.value)} name="save-search-url" />
      </div>
      <div>
        <Button style={{ backgroundColor: '#008ca8', borderColor: '#008ca8', color: '#fff' }} onClick={saveFilter}>Create Link</Button>
        <Button style={{ backgroundColor: '#008ca8', borderColor: '#008ca8', color: '#fff' }} onClick={loadFilter}>Load Filter</Button>
      </div>
    </div>
  );
};

export default QueryLink;



*/