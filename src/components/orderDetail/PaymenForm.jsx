import React from 'react';
import { Form, Input } from 'antd';
import { PAYMENT_TYPES, ORDER_STATUS } from '../../libs/enum';

const PaymentForm = ({ isEdit, paymentType, status }) => {
  const isDisabled = !isEdit || status === ORDER_STATUS.COMPLETE || status === ORDER_STATUS.CANCEL;

  return (
    <div className="mb-4">
      <h2 className="mb-2 text-lg font-bold">Payment Information</h2>
      {paymentType === PAYMENT_TYPES.BANK ? (
        <>
          <Form.Item name="bank_detail" label="Bank Name" rules={[{ required: true, message: 'Please input bank name' }]}>
            <Input disabled={isDisabled} />
          </Form.Item>
          <Form.Item name="bank_number" label="Bank Number" rules={[{ required: true, message: 'Please input bank number' }]}>
            <Input disabled={isDisabled} />
          </Form.Item>
          <Form.Item name="bank_branch" label="Bank Branch" rules={[{ required: true, message: 'Please input bank branch' }]}>
            <Input disabled={isDisabled} />
          </Form.Item>
          <Form.Item name="account_name" label="Account Name" rules={[{ required: true, message: 'Please input account name' }]}>
            <Input disabled={isDisabled} />
          </Form.Item>
        </>
      ) : (
        <>
          <Form.Item name="ali_number_or_email" label="No / Email" rules={[{ required: true, message: 'Please input no / email' }]}>
            <Input disabled={isDisabled} />
          </Form.Item>
          <Form.Item name="ali_name" label="Name" rules={[{ required: true, message: 'Please input name' }]}>
            <Input disabled={isDisabled} />
          </Form.Item>
        </>
      )}
    </div>
  );
};

export default PaymentForm;