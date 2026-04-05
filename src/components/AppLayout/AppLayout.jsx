import { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Row,
  Col,
  Switch,
  Dropdown,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import {
  DashboardIcon,
  AnalyticsIcon,
  TransactionIcon,
  SettingsIcon,
} from "../../icons/icons";
import styles from "./AppLayout.module.scss";

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const NAV_ITEMS = [
  {
    key: "/dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    emoji: "🏠",
  },
  {
    key: "/analytics",
    label: "Analytics",
    icon: <AnalyticsIcon />,
    emoji: "📊",
  },
  {
    key: "/transactions",
    label: "Transactions",
    icon: <TransactionIcon />,
    emoji: "💳",
  },
  { key: "/settings", label: "Settings", icon: <SettingsIcon />, emoji: "⚙️" },
];

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, logout, user } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const isDark = theme === "dark";

  const userMenuItems = [
    {
      key: "email",
      label: <Text className={styles.userEmail}>{user?.email}</Text>,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "signout",
      label: "Sign Out",
      danger: true,
      onClick: logout,
    },
  ];

  const initials = user?.email?.[0]?.toUpperCase() || "U";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className={styles.sider}
        style={{ background: "var(--bg-card)" }}
      >
        <div className={styles.logo}>
          <div className={styles.logoIcon}>F</div>
          {!collapsed && <span className={styles.logoText}>inFlow</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={NAV_ITEMS.map(({ key, label, icon }) => ({
            key,
            label,
            icon,
          }))}
          onClick={({ key }) => navigate(key)}
          className={styles.menu}
          style={{ background: "transparent", borderInlineEnd: "none" }}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <Row
            align="middle"
            justify="space-between"
            style={{ height: "100%" }}
          >
            <Col className={styles.mobileLogo}>
              <div className={styles.mobileLogoIcon}>F</div>
              <span className={styles.mobileLogoText}>inFlow</span>
            </Col>

            <Col>
              <Row align="middle" gutter={12}>
                <Col>
                  <div className={styles.themeToggle} onClick={toggleTheme}>
                    <span className={styles.themeIcon}>
                      {isDark ? "🌙" : "☀️"}
                    </span>
                    <Switch
                      checked={isDark}
                      size="small"
                      style={{ background: isDark ? "#f97316" : "#d1d5db" }}
                    />
                  </div>
                </Col>
                <Col>
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={["click"]}
                  >
                    <Avatar
                      size={36}
                      style={{
                        background: "#f97316",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      {initials}
                    </Avatar>
                  </Dropdown>
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>

        <Content className={styles.content}>{children}</Content>
      </Layout>

      <nav className={styles.bottomNav}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.key;
          return (
            <button
              key={item.key}
              className={styles.bottomNavItem}
              onClick={() => navigate(item.key)}
            >
              <span
                className={`${styles.bottomNavIcon} ${isActive ? styles.active : ""}`}
              >
                {item.emoji}
              </span>
              <span
                className={`${styles.bottomNavLabel} ${isActive ? styles.active : ""}`}
              >
                {item.label}
              </span>
              {isActive && <span className={styles.bottomNavDot} />}
            </button>
          );
        })}
      </nav>
    </Layout>
  );
};

export default AppLayout;
