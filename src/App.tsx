import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarComponent } from './componentes/Sidebar/Sidebar';
import { HeaderComponent } from './componentes/Header/HeaderComponent';
import './index.css';
import { ToastContainer } from 'react-toastify';

const { Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);  
  const location = useLocation();
  const isRoot = location.pathname === '/' || location.pathname === '/new-password';
  

  return (
    !isRoot ? (
      <Layout className='main-app'>
        <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed}/>
        <Layout>  
          <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed}/>
          <Content className='content'>
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    ) : (
      <Layout className='main-app'>
        <Layout>        
          <Outlet/>
        </Layout>
      </Layout>
    )
  );
};

export default App;