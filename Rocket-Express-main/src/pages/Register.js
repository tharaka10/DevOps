import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Card, Input, Button, Form } from 'antd';
import '../styles/Login.css';
import Logo from '../assets/logo.svg';
import { RegisterAPI } from '../api/index';
import { setToken } from '../utils/tokenManager';

const RegisterPage = () => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    companyName: '',
    address: '',
    contactNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    RegisterAPI(formData)
      .then((response) => {
        if (response?.data?.company?._id && response?.data?.token) {
          setToken(response.data.token);
          history.push(`/company/${response.data.company._id}`);
        }
      })
      .catch((error) => {
        console.error(
          'Registration Error:',
          error.response ? error.response.data : error.message
        );
        alert(error.response.data.message);
      });
  };

  return (
    <div className='page'>
      <img src={Logo} alt='Company Logo' className='logo' />
      <div className='login-header'>Rocket Express</div>
      <div className='login-container'>
        <Card
          title='Company Registration'
          style={{ width: 300, textAlign: 'center', borderRadius: '15px' }}
        >
          <Form onFinish={handleSubmit}>
            <Form.Item
              name='username'
              rules={[
                { required: true, message: 'Please input your username!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                placeholder='Username'
                name='username'
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                placeholder='Password'
                name='password'
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name='companyName'
              rules={[
                { required: true, message: 'Please input your company name!' },
              ]}
            >
              <Input
                placeholder='Company Name'
                name='companyName'
                value={formData.companyName}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name='address'
              rules={[
                { required: true, message: 'Please input your address!' },
              ]}
            >
              <Input
                placeholder='Address'
                name='address'
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name='contactNumber'
              rules={[
                {
                  required: true,
                  message: 'Please input your contact number!',
                },
                {
                  pattern: /^[0-9]*$/,
                  message: 'Please enter a valid number!',
                },
              ]}
            >
              <Input
                placeholder='Contact Number'
                name='contactNumber'
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' block>
                Register
              </Button>
            </Form.Item>
          </Form>
          <div style={{ marginTop: '15px' }}>
            Already have an account? <Link to='/login'>Login here</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
