import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Card, Input, Button, Form, Steps, Select, DatePicker } from 'antd';
import { removeToken } from '../utils/tokenManager';
import { CreateDeliveryOrderAPI } from '../api';

const { Step } = Steps;

const DeliveryOrder = () => {
  const { companyId } = useParams();
  const history = useHistory();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    city: '',
    postalCode: '',
    email: '',
    contactNumber: '',
    category: '',
    safetyMode: '',
    weight: '',
    quantity: '',
    totalPrice: '',
    paymentMethod: '',
    expectedDueDate: '',
    receivedDate: '',
  });

  const handleBack = () => {
    history.push(`/company/${companyId}`);
  };

  const handleLogOut = () => {
    removeToken();
    history.push(`/`);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const disablePastDates = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to start of today

    return current && current.toDate() <= today;
  };

  const calculateTotalPrice = useCallback(
    (weight, quantity, category, safetyMode, city) => {
      const WEIGHT_MULTIPLIER = 10;
      const QUANTITY_MULTIPLIER = 5;

      const CATEGORY_MULTIPLIERS = {
        Other: 1,
        Metal: 1.5,
        Glass: 1.2,
        Food: 1.1,
        Jewelry: 2,
      };

      const SAFETY_MODE_MULTIPLIERS = {
        Low: 1,
        Medium: 1.5,
        High: 2,
      };
      const basePrice =
        weight * WEIGHT_MULTIPLIER + quantity * QUANTITY_MULTIPLIER;
      const multiplier =
        (CATEGORY_MULTIPLIERS[category] || 0) +
        (SAFETY_MODE_MULTIPLIERS[safetyMode] || 0);
      const deliveryCharge =
        city && city.toLowerCase() === 'colombo' ? 200 : 350;

      return basePrice * multiplier + deliveryCharge;
    },
    []
  );

  useEffect(() => {
    if (
      formData.weight > 0 &&
      formData.quantity > 0 &&
      formData.category &&
      formData.safetyMode &&
      formData.city
    ) {
      const newTotalPrice = calculateTotalPrice(
        formData.weight,
        formData.quantity,
        formData.category,
        formData.safetyMode,
        formData.city
      );
      console.log(newTotalPrice);
      setFormData((prevData) => ({
        ...prevData,
        totalPrice: newTotalPrice,
      }));
    }
  }, [
    formData.weight,
    formData.quantity,
    formData.category,
    formData.safetyMode,
    formData.city,
    calculateTotalPrice,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = () => {
    CreateDeliveryOrderAPI(formData)
      .then((response) => {
        if (response?.data?.success) {
          handleBack();
        } else {
          // Handle any errors or issues if the API response indicates an unsuccessful fetch
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        // Handle any network or other errors here
        console.error('Error creating delivery order:', error);
      });
  };

  return (
    <div className='page'>
      <Button
        type='primary'
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: '50px',
          left: '50px',
          zIndex: 1000, // to ensure the button stays on top
        }}
      >
        Back
      </Button>
      <Button
        type='primary'
        icon={<PoweroffOutlined />}
        onClick={handleLogOut}
        style={{
          position: 'absolute',
          top: '50px',
          right: '50px',
          zIndex: 1000, // to ensure the button stays on top
          background: '#ff4d4f',
        }}
      >
        Log Out
      </Button>
      <div className='login-container'>
        <Card
          title='New Order'
          style={{ width: 650, textAlign: 'center', borderRadius: '15px' }}
        >
          <Steps current={currentStep} style={{ marginBottom: '5vh' }}>
            <Step title='Address Details' />
            <Step title='Order Details' />
          </Steps>

          <Form
            onFinish={handleUpdate}
            labelCol={{ span: 8 }}
            labelAlign='left'
            wrapperCol={{ span: 16 }}
          >
            {currentStep === 0 && (
              <>
                <Form.Item
                  label='Customer Name'
                  name='customerName'
                  rules={[
                    { required: true, message: 'Customer Name is required!' },
                  ]}
                >
                  <Input
                    name='customerName'
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  label='Address Line 1'
                  name='addressLine1'
                  rules={[
                    { required: true, message: 'Address Line 1 is required!' },
                  ]}
                >
                  <Input
                    name='addressLine1'
                    value={formData.addressLine1}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item label='Address Line 2' name='addressLine2'>
                  <Input
                    name='addressLine2'
                    value={formData.addressLine2}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item label='Address Line 3' name='addressLine3'>
                  <Input
                    name='addressLine3'
                    value={formData.addressLine3}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  label='City'
                  name='city'
                  rules={[
                    { required: true, message: 'City is required!' },
                    {
                      pattern: /^[a-zA-Z\s]*$/,
                      message: 'City can only contain letters and whitespaces!',
                    },
                  ]}
                >
                  <Input
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  label='Postal Code'
                  name='postalCode'
                  rules={[
                    { required: true, message: 'Postal Code is required!' },
                    {
                      pattern: /^\d+$/,
                      message: 'Postal Code must be a valid integer!',
                    },
                  ]}
                >
                  <Input
                    name='postalCode'
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  label='Email'
                  name='email'
                  rules={[
                    { required: true, message: 'Email is required!' },
                    { type: 'email', message: 'Please enter a valid email!' },
                  ]}
                >
                  <Input
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  label='Contact Number'
                  name='contactNumber'
                  rules={[
                    {
                      pattern: /^\d*$/,
                      message: 'Contact Number can only contain digits!',
                    },
                  ]}
                >
                  <Input
                    name='contactNumber'
                    value={formData.contactNumber}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Button onClick={nextStep} type='primary' block>
                  Next
                </Button>
              </>
            )}

            {currentStep === 1 && (
              <>
                <Form.Item
                  label='Category'
                  name='category'
                  rules={[{ required: true, message: 'Category is required!' }]}
                >
                  <Select
                    name='category'
                    value={formData.category}
                    onChange={(value) =>
                      handleChange({ target: { name: 'category', value } })
                    }
                  >
                    {['Other', 'Metal', 'Glass', 'Food', 'Jewelry'].map(
                      (cat) => (
                        <Select.Option key={cat} value={cat}>
                          {cat}
                        </Select.Option>
                      )
                    )}
                  </Select>
                </Form.Item>

                <Form.Item
                  label='Safety Mode'
                  name='safetyMode'
                  rules={[
                    { required: true, message: 'Safety Mode is required!' },
                  ]}
                >
                  <Select
                    name='safetyMode'
                    value={formData.safetyMode}
                    onChange={(value) =>
                      handleChange({ target: { name: 'safetyMode', value } })
                    }
                  >
                    {['Low', 'Medium', 'High'].map((mode) => (
                      <Select.Option key={mode} value={mode}>
                        {mode}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label='Weight (kg)'
                  name='weight'
                  rules={[
                    { required: true, message: 'Weight is required!' },
                    {
                      pattern: /^\d*(\.\d{1,2})?$/,
                      message: 'Weight must be a valid number!',
                    },
                  ]}
                >
                  <Input
                    name='weight'
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  label='Quantity'
                  name='quantity'
                  rules={[
                    { required: true, message: 'Quantity is required!' },
                    {
                      pattern: /^\d+$/,
                      message: 'Quantity must be a valid integer!',
                    },
                  ]}
                >
                  <Input
                    name='quantity'
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  label='Payment Method'
                  name='paymentMethod'
                  rules={[
                    { required: true, message: 'Payment Method is required!' },
                  ]}
                >
                  <Select
                    name='paymentMethod'
                    value={formData.paymentMethod}
                    onChange={(value) =>
                      handleChange({ target: { name: 'paymentMethod', value } })
                    }
                  >
                    {['COD', 'Card'].map((method) => (
                      <Select.Option key={method} value={method}>
                        {method}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label='Delivery Expected Date'
                  name='expectedDueDate'
                  rules={[
                    {
                      required: true,
                      message: 'Delivery Expected Date is required!',
                    },
                  ]}
                >
                  <DatePicker
                    name='expectedDueDate'
                    style={{ width: '100%' }}
                    value={
                      formData.expectedDueDate
                        ? new Date(formData.expectedDueDate)
                        : null
                    }
                    onChange={(date, dateString) =>
                      handleChange({
                        target: { name: 'expectedDueDate', value: dateString },
                      })
                    }
                    disabledDate={disablePastDates}
                  />
                </Form.Item>

                <Form.Item label='Total Price' name='totalPrice'>
                  <p style={{ fontWeight: 700, fontSize: '1.2em' }}>
                    LKR {formData?.totalPrice}
                  </p>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button
                    onClick={previousStep}
                    type='primary'
                    block
                    style={{ marginBottom: '3vh' }}
                  >
                    Previous
                  </Button>
                  <Button type='primary' htmlType='submit' block danger>
                    Save
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryOrder;
