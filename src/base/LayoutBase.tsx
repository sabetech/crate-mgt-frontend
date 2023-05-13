import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Dashboard from '../pages/Dashboard';
import opkLogo from '../assets/opk_logo.png'
import { Route, Routes, useNavigate } from 'react-router-dom';
import EmptiesLog from '../pages/empties/EmptiesLog';
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

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
    getItem('Add Customer', 'add_customer'),
    getItem('Show Account History', 'account_history'),
    getItem('List All Customers', 'list_all_customers'),
  ]),
  getItem('Empties', 'empties', <DesktopOutlined />, [
    getItem('Empties Log', 'empties_log'),
    getItem('Add Purchase Order', 'add_purchase_order'),
  ]),
];
const LayoutBase = () => {
    const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = (e) => {
    navigate('/' + e.key)
  };
    return (<Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 112, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} >
          <img src={opkLogo} alt="Empties Manager" style={{height: 112}} />
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={onClick} items={items} />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/empties_log" element={<EmptiesLog />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Empties Manager ©2023 Created with ❤️</Footer>
      </Layout>
    </Layout>);

}

export default LayoutBase;