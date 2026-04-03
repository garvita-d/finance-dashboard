import { Card, Typography, Row, Col } from "antd";
import { TrendUpIcon, TrendDownIcon } from "../../icons/icons";
import styles from "./SummaryCard.module.scss";

const { Text, Title } = Typography;

const SummaryCard = ({ title, amount, percent, isPositive, icon, color }) => {
  return (
    <Card className={styles.card}>
      <Row justify="space-between" align="top">
        <Col>
          <div className={styles.iconWrap} style={{ background: `${color}18` }}>
            <span style={{ color }}>{icon}</span>
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
        <Text className={styles.label}>{title}</Text>
        <Title level={3} className={styles.amount}>
          ${amount?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </Title>
      </div>
    </Card>
  );
};

export default SummaryCard;
