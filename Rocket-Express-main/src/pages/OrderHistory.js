import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Tag,
  Modal,
  Card,
  Descriptions,
  Typography,
  Row,
  Col,
} from 'antd';
import Logo from '../assets/logo.svg';
import {
  ArrowLeftOutlined,
  PoweroffOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';
import { removeToken } from '../utils/tokenManager';
import { GetDeliveryHistoryAPI, DeleteOrderAPI } from '../api';

const { Text } = Typography;

const OrderHistory = () => {
  const { companyId } = useParams();
  const history = useHistory();

  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const showDeleteModal = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    if (orderToDelete) {
      await deleteOrder(orderToDelete._id); // assuming deleteOrder is the function to delete the order
    }
    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
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

  const renderDeleteModalContent = () => {
    if (!orderToDelete) return null;
    return (
      <div>
        Are you sure you want to delete the order with ID: {orderToDelete._id}?
      </div>
    );
  };

  const deleteOrder = async (orderId) => {
    DeleteOrderAPI(orderId)
      .then((response) => {
        if (response?.data?.success) {
          console.log('Order deleted successfully');
          setRefreshTrigger((prev) => prev + 1);
        } else {
          // Handle any errors or issues if the API response indicates an unsuccessful fetch
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        // Handle any network or other errors here
        console.error('Error deleting order:', error);
      });
  };

  useEffect(() => {
    GetDeliveryHistoryAPI()
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

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (orderId) => `${orderId.substring(0, 6)}...`,
    },
    {
      title: 'Oder Placed Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateString) => dateString.split('T')[0],
    },
    {
      title: 'Delivery Expecting Date',
      dataIndex: 'expectedDueDate',
      key: 'expectedDueDate',
      render: (dateString) => dateString.split('T')[0],
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (value) => `LKR ${value.toFixed(2)}`, // to ensure it always has 2 decimal places
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
      key: 'action',
      render: (text, record) => (
        <>
          <Button type='primary' onClick={() => showModal(record)}>
            View Details
          </Button>
          <Button
            type='primary'
            danger
            style={{ marginLeft: '10px' }}
            onClick={() => showDeleteModal(record)}
          >
            <DeleteFilled /> Remove
          </Button>
        </>
      ),
    },
  ];

  const handleBack = () => {
    history.push(`/company/${companyId}`);
  };
  const handleLogOut = () => {
    removeToken();
    history.push(`/`);
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
      <img src={Logo} alt='Company Logo' className='logo' />
      <div className='login-header'>Order History</div>
      <Table
        dataSource={orders}
        columns={columns}
        pagination={{ size: 'small' }}
      />
      <Modal
        title='Order Details'
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width='auto'
      >
        {renderModalContent()}
      </Modal>
      <Modal
        title='Confirm Deletion'
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        width={400}
      >
        {renderDeleteModalContent()}
      </Modal>
    </div>
  );
};

export default OrderHistory;
