import React, { useState, useEffect } from 'react';
import { Dropdown, Breadcrumb, Layout, Menu, theme, Avatar, Space, Modal, Typography } from 'antd';
import Dashboard from '../pages/Dashboard';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import EmptiesLog from '../pages/empties/EmptiesLog';
import AddPurchaseOrder from '../pages/empties/AddPurchaseOrder';
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  FileTextOutlined,
  DownOutlined,
  InboxOutlined,
  AppstoreOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import AddReturningEmpties from '../pages/empties/AddReturningEmpties';
import ReturningEmptiesLog from '../pages/empties/ReturningEmptiesLog';
import AddNewCustomers from '../pages/customers/AddNewCustomers';
import ListCustomers from '../pages/customers/ListAllCustomers';
import RecordVSESales from '../pages/customers/RecordVSESales';
import Login from '../pages/users/Login';
import { useAuthHeader, useAuthUser, useIsAuthenticated, useSignOut } from 'react-auth-kit';
import CustomerReturnEmpties from '../pages/customers/ReturnEmpties';
import SaveInHouseEmpties from '../pages/empties-inhouse/EmptiesOnGround';
import ListInHouseEmpties from '../pages/empties-inhouse/ListInHouseEmpties';
import ManageUsers from '../pages/users/ManageUsers';
import { logout } from '../services/AuthAPI';
import CreateCustomerEmptiesLoan from '../pages/customers/CreateCustomerEmptiesLoan';
import CustomerHistory from '../pages/customers/CustomerHistory';
import ProductManagement from '../pages/inventory/ProductManagement';
import Receivables from '../pages/inventory/Receivables';
import PendingOrders from '../pages/inventory/PendingOrders';
import POS from '../pages/sales/POS';
import AddLoadouts from '../pages/inventory/AddLoadouts';
import LoadoutList from '../pages/inventory/LoadoutList';
import TakeStock from '../pages/inventory/TakeStock';
import StockInfo from '../pages/inventory/StockInfo';
import Orders from '../pages/sales/Orders';
import { Permission } from '../interfaces/User';
import EmptiesBalance from '../pages/empties-inhouse/EmptiesBalance';
import DailySalesReport from '../pages/reports/DailySalesReport';
import ReceivablesLog from '../pages/inventory/ReceivablesLog'
import InventoryHistory from '../pages/inventory/InventoryHistory';
import AdjustStock from '../pages/inventory/AdjustStock';

const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number] & {permission_required?: string};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  permission_required?: string
): MenuItem {
 
  return {
    key,
    icon,
    children,
    label,
    permission_required
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', 'dashboard', <PieChartOutlined />, undefined, 'view_dashboard'),
  getItem('Customers or VSEs', '_', <UserOutlined />, [
    getItem('Add Customer', 'customers/new', undefined, undefined, 'create_customer'),
    getItem('List All Customers', 'customers', undefined, undefined, 'list_customers'),
    getItem('Return Empties', 'customers/return_empties', undefined, undefined, 'return_empties'),
    // getItem('Record Sales', 'customers/record_sales', undefined, undefined, 'record_sales'),
  ], 'list_customers'),
  getItem('Empties with GGBL', 'empties-ggbl', <DesktopOutlined />, [
    getItem('Sales In', 'empties/empties_log', undefined, undefined, 'empties_sales_in'),
    getItem('Empties Returned Log', 'empties/empties_returned_log', undefined, undefined, 'empties_returned'),
    getItem('Add Returning Empties', 'empties/add_returning_empties', undefined, undefined, 'empties_returned'),
  ], 'empties_sales_in'),
  getItem('Empties Inhouse Mgt', 'empties-inhouse', <InboxOutlined />, [
    getItem('Empties Overview', 'empties/empties-overview'),
    // getItem('Count Empties on Ground', 'empties/on-ground'),
    // getItem('List Empties on Ground', 'empties/list-on-ground'),
  ], 'empties_sales_in'),
  getItem('Warehouse', 'warehouse', <AppstoreOutlined />, [
    getItem('Products', 'warehouse/products'),
    getItem('Pending Orders', 'warehouse/pending-orders'),
    getItem('Adjust Stock', 'warehouse/adjust-stock'),
    getItem('Receivables', 'warehouse/receivables'),
    getItem('Receivables Log', 'warehouse/receivables-log'),
    getItem('Inventory Transaction', 'warehouse/inventory-transaction'),
    getItem('Add Loadout', 'warehouse/addloadout'),
    getItem('Loadouts', 'warehouse/listloadouts'),
    getItem('Take Stock', 'warehouse/takestock'),
    getItem('Stock Info', 'warehouse/stockinfo')
  ], 'inventory'),
  getItem('POS', 'pos', <CalculatorOutlined />, [
    getItem('Sales', 'POS/sales'),
    getItem('Orders', 'POS/orders')
  ], 'initial_sale'),
  getItem('Reports', 'reports', <FileTextOutlined />, [
    getItem('Sales Report', 'reports/daily-sales-report'),
    
  ], 'approve'),
];


const LayoutBase = () => {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState(
    location.pathname === "/" || location.pathname === ""
        ? "/dashboard"
        : location.pathname,
  );
  
  const authUser = useAuthUser();
  console.log("USER INFO", authUser())
  console.log("ITEMS::", items);
  const user = authUser();
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  
  const authHeader = useAuthHeader();

  useEffect(() => {
    console.log(location.pathname)
      if (location) {
          if( current !== location.pathname ) {
              setCurrent(location.pathname);
          }
      }
  }, [location, current]);
  
  const handleManageUsers = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    navigate("/users/manage");
  }
  

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Logout',
      cancelText: 'Cancel',
      onOk() {
        logout(authHeader());
        signOut();
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }
  
  const UserDropdown: MenuProps['items'] = [
    {
      type: 'divider',
    },
    {
      label: (
        <a onClick={handleLogout}>
          Logout
        </a>
      ),
      key: 'logout',
      
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = (e) => {
    
    console.log(isAuthenticated());

    if (isAuthenticated())
      navigate('/' + e.key)
    else
      signOut();
  };

  const filterMenuItemsBasedOnPermissions = (items: MenuItem[]): MenuItem[] => {
    return items.filter((item) => {
      if (typeof user?.roles[0].permissions !== 'undefined' && user?.roles[0].permissions.length > 0){
        return item.permission_required ? user?.roles[0].permissions.some((usrPermission: Permission) => usrPermission.name === item.permission_required) : false;
      }
      return false;
    });
  }

  return (<Layout style={{ minHeight: '100vh' }}>
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={'15%'}>
      <div style={{ margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} >
        
      </div>
      <Menu theme="dark" defaultSelectedKeys={[location.pathname.substring(1)]} selectedKeys={[location.pathname.substring(1)]}  mode="inline" onClick={onClick} items={filterMenuItemsBasedOnPermissions(items)}  />
    </Sider>
    <Layout className="site-layout">
      <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between' }}>
        
        <Space style={{padding: 30,marginTop: 10}}>

          <Typography.Title level={3}> { 
              items.find(menuItem => '/'+menuItem.key === current)?.key || 'OPK Manager'
            }</Typography.Title>

        </Space>
        
        <Space style={{marginRight: '2em'}}>
          <Dropdown menu={ {items: [{
                                label: (
                                  <a onClick={handleManageUsers}>
                                    Manage Users
                                  </a>
                                ),
                                key: 'manage_users',
                              }, ...UserDropdown,]} }>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
              <h3>{ user?.name }({user?.email})</h3>
              <Avatar size={"large"} icon={<UserOutlined />} />
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Space>
      </Header>
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'TODO' }, { title: 'TODO' }]}/>
        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<ListCustomers />} />
            <Route path="/customers/new" element={<AddNewCustomers />} />
            <Route path="/customers/return_empties" element={<CustomerReturnEmpties />} />
            <Route path="/customers/list_all_customers" element={<ListCustomers />} />
            <Route path="/customers/add_empties_loan" element={<CreateCustomerEmptiesLoan />} />
            <Route path="/customers/record_sales" element={<RecordVSESales />} />
            <Route path="/customers/:id/history" element={<CustomerHistory />} />
            <Route path="/empties/empties_log" element={<EmptiesLog />} />
            <Route path="/empties/empties_returned_log" element={<ReturningEmptiesLog />} />
            <Route path="/empties/add_purchase_order" element={<AddPurchaseOrder />} />
            <Route path="/empties/add_returning_empties" element={<AddReturningEmpties />} />
            <Route path="/empties/on-ground" element={<SaveInHouseEmpties />} />
            <Route path="/empties/list-on-ground" element={<ListInHouseEmpties />} />
            <Route path="/empties/empties-overview" element={<EmptiesBalance />} />
            
            <Route path="/warehouse/products" element={<ProductManagement />} />
            {/* <Route path="/warehouse/inventory" element={<Inventory />} /> */}
            <Route path="/warehouse/pending-orders" element={<PendingOrders />} />
            <Route path="/warehouse/adjust-stock" element={<AdjustStock/>} />
            <Route path="/warehouse/receivables" element={<Receivables />} />
            <Route path="/warehouse/receivables-log" element={<ReceivablesLog />} />
            <Route path="warehouse/inventory-transaction" element={<InventoryHistory/>} />
            <Route path="/warehouse/addloadout" element={<AddLoadouts />} />
            <Route path="/warehouse/listloadouts" element={<LoadoutList />} />
            <Route path="/warehouse/takestock" element={<TakeStock />} />
            <Route path="/warehouse/stockinfo" element={<StockInfo />} />

            <Route path="POS/sales" element={<POS />} />
            <Route path="POS/orders" element={<Orders />} />

            <Route path="reports/daily-sales-report" element={<DailySalesReport />} />
            
            <Route path="/users/manage" element={<ManageUsers />} />
            <Route path={"/login"} element={<Login />} />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Empties Manager ©2023 Created with ❤️</Footer>
    </Layout>
  </Layout>);
};


export default LayoutBase;