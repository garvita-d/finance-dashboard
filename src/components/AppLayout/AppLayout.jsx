import { useState } from "react";
import {
  Layout,
  Menu,
  Select,
  Avatar,
  Typography,
  Row,
  Col,
  Badge,
  Switch,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import {
  DashboardIcon,
  AnalyticsIcon,
  TransactionIcon,
  SettingsIcon,
  AccountIcon,
} from "../../icons/icons";
import { ROLES } from "../../constants";
import styles from "./AppLayout.module.scss";

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const NAV_ITEMS = [
  { key: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { key: "/analytics", label: "Analytics", icon: <AnalyticsIcon /> },
  { key: "/transactions", label: "Transaction", icon: <TransactionIcon /> },
  { key: "/settings", label: "Setting", icon: <SettingsIcon /> },
  { key: "/account", label: "Account", icon: <AccountIcon /> },
];

const ROLE_OPTIONS = [
  { label: "Admin", value: ROLES.ADMIN },
  { label: "Viewer", value: ROLES.VIEWER },
];

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, switchRole, theme, toggleTheme } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const isDark = theme === "dark";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className={styles.sider}
      >
        <div className={styles.logo}>
          {!collapsed && (
            <div className={styles.logoBox}>
              <span className={styles.logoIcon}>F</span>
              <Text strong className={styles.logoText}>
                inFlow
              </Text>
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={NAV_ITEMS}
          onClick={({ key }) => navigate(key)}
          className={styles.menu}
          theme={isDark ? "dark" : "light"}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Row
            align="middle"
            justify="space-between"
            style={{ height: "100%" }}
          >
            <Col flex="auto">
              <div className={styles.searchBox}>
                <input placeholder="Search..." className={styles.searchInput} />
              </div>
            </Col>
            <Col>
              <Row align="middle" gutter={16}>
                <Col>
                  <div className={styles.themeToggle}>
                    <span className={styles.themeIcon}>
                      {isDark ? "🌙" : "☀️"}
                    </span>
                    <Switch
                      checked={isDark}
                      onChange={toggleTheme}
                      size="small"
                      style={{ background: isDark ? "#4f46e5" : "#d1d5db" }}
                    />
                  </div>
                </Col>
                <Col>
                  <Select
                    value={role}
                    options={ROLE_OPTIONS}
                    onChange={switchRole}
                    size="small"
                    style={{ width: 110 }}
                  />
                </Col>
                <Col>
                  <Badge dot>
                    <div className={styles.notifBtn}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path d="M9 2a5 5 0 0 1 5 5v3l1.5 2.5H2.5L4 10V7a5 5 0 0 1 5-5z" />
                        <path d="M7 14.5a2 2 0 0 0 4 0" />
                      </svg>
                    </div>
                  </Badge>
                </Col>
                <Col>
                  <Avatar
                    size={36}
                    style={{ background: "#4f46e5", cursor: "pointer" }}
                  >
                    U
                  </Avatar>
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
