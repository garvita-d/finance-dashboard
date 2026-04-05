import {
  Row,
  Col,
  Typography,
  Card,
  Switch,
  Divider,
  Spin,
  Avatar,
} from "antd";
import { useAppContext } from "../../context/AppContext";
import { useGetTransactions } from "../../api/transactions/queries";
import styles from "./Settings.module.scss";

const { Title, Text } = Typography;

const Settings = () => {
  const { theme, toggleTheme, user } = useAppContext();
  const { data: transactions = [], isLoading } = useGetTransactions();
  const isDark = theme === "dark";

  const userInitial = user?.email?.[0]?.toUpperCase() ?? "U";

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.pageTitle}>
          Settings
        </Title>
        <Text className={styles.subtitle}>
          Configure your dashboard preferences
        </Text>
      </div>

      <Row gutter={[20, 20]}>
        {/* Account Card */}
        <Col xs={24} md={12}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className={styles.cardTitle}>Account</span>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>{userInitial}</div>
                <div>
                  <span className={styles.settingLabel}>Signed in as</span>
                  <span className={styles.settingEmail}>{user?.email}</span>
                </div>
              </div>
              <div className={styles.activeBadge}>
                <span className={styles.activeDot} />
                Active
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.settingRow}>
              <div>
                <span className={styles.settingLabel}>Total Transactions</span>
                <span className={styles.settingDesc}>
                  Stored in Supabase database
                </span>
              </div>
              <div className={styles.countBadge}>{transactions.length}</div>
            </div>
          </div>
        </Col>

        {/* Appearance Card */}
        <Col xs={24} md={12}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </span>
              <span className={styles.cardTitle}>Appearance</span>
            </div>

            <div className={styles.settingRow}>
              <div>
                <span className={styles.settingLabel}>Dark Mode</span>
                <span className={styles.settingDesc}>
                  Follows your system preference by default
                </span>
              </div>
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                checkedChildren="🌙"
                unCheckedChildren="☀️"
                className={styles.switch}
              />
            </div>

            <div className={styles.divider} />

            <div className={styles.settingRow}>
              <div>
                <span className={styles.settingLabel}>Current Theme</span>
                <span className={styles.settingDesc}>Active display mode</span>
              </div>
              <div
                className={`${styles.themeBadge} ${isDark ? styles.themeDark : styles.themeLight}`}
              >
                {isDark ? "🌙 Dark" : "☀️ Light"}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
