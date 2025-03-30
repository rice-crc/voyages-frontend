import {Form} from 'antd';
import  { ReactNode} from 'react';

export const addLabel = (item: ReactNode, label: string) => {
    return (
      <Form.Item
        label={<span className="form-contribute-label">{label}</span>}
        name={label}
        style={{ marginBottom: 0 }}
      >
        {item}
      </Form.Item>
    );
  };