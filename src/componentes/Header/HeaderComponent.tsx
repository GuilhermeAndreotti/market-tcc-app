import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, theme } from 'antd';
const { Header } = Layout;


interface IHeader {
  collapsed: boolean;
  setCollapsed: any;
}

export const HeaderComponent = ({ collapsed, setCollapsed }: IHeader) => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
    return (
        <>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
        </>
    );
};
