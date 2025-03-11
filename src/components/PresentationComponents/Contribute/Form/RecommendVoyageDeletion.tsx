import '@/style/contributeContent.scss';
import { Form, Input, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';

const RecommendVoyageDeletion: React.FC = () => {
  const [form] = Form.useForm();
  const [voyageId, setVoyageId] = useState<string>('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (voyageId) {
      alert(`Sucessfully password change`);
    } else {
      alert(`Password is not match, try again`);
    }
  };

  return (
    <div className="contribute-content">
      <h1 className="page-title-1">
        Recommend the Deletion of an Existing Voyage
      </h1>
      <div className="content-inner-wrapper">
      <p>
        Please use the box for notes to tell us why the selected voyage(s)
        should be removed from the database.
      </p>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
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
            <Form.Item 
                style={{ flex: 1, marginBottom: 0 }}
                name="voyageId"
                rules={[{ required: true, message: 'Please input Voyage ID!' }]}
              >
                  <TextArea
                    placeholder="Notes"
                    value={voyageId}
                    onChange={(e) => setVoyageId(e.target.value)}
                    style={{width: 320}}
                    rows={2}
                  />
              </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: 'rgb(55, 148, 141)',
                height: 32,
                marginTop: 20
              }}
            >
              Begin
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default RecommendVoyageDeletion;
