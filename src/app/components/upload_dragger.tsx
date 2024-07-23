"use client";

import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';


const { Dragger } = Upload;

export default function UploadDragger(props: UploadProps) {
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for a single upload. Strictly prohibited from uploading company data or other banned files.
      </p>
    </Dragger>
  );
}
