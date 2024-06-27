import React, { useState, useEffect } from 'react';
import {
  Table,
  Dropdown,
  Button,
  message,
  Space,
  Menu,
  Tag,
  Modal,
  Card,
  Descriptions,
  Typography,
  Row,
  Col,
  Input,
} from 'antd';
import Logo from '../assets/logo.svg';
import {
  DownOutlined,
  UserOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';
import { removeToken } from '../utils/tokenManager';
import { GetDeliveryBacklogAPI, UpdateDeliveryDetailsAPI } from '../api';
import '../styles/Admin.css';

const { Text } = Typography;

const items = [
  {
    label: 'Pending',
    key: 'Pending',
    icon: <UserOutlined />,
  },
  {
    label: 'On Hold',
    key: 'On Hold',
    icon: <UserOutlined />,
    danger: true,
  },
  {
    label: 'Delivered',
    key: 'Delivered',
    icon: <UserOutlined />,
  },
];

const AdminView = () => {
  const { companyId } = useParams();
  console.log(companyId);
  const history = useHistory();

  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchText, setSearchText] = useState('');

  const onSearch = (value) => {
    setSearchText(value);
  };

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderModalContent = () => {
    if (!selectedOrder) return null;
    return (
      <div style={{ paddingTop: '2vh' }}>
        <Row gutter={16} style={{ marginBottom: '2vh' }}>
          <Col span={24}>
            <Card title='Customer Details'>
              <Descriptions column={1}>
                <Descriptions.Item label='Name'>
                  {selectedOrder.customerName}
                </Descriptions.Item>
                <Descriptions.Item label='Email'>
                  {selectedOrder.email}
                </Descriptions.Item>
                <Descriptions.Item label='Contact'>
                  {selectedOrder.contactNumber}
                </Descriptions.Item>
                <Descriptions.Item label='Address'>
                  {selectedOrder.addressLine1},
                  {selectedOrder.addressLine2
                    ? `${selectedOrder.addressLine2}, `
                    : ''}
                  {selectedOrder.city}, {selectedOrder.postalCode}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Card title='Order Details'>
              <Descriptions column={2}>
                <Descriptions.Item label='Weight'>
                  {selectedOrder.weight} kg
                </Descriptions.Item>
                <Descriptions.Item label='Quantity'>
                  {selectedOrder.quantity}
                </Descriptions.Item>
                <Descriptions.Item label='Total Price'>
                  LKR {selectedOrder.totalPrice}
                </Descriptions.Item>
                <Descriptions.Item label='Payment Method'>
                  {selectedOrder.paymentMethod}
                </Descriptions.Item>
                <Descriptions.Item label='Category'>
                  {selectedOrder.category}
                </Descriptions.Item>
                <Descriptions.Item label='Safety Mode'>
                  {selectedOrder.safetyMode}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col span={12}>
            <Card title='Delivery & Status'>
              <Descriptions column={1}>
                <Descriptions.Item label='Expected Due Date'>
                  {new Date(selectedOrder.expectedDueDate).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label='Status'>
                  <Text
                    type={
                      selectedOrder.status === 'Delivered'
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {selectedOrder.status}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
              {selectedOrder.receivedDate && (
                <Text>
                  <b>Received Date:</b>{' '}
                  {new Date(selectedOrder.receivedDate).toLocaleDateString()}
                </Text>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const handleMenuClick = (e, orderId) => {
    const data = {
      status: e.key,
    };
    UpdateDeliveryDetailsAPI(orderId, data)
      .then((response) => {
        if (response?.data?.success) {
          setRefreshTrigger((prev) => prev + 1);
          message.info('Delivery status updated');
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        // Handle any network or other errors here
        console.error('Error getting delivery status update:', error);
      });
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (orderId) => `${orderId.substring(0, 6)}...`,
    },
    {
      title: 'Oder Placed By',
      dataIndex: ['createdBy', 'companyName'], // Using nested property
      key: '_id',
      render: (companyName) => companyName || 'N/A', // Display 'N/A' if companyName is null or undefined
    },
    {
      title: 'Oder Placed Date',
      dataIndex: 'createdAt',
      key: '_id',
      render: (dateString) => dateString.split('T')[0],
    },
    {
      title: 'Delivery Expecting Date',
      dataIndex: 'expectedDueDate',
      key: '_id',
      render: (dateString) => dateString.split('T')[0],
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: '_id',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalPrice',
      key: '_id',
      render: (value) => `LKR ${value.toFixed(2)}`, // to ensure it always has 2 decimal places
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: '_id',
      render: (text, record) => {
        let color;
        switch (text) {
          case 'Delivered':
            color = '#87d068';
            break;
          case 'On Hold':
            color = '#f50';
            break;
          case 'Pending':
            color = '#108ee9';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Action',
      key: '_id',
      render: (text, record) => (
        <>
          <Button
            type='primary'
            style={{ marginRight: '10px' }}
            onClick={() => showModal(record)}
          >
            View Details
          </Button>
          <Dropdown
            overlay={
              <Menu onClick={(e) => handleMenuClick(e, record._id)}>
                {items.map((item) => (
                  <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    danger={item.danger}
                  >
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button>
              <Space>
                Update Status
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </>
      ),
    },
  ];

  const filteredOrders = searchText
    ? orders.filter((order) => {
        if (!order.createdBy) return false;

        const companyName = order.createdBy.companyName.toLowerCase();
        const searchTextWords = searchText.toLowerCase().split(/\s+/);

        // Check if all words from searchText are found in companyName in the same order
        let lastIndex = -1;
        return searchTextWords.every((word) => {
          const currentIndex = companyName.indexOf(word, lastIndex + 1);
          if (currentIndex === -1) return false;
          lastIndex = currentIndex;
          return true;
        });
      })
    : orders;

  useEffect(() => {
    GetDeliveryBacklogAPI()
      .then((response) => {
        if (response?.data?.success) {
          setOrders(response.data?.data);
        } else {
          // Handle any errors or issues if the API response indicates an unsuccessful fetch
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        // Handle any network or other errors here
        console.error('Error getting delivery history:', error);
      });
  }, [refreshTrigger]);

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
      <img src={Logo} alt='Company Logo' className='logo' />
      <div className='login-header'>Order Backlog</div>
      <div className='table-container'>
        <Input.Search
          placeholder='Search by Company Name'
          onSearch={onSearch}
          style={{ width: '100%', marginBottom: 16 }}
        />
        <Table
          dataSource={filteredOrders}
          columns={columns}
          pagination={{ size: 'small' }}
          style={{ width: '100%' }}
        />
      </div>
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width='auto'
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default AdminView;
