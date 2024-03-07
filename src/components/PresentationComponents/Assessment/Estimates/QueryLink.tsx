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
