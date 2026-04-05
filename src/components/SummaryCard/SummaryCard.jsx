import { Card, Typography, Row, Col } from "antd";
import { TrendUpIcon, TrendDownIcon } from "../../icons/icons";
import styles from "./SummaryCard.module.scss";

const { Title, Text } = Typography;

const SummaryCard = ({ title, amount, percent, isPositive, icon, color }) => {
  return (
    <Card className={styles.card}>
      <Row justify="space-between" align="top">
        <Col>
          <div className={styles.iconWrap} style={{ background: `${color}20` }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
          </div>
        </Col>
        <Col>
          <div
            className={`${styles.badge} ${isPositive ? styles.badgeUp : styles.badgeDown}`}
          >
            {isPositive ? <TrendUpIcon /> : <TrendDownIcon />}
            <span>{percent}%</span>
          </div>
        </Col>
      </Row>
      <div className={styles.body}>
        <span className={styles.label}>{title}</span>
        <div className={styles.amount}>
          ₹
          {Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </div>
      </div>
    </Card>
  );
};

export default SummaryCard;
