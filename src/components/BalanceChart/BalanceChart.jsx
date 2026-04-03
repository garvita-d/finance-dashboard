import { Card, Row, Col, Typography, Tabs } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getBalanceTrend } from "../../utils/helpers";
import { CHART_DAYS } from "../../constants";
import styles from "./BalanceChart.module.scss";

const { Title, Text } = Typography;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className={styles.tooltip}>
        <Text className={styles.tooltipDate}>{label}</Text>
        <Text className={styles.tooltipValue}>
          ${payload[0]?.value?.toLocaleString()}
        </Text>
      </div>
    );
  }
  return null;
};

const TAB_ITEMS = [
  { key: "expense", label: "Expense" },
  { key: "income", label: "Incomes" },
  { key: "net", label: "Savings" },
  { key: "investment", label: "Investment" },
];

const BalanceChart = ({ transactions = [] }) => {
  const trendData = getBalanceTrend(transactions, CHART_DAYS);
  const balance = transactions.reduce(
    (s, t) => (t.type === "income" ? s + t.amount : s - t.amount),
    0,
  );

  return (
    <Card className={styles.card}>
      <Row
        justify="space-between"
        align="middle"
        className={styles.chartHeader}
      >
        <Col>
          <Text className={styles.balanceLabel}>Your Balance</Text>
          <Row align="middle" gutter={10}>
            <Col>
              <Title level={2} className={styles.balanceAmount}>
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Title>
            </Col>
            <Col>
              <span className={styles.trendBadge}>↑ 20.32%</span>
            </Col>
          </Row>
        </Col>
        <Col>
          <div className={styles.periodBadge}>Last 7 days ▾</div>
        </Col>
      </Row>
      <Tabs
        defaultActiveKey="expense"
        items={TAB_ITEMS}
        className={styles.tabs}
      />
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={trendData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#4f46e5"
            strokeWidth={2.5}
            fill="url(#balanceGrad)"
            dot={{ r: 4, fill: "#4f46e5", strokeWidth: 0 }}
            activeDot={{
              r: 6,
              fill: "#fff",
              stroke: "#4f46e5",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BalanceChart;
