import '@/style/contributeContent.scss';
import '@/style/newVoyages.scss';
import { Form, Input, Button, Divider } from 'antd';
import { useState } from 'react';
import { ContributionForm } from '../ContributionForm';
import { MaterializedEntity } from '@dotproductdev/voyages-contribute';
import { fetchSubmitEditVoaygesForm } from '@/fetch/contributeFetch/fetchSubmitEditVoaygesForm';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';

const initialExistingVoyageEntity: MaterializedEntity = {
  entityRef: {
    type: 'existing',  // or 'new' if you're creating
    schema: 'Voyage',
    id: 0,
  },
  data: {},  // <-- initially empty, you can add more fields if needed
  state: 'original',
};


interface EditExistingVoyageProps {
  openSideBar: boolean;
}
const EditExistingVoyage: React.FC<EditExistingVoyageProps> = ({
  openSideBar,
}) => {
  const [formId] = Form.useForm();
  const [entity, setEntity] = useState<MaterializedEntity | undefined>(initialExistingVoyageEntity as MaterializedEntity);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any): Promise<void> => {
    const voyageId = values.voyageId

    if (voyageId) {
      setLoading(true);
      const res = await fetchSubmitEditVoaygesForm(voyageId)
      if (res.status === 200) {
        setEntity(res.data);
        setLoading(true);
      } else {
        alert(`Voyage not found/error on api`);
        setLoading(true);
      }
    } else {
      alert(`Please enter a voyage ID`);
      setLoading(true);
    }
  };



  return (
    <div
      className="contribute-content"
      style={{ width: openSideBar ? '75vw' : '90vw' }}
    >
      <h1 className="page-title-1">Edit an Existing Record of a Voyage</h1>
      <div className="content-inner-wrapper">
        <p className="description-text">
          Please select the voyage you wish to edit.
        </p>
        <Form layout="vertical" form={formId} onFinish={handleSubmit}>
          <div
            style={{
              display: 'flex',
              alignItems: 'start',
              marginBottom: 10,
              width: 320,
            }}
          >
            <Form.Item
              style={{ flex: 1, marginBottom: 0 }}
              name="voyageId"
              rules={[{ required: true, message: 'Please input Voyage ID!' }]}
            >
              <Input placeholder="Enter Voyage ID" type="number" />
            </Form.Item>
            <Button
              type="primary"
              ghost
              style={{
                marginLeft: 10,
                height: 32,
                borderColor: 'rgb(55, 148, 141)',
                color: 'rgb(55, 148, 141)',
              }}
              onClick={() => formId.submit()}
            >
              Search
            </Button>
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: 'rgb(55, 148, 141)',
                height: 32,
              }}
            >
              Begin
            </Button>
          </Form.Item>
          </Form>
        <Divider />
        {entity && entity.entityRef.id !== 0 ? (
          <ContributionForm
            entity={entity}
            height={120}
          />
        ) : (
          <div
            style={{
              height: '50vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              border: '1px dashed #ccc',
              borderRadius: '8px',
              marginTop: '20px',
              backgroundColor: '#f9f9f9',
            }}
          >
            {loading ?
              (
                <div className="loading-logo">
                  <img src={LOADINGLOGO} alt="loading" style={{ width: '50%' }} />
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '24px', color: '#999', marginBottom: '10px' }}>
                    ✏️
                  </div>
                  <div style={{ fontSize: '16px', color: '#666' }}>
                    Please enter a Voyage ID and click <strong>Search</strong> to start editing.
                  </div>
                </>
              )}
          </div>
        )}
        <Divider />
      </div>
    </div>
  );
};

export default EditExistingVoyage;
