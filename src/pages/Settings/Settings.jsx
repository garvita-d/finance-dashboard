import {
  Row,
  Col,
  Typography,
  Card,
  Select,
  Switch,
  Divider,
  Spin,
} from "antd";
import { useAppContext } from "../../context/AppContext";
import { useGetTransactions } from "../../api/transactions/queries";
import { ROLES } from "../../constants";
import styles from "./Settings.module.scss";

const { Title, Text } = Typography;

const ROLE_OPTIONS = [
  { label: "Admin — can add, edit, delete", value: ROLES.ADMIN },
  { label: "Viewer — read only", value: ROLES.VIEWER },
];

const Settings = () => {
  const { role, switchRole, theme, toggleTheme } = useAppContext();
  const { data: transactions = [], isLoading } = useGetTransactions();
  const isDark = theme === "dark";

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Row className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Settings
          </Title>
          <Text className={styles.subtitle}>
            Configure your dashboard preferences
          </Text>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={12}>
          <Card
            title={<Text className={styles.cardTitle}>Role & Permissions</Text>}
            className={styles.card}
          >
            <div className={styles.settingRow}>
              <div>
                <Text className={styles.settingLabel}>Current Role</Text>
                <Text className={styles.settingDesc}>
                  Switch between Admin and Viewer to simulate access levels
                </Text>
              </div>
              <Select
                value={role}
                options={ROLE_OPTIONS}
                onChange={switchRole}
                style={{ width: 200 }}
              />
            </div>
            <Divider />
            <div className={styles.permissionsGrid}>
              {[
                { label: "View transactions", allowed: true },
                { label: "Add transactions", allowed: role === ROLES.ADMIN },
                { label: "Edit transactions", allowed: role === ROLES.ADMIN },
                { label: "Delete transactions", allowed: role === ROLES.ADMIN },
                { label: "Export data", allowed: role === ROLES.ADMIN },
              ].map((perm) => (
                <div key={perm.label} className={styles.permRow}>
                  <Text className={styles.permLabel}>{perm.label}</Text>
                  <Switch checked={perm.allowed} size="small" disabled />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={<Text className={styles.cardTitle}>Appearance</Text>}
            className={styles.card}
          >
            <div className={styles.settingRow}>
              <div>
                <Text className={styles.settingLabel}>Dark Mode</Text>
                <Text className={styles.settingDesc}>
                  Follows your system preference by default
                </Text>
              </div>
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                checkedChildren="🌙"
                unCheckedChildren="☀️"
              />
            </div>
            <Divider />
            <div className={styles.settingRow}>
              <div>
                <Text className={styles.settingLabel}>Current Theme</Text>
                <Text className={styles.settingDesc}>Active display mode</Text>
              </div>
              <div
                className={styles.themeBadge}
                style={{
                  background: isDark ? "#1e1b4b" : "#eff1ff",
                  color: isDark ? "#a5b4fc" : "#4f46e5",
                }}
              >
                {isDark ? "🌙 Dark" : "☀️ Light"}
              </div>
            </div>
            <Divider />
            <div className={styles.settingRow}>
              <div>
                <Text className={styles.settingLabel}>Total Transactions</Text>
                <Text className={styles.settingDesc}>
                  Stored in your Supabase database
                </Text>
              </div>
              <div className={styles.countBadge}>{transactions.length}</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
