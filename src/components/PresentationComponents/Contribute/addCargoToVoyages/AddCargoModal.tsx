import React from 'react';

import { Form, Input, Modal, Select } from 'antd';

export interface Cargo {
  type: string;
  unit: string;
  amount: string;
}

interface AddCargoModalProp {
  isModalOpen: boolean;
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void;
  handleAddCargo: () => void;
  handleNewCargoChange: (field: keyof Cargo, value: string) => void;
  newCargo: Cargo;
  setNewCargo: React.Dispatch<React.SetStateAction<Cargo>>;
  // setShipData: React.Dispatch<React.SetStateAction<any>>;
  // shipData: any;
}

const AddCargoModal: React.FC<AddCargoModalProp> = ({
  isModalOpen,
  setIsModalOpen,
  newCargo,
  handleNewCargoChange,
  setNewCargo,
  // setShipData,
  // shipData
}) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form
      .validateFields()
      .then(() => {
        // setShipData({
        //     ...shipData,
        //     cargo: [...shipData.cargo, newCargo],
        // });
        setNewCargo({ type: '', unit: '', amount: '' });
        setIsModalOpen(false);
      })
      .catch((errorInfo) => {
        console.log('Validation Failed:', errorInfo);
      });
  };

  return (
    <Modal
      title="Add Cargo to Voyage"
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        setNewCargo({ type: '', unit: '', amount: '' });
      }}
      onOk={onOk}
      okText="Confirm"
      cancelText="Cancel"
    >
      <Form
        form={form} // Pass form instance to Form
        layout="vertical"
        initialValues={newCargo}
      >
        <Form.Item
          label="Cargo Type"
          name="type"
          rules={[{ required: true, message: 'Please select a cargo type' }]}
        >
          <Select
            value={newCargo.type || undefined}
            onChange={(value) => setNewCargo({ ...newCargo, type: value })}
            options={[
              {
                label: 'agricultural hardware',
                value: 'agricultural hardware',
              },
              {
                label: 'alcohol or liquor or spirits (unspecified)',
                value: 'alcohol or liquor or spirits (unspecified)',
              },
              { label: 'anchors', value: 'anchors' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Unit"
          name="unit"
          rules={[{ required: true, message: 'Please select a unit' }]}
        >
          <Select
            value={newCargo.unit || undefined}
            onChange={(value) => setNewCargo({ ...newCargo, unit: value })}
            options={[
              { label: 'barrels', value: 'barrels' },
              { label: 'boxes', value: 'boxes' },
              { label: 'casks', value: 'casks' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Please enter an amount' }]}
        >
          <Input
            type="number"
            value={newCargo.amount}
            onChange={(e) => handleNewCargoChange('amount', e.target.value)}
            required
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCargoModal;
