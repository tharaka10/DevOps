import React, { useState, useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { Card, Input, Button, Form, Switch } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import { removeToken } from '../utils/tokenManager';
import { GetCompanyDetailsAPI, UpdateCompanyDetailsAPI } from '../api';
import '../styles/Login.css'; // Assuming the same styles can be used

const Company = () => {
  const { companyId } = useParams();
  const history = useHistory();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    companyName: '',
    address: '',
    contactNumber: '',
  });

  useEffect(() => {
    // Fetch data from the backend
    GetCompanyDetailsAPI()
      .then((response) => {
        if (response?.data?.success) {
          setFormData(response.data.company);
        } else {
          // Handle any errors or issues if the API response indicates an unsuccessful fetch
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        // Handle any network or other errors here
        console.error('Error fetching company details:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = () => {
    UpdateCompanyDetailsAPI(formData)
      .then((response) => {
        if (response?.data?.success) {
          setFormData(response.data.company);
        } else {
          // Handle any errors or issues if the API response indicates an unsuccessful fetch
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        // Handle any network or other errors here
        console.error('Error fetching company details:', error);
      });
  };

  const handleLogOut = () => {
    removeToken();
    history.push(`/`);
  };

  return (
    <div className='page'>
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
          title='Company Profile'
          style={{ width: 500, textAlign: 'center', borderRadius: '15px' }}
        >
          {/* Toggle for Edit Mode */}
          <div style={{ marginBottom: '20px' }}>
            <Switch
              checked={isEditMode}
              onChange={() => setIsEditMode(!isEditMode)}
            />
            <span style={{ marginLeft: '10px' }}>
              {isEditMode ? 'Edit Mode' : 'View Mode'}
            </span>
          </div>

          <Form
            onFinish={handleUpdate}
            labelCol={{ span: 8 }}
            labelAlign='left'
            wrapperCol={{ span: 16 }}
          >
            {/* Username (Not editable, just for display) */}
            <Form.Item label='Username'>
              <Input
                name='username'
                value={formData?.username}
                placeholder={formData?.username}
                disabled
              />
            </Form.Item>

            {/* Password */}
            <Form.Item label='Password' name='password'>
              <Input.Password
                name='password'
                value={formData?.password}
                onChange={handleChange}
                disabled={!isEditMode}
              />
            </Form.Item>

            {/* Company Name */}
            <Form.Item label='Company Name' name='companyName'>
              <Input
                name='companyName'
                value={formData?.companyName}
                placeholder={formData?.companyName}
                onChange={handleChange}
                disabled={!isEditMode}
              />
            </Form.Item>

            {/* Address */}
            <Form.Item label='Address' name='address'>
              <Input
                name='address'
                value={formData?.address}
                placeholder={formData?.address}
                onChange={handleChange}
                disabled={!isEditMode}
              />
            </Form.Item>

            {/* Contact Number */}
            <Form.Item label='Contact Number' name='contactNumber'>
              <Input
                name='contactNumber'
                value={formData?.contactNumber}
                placeholder={formData?.contactNumber}
                onChange={handleChange}
                disabled={!isEditMode}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              {isEditMode && (
                <Button type='primary' htmlType='submit' block>
                  Update
                </Button>
              )}
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div style={{ display: 'flex', gap: '2vw' }}>
        <Link to={`/company/${companyId}/order`}>
          <Button
            type='primary'
            htmlType='submit'
            style={{
              marginTop: '5vh',
              minWidth: 'fit-content',
              width: '15vw',
            }}
          >
            Create New Order
          </Button>
        </Link>
        <Link to={`/company/${companyId}/history`}>
          <Button
            type='primary'
            htmlType='submit'
            style={{
              marginTop: '5vh',
              minWidth: 'fit-content',
              width: '15vw',
            }}
          >
            View History
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Company;
