import { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Switch,
  Dropdown,
  Button,
  notification,
  Drawer,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useViewerMode } from "../..//components/hooks/useViewerMode";
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

const ShareSvg = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, logout, user } = useAppContext();
  const { isViewer } = useViewerMode();
  const [collapsed, setCollapsed] = useState(false);
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const isDark = theme === "dark";

  const getViewerLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("viewer", "true");
    url.pathname = "/dashboard";
    return url.toString();
  };

  const handleCopyViewerLink = async () => {
    const link = getViewerLink();
    try {
      await navigator.clipboard.writeText(link);
      notification.success({
        message: "Viewer link copied!",
        description:
          "Anyone with this link can view (but not edit) your dashboard.",
        duration: 4,
      });
      setShareDrawerOpen(false);
    } catch {
      notification.error({ message: "Could not copy. Try copying manually." });
    }
  };

  const handleMobileShare = async () => {
    const link = getViewerLink();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "inFlow — My Finance Dashboard",
          text: "View my personal finance dashboard (read-only):",
          url: link,
        });
      } catch {
        // User cancelled share — no-op
      }
    } else {
      setShareDrawerOpen(true);
    }
  };

  const userMenuItems = [
    {
      key: "email",
      label: <Text className={styles.userEmail}>{user?.email}</Text>,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "share",
      label: "🔗 Copy viewer link",
      onClick: handleCopyViewerLink,
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
        {isViewer && (
          <div className={styles.viewerBanner}>
            <span className={styles.viewerBannerIcon}>👁️</span>
            <span className={styles.viewerBannerText}>
              <strong>Viewer mode</strong> — you can browse but not make changes
            </span>
          </div>
        )}

        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.mobileLogoIcon}>F</div>
            <span className={styles.mobileLogoText}>inFlow</span>
          </div>
          <div className={styles.headerRight}>
            {!isViewer && (
              <button
                onClick={handleCopyViewerLink}
                className={`${styles.shareBtn} ${styles.desktopOnly}`}
              >
                🔗 Share view
              </button>
            )}

            {!isViewer && (
              <button
                onClick={handleMobileShare}
                className={`${styles.shareIconBtn} ${styles.mobileOnly}`}
                aria-label="Share viewer link"
              >
                <ShareSvg />
              </button>
            )}

            <div className={styles.themeToggle} onClick={toggleTheme}>
              <span className={styles.themeIcon}>{isDark ? "🌙" : "☀️"}</span>
              <Switch
                checked={isDark}
                size="small"
                style={{ background: isDark ? "#f97316" : "#d1d5db" }}
              />
            </div>

            {isViewer ? (
              <div className={styles.viewerChip}>
                <span className={styles.viewerDot} />
                Viewer
              </div>
            ) : (
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
            )}
          </div>
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

      <Drawer
        title="Share your dashboard"
        placement="bottom"
        height="auto"
        open={shareDrawerOpen}
        onClose={() => setShareDrawerOpen(false)}
        className={styles.shareDrawer}
        styles={{ body: { padding: "16px 20px 32px" } }}
      >
        <div className={styles.shareDrawerContent}>
          <p className={styles.shareDrawerDesc}>
            Share this read-only link — viewers can browse your dashboard but
            cannot add, edit, or delete anything.
          </p>

          <div className={styles.shareLinkBox}>
            <span className={styles.shareLinkText}>{getViewerLink()}</span>
          </div>

          <Button
            type="primary"
            block
            size="large"
            onClick={handleCopyViewerLink}
            className={styles.shareCopyBtn}
          >
            📋 Copy link
          </Button>
        </div>
      </Drawer>
    </Layout>
  );
};

export default AppLayout;
