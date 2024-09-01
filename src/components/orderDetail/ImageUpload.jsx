import React from 'react';
import { Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const ImageUpload = ({ label, name, disabled }) => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName="fileList"
      getValueFromEvent={normFile}
      rules={[{ required: true, message: 'Please upload an image' }]}
    >
      <Upload
        listType="picture"
        maxCount={1}
        beforeUpload={() => false}
      >
        <Button icon={<UploadOutlined />} disabled={disabled}>
          Click to Upload
        </Button>
      </Upload>
    </Form.Item>
  );
};

export default ImageUpload;