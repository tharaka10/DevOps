import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Card, Input, Button, Form } from 'antd';
import '../styles/Login.css';
import Logo from '../assets/logo.svg';
import { LoginAPI } from '../api';
import { setToken } from '../utils/tokenManager';

const LoginPage = () => {
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (values) => {
    LoginAPI(values)
      .then((response) => {
        if (response?.data?.company?._id && response?.data?.token) {
          setToken(response.data.token);
          if (response.data.company.userRole === 'Admin') {
            history.push(`/admin`);
          } else {
            history.push(`/company/${response.data.company._id}`);
          }
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
          title='Company Login'
          style={{ width: 300, textAlign: 'center', borderRadius: '15px' }}
        >
          <Form onFinish={handleSubmit}>
            <Form.Item
              name='username'
              rules={[
                { required: true, message: 'Please input your username!' },
                {
                  pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Please enter a valid email address!',
                },
              ]}
            >
              <Input
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' block>
                Login
              </Button>
            </Form.Item>
          </Form>
          <div style={{ marginTop: '15px' }}>
            Don't have an account? <Link to='/register'>Register here</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
