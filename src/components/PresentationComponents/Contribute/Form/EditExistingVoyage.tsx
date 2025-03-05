import '@/style/contributeContent.scss';
import '@/style/newVoyages.scss';
import { Form, Input, Button, Divider } from 'antd';
import { useState } from 'react';
import { ContributionForm } from '../EntityForm';
import sampleVoyage from "../sample_11586.json";
import { MaterializedEntity } from '@/models/materialization';
interface EditExistingVoyageProps {
  openSideBar: boolean;
}
const EditExistingVoyage: React.FC<EditExistingVoyageProps> = ({openSideBar}) => {
  const [form] = Form.useForm();
  const [voyageId, setVoyageId] = useState<string>('');
  const [entity, setEntity] = useState<MaterializedEntity | undefined>(sampleVoyage as MaterializedEntity)

  const handleSubmit = async (values: any): Promise<void> => {
    if (voyageId) {
      const res = await fetch(`http://localhost:7127/materialize/Voyage/${voyageId}`)
      if (res.status === 200) {
        setEntity(await res.json())
      } else {
        alert(`Voyage not found/error on api`);
      }
    } else {
      alert(`Please enter a voyage ID`);
    }
  };

  return (
    <div className="contribute-conten" style={{width: openSideBar ? '70vw': '85vw'}}>
        <h1 className="page-title-1">Edit an Existing Record of a Voyage</h1>
      <div className="content-inner-wrapper">
        <p className="description-text">Please select the voyage you wish to edit.</p>
          <Form layout="vertical"form={form} onFinish={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'start', marginBottom: 20, width: 320 }}>
              <Form.Item 
                style={{ flex: 1, marginBottom: 0 }}
                name="voyageId"
                rules={[{ required: true, message: 'Please input Voyage ID!' }]}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Input
                    placeholder="Enter Voyage ID"
                    type="number"
                    value={voyageId}
                    onChange={(e) => setVoyageId(e.target.value)}
                  />
                    <Form.ErrorList errors={form.getFieldError("voyageId")} />
                </div>
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
                onClick={() => form.submit()}
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
          <Divider />
          {entity && <ContributionForm entity={entity} />}
          <Divider />
        </Form>
      </div>
    </div>
  );
};

export default EditExistingVoyage;
