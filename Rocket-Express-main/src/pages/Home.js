import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { Button } from 'antd';

const Home = () => {
  return (
    <div className='page'>
      <img src={Logo} alt='Company Logo' className='logo' />
      <div className='login-header'>Rocket 0 Express</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '3vh',
        }}
      >
        <Link to='/login'>
          <Button
            type='primary'
            style={{
              minWidth: 'fit-content',
              width: '20vh',
              height: '5vh',
            }}
          >
            LogIn
          </Button>
        </Link>
        <Link to='/register'>
          <Button
            type='primary'
            style={{
              minWidth: 'fit-content',
              width: '20vh',
              height: '5vh',
            }}
          >
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
