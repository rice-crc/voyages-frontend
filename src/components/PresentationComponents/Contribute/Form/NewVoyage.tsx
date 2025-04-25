import '@/style/contributeContent.scss';
import '@/style/newVoyages.scss';
import React, { useCallback, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Divider, Form, Input, message } from 'antd';
import {
  VoyageSchema,
  EntitySchema,
} from '@/models/entities';
import { ContributionForm } from '../ContributionForm';
import { materializeNew } from '@/models/materialization';

export interface EntityFormProps {
  schema: EntitySchema;
}

const tempNewVoyage = materializeNew(VoyageSchema, '9999999');

const NewVoyage: React.FC = () => {
  const [form] = Form.useForm();
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  const handleCommentChange = (field: string, value: string) => {
    setComments({
      ...comments,
      [field]: value,
    });
  };

  // Handlers for the form submission
  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();

      // Combine form data with comments
      const submissionData = {
        ...values,
        comments,
      };

      console.log('Save submission data:', submissionData);

      // Simulate an API call or state update
      // Replace with your actual API integration
      const response = await saveVoyageData(submissionData);
    } catch (error) {
      console.error('Save error:', error);
      message.error('Please correct the errors before saving.');
    }
  }, [form, comments]);

  // Mock API call function
  const saveVoyageData = async (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  const handleReview = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Review values:', values);
        message.info('Review process started.');
      })
      .catch((error) => {
        message.error('Please correct the errors before reviewing.');
      });
  };

  const handleCancel = () => {
    form.resetFields();
    message.warning('Contribution canceled.');
  };

  return (
    <div className="contribute-content">
      <h1 className="page-title-1">New Voyage</h1>
      <p>
        Variables are organized into eight categories. Complete as many boxes in
        each category as your source(s) allow. Comments or notes on any entry
        may be added by clicking on the comment icon to the right of each input
        box. Should you wish to add a port or region that does not appear in the
        drop-down menu, please let the editors know via the note box at the foot
        of the entry form. If required, use this box for any additional
        information. You can review your complete entry at any time by clicking
        on the 'Review' button. To submit your entry you must move to the Review
        page first.
      </p>
      <Form layout="vertical" form={form}>
        <Form.Item
          name="voyageComments"
          label={<span className="lable-title">Voyage comments:</span>}
        // rules={[{ required: true, message: "Voyage comments are required" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
        <small className="comment-small">
          The comments above are meant for information related to the voyage
          which does not fit any of the existing fields. For comments meant to
          the reviewer/editor, please use the contributor's comments at the end
          of this form or any of the specific field comment boxes.
        </small>
        <Divider />
        <ContributionForm entity={tempNewVoyage} height={100}/>
        <Divider />
        <Form.Item
          name="contributorsComments"
          label={
            <span className="lable-title">
              Contributor’s Comments on This Entry:
            </span>
          }
        >
          <Input.TextArea rows={2} />
        </Form.Item>
        <Box sx={{ mt: 3, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              backgroundColor: 'rgb(55, 148, 141)',
              color: '#fff',
              height: 35,
              fontSize: '0.85rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(6, 186, 171, 0.83)',
              },
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReview}
            sx={{
              backgroundColor: 'transparent',
              border: '1px solid rgb(55, 148, 141)',
              color: 'rgb(55, 148, 141)',
              height: 35,
              fontSize: '0.85rem',
              textTransform: 'none',
              boxShadow: 'transparent',
              marginLeft: '10px',
              '&:hover': {
                backgroundColor: 'rgb(55, 148, 141)',
                color: '#fff',
              },
            }}
          >
            Review
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCancel}
            sx={{
              backgroundColor: '#dc3545',
              border: '1px solid #dc3545',
              color: '#fff',
              height: 35,
              fontSize: '0.85rem',
              textTransform: 'none',
              boxShadow: 'transparent',
              marginLeft: '10px',
              '&:hover': {
                backgroundColor: '#c82333',
              },
            }}
          >
            Cancel contribution
          </Button>
        </Box>
      </Form>
    </div>
  );
};

export default NewVoyage;
