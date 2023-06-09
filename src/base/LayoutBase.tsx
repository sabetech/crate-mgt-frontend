import React, { useState } from 'react';
import { Dropdown, Breadcrumb, Layout, Menu, theme, Avatar, Space } from 'antd';
import Dashboard from '../pages/Dashboard';
import opkLogo from '../assets/opk_logo.png'
import { Route, Routes, useNavigate } from 'react-router-dom';
import EmptiesLog from '../pages/empties/EmptiesLog';
import AddPurchaseOrder from '../pages/empties/AddPurchaseOrder';
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  FileTextOutlined,
  DownOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import AddReturningEmpties from '../pages/empties/AddReturningEmpties';
import ReturningEmptiesLog from '../pages/empties/ReturningEmptiesLog';
import AddNewCustomers from '../pages/customers/AddNewCustomers';
import ListCustomers from '../pages/customers/ListAllCustomers';
import Login from '../pages/users/Login';
import { useAuthUser } from 'react-auth-kit';
import CustomerReturnEmpties from '../pages/customers/ReturnEmpties';
import SaveInHouseEmpties from '../pages/empties-inhouse/EmptiesOnGround';
import ListInHouseEmpties from '../pages/empties-inhouse/ListInHouseEmpties';
import ManageUsers from '../pages/users/ManageUsers';
import LogoutConfirm from '../components/LogoutConfirm';
import CreateCustomerEmptiesLoan from '../pages/customers/CreateCustomerEmptiesLoan';

const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const UserDropdown: MenuProps['items'] = [
  {
    label: (
      <a href="/users/manage">
        Manage Users
      </a>
    ),
    key: 'add_a_user',
  },
  {
    type: 'divider',
  },
  {
    label: (
      <a  href="/users/logout">
        Logout
      </a>
    ),
    key: 'logout',
    
  },
];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', 'dashboard', <PieChartOutlined />),
  getItem('Customers', 'customers', <UserOutlined />, [
    getItem('Add Customer', 'customers/add_customer'),
    getItem('List All Customers', 'customers/list_all_customers'),
    getItem('Return Empties', 'customers/return_empties'),
    getItem('Empties Loan', 'customers/add_empties_loan'),
  ]),
  getItem('Empties with GGBL', 'empties-ggbl', <DesktopOutlined />, [
    getItem('Sales In', 'empties/empties_log'),
    getItem('Empties Returned Log', 'empties/empties_returned_log'),
    getItem('Add Purchase Order', 'empties/add_purchase_order'),
    getItem('Add Returning Empties', 'empties/add_returning_empties'),
  ]),
  getItem('Empties Inhouse Mgt', 'empties-inhouse', <DesktopOutlined />, [
    getItem('Add Empties on Ground', 'empties/on-ground'),
    getItem('List Empties on Ground', 'empties/list-on-ground'),
  ]),
  getItem('Warehouse', 'warehouse', <DesktopOutlined />, [
    getItem('Receivables', 'warehouse/receivables'),
    getItem('List Inventory', 'warehouse/inventory'),
    getItem('TBD', 'warehouse/tbd'),
  ]),
  getItem('POS', 'pos', <DesktopOutlined />, [
    getItem('Sales', 'POS/sales'),
    getItem('TBDD', 'POS/inventory')
  ]),
  getItem('Reports', 'reports', <FileTextOutlined />, [
    getItem('Balances', 'reports/balances'),
    getItem('GGBL Transactions', 'reports/gbl_transactions'),
  ]),
];
const LayoutBase = () => {
  const [collapsed, setCollapsed] = useState(false);
  const authUser = useAuthUser();
  
  const userState = authUser();
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = (e) => {
    navigate('/' + e.key)
  };

  return (<Layout style={{ minHeight: '100vh' }}>
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={'15%'}>
      <div style={{ margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} >
        
      </div>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={onClick} items={items} />
    </Sider>
    <Layout className="site-layout">
      <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'flex-end' }}>
        <Space style={{marginRight: '2em'}}>
        <Dropdown menu={ {items: UserDropdown} }>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
            <h3>{ userState?.name }({userState?.email})</h3>
            <Avatar size={"large"} icon={<UserOutlined />} />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
          
        </Space>
      </Header>
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'TODO' }]}/>
        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers/add_customer" element={<AddNewCustomers />} />
            <Route path="/customers/return_empties" element={<CustomerReturnEmpties />} />
            <Route path="/customers/empties_account_history" element={<></>} />
            <Route path="/customers/list_all_customers" element={<ListCustomers />} />
            <Route path="/customers/add_empties_loan" element={<CreateCustomerEmptiesLoan />} />
            <Route path="/empties/empties_log" element={<EmptiesLog />} />
            <Route path="/empties/empties_returned_log" element={<ReturningEmptiesLog />} />
            <Route path="/empties/add_purchase_order" element={<AddPurchaseOrder />} />
            <Route path="/empties/add_returning_empties" element={<AddReturningEmpties />} />
            <Route path="/empties/on-ground" element={<SaveInHouseEmpties />} />
            <Route path="/empties/list-on-ground" element={<ListInHouseEmpties />} />
            
            <Route path="/users/manage" element={<ManageUsers />} />
            <Route path="/users/logout" element={<LogoutConfirm />} />
            <Route path={"/login"} element={<Login />} />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Empties Manager ©2023 Created with ❤️</Footer>
    </Layout>
  </Layout>);
};


export default LayoutBase;