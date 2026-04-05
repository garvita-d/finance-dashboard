import { useState } from "react";
import { Card, Row, Col, Typography, Tabs, Dropdown } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import styles from "./BalanceChart.module.scss";

const { Title, Text } = Typography;

const TAB_ITEMS = [
  { key: "expense", label: "Expense" },
  { key: "income", label: "Incomes" },
  { key: "net", label: "Savings" },
  { key: "investment", label: "Investment" },
];

const CHART_COLORS = {
  expense: "#f97316",
  income: "#10b981",
  net: "#8b5cf6",
  investment: "#06b6d4",
};

const DAY_OPTIONS = [
  { key: "7", label: "Last 7 days" },
  { key: "14", label: "Last 14 days" },
  { key: "30", label: "Last 30 days" },
];

const CustomTooltip = ({ active, payload, label, color }) => {
  if (active && payload?.length) {
    return (
      <div className={styles.tooltip} style={{ background: color }}>
        <Text className={styles.tooltipDate}>{label}</Text>
        <Text className={styles.tooltipValue}>
          ₹{Number(payload[0]?.value || 0).toLocaleString("en-IN")}
        </Text>
      </div>
    );
  }
  return null;
};

const BalanceChart = ({ transactions = [] }) => {
  const [activeTab, setActiveTab] = useState("expense");
  const [days, setDays] = useState(7);
  const [daysLabel, setDaysLabel] = useState("Last 7 days");

  const trendData = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, "day");
    const dateStr = date.format("YYYY-MM-DD");
    const label = date.format("DD MMM");
    const dayTx = transactions.filter((t) => t.date === dateStr);

    const income = dayTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);
    const expense = dayTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);
    const investment = dayTx
      .filter((t) => t.category === "Investment")
      .reduce((s, t) => s + Number(t.amount), 0);

    trendData.push({
      label,
      expense,
      income,
      net: income - expense,
      investment,
    });
  }

  const balance = transactions.reduce(
    (s, t) =>
      t.type === "income" ? s + Number(t.amount) : s - Number(t.amount),
    0,
  );

  const activeColor = CHART_COLORS[activeTab];
  const gradientId = `grad_${activeTab}`;

  const dropdownItems = DAY_OPTIONS.map((opt) => ({
    key: opt.key,
    label: opt.label,
    onClick: () => {
      setDays(Number(opt.key));
      setDaysLabel(opt.label);
    },
  }));

  return (
    <Card className={styles.card}>
      <Row
        justify="space-between"
        align="middle"
        className={styles.chartHeader}
      >
        <Col>
          <span className={styles.balanceLabel}>Your Balance</span>
          <Row align="middle" gutter={10}>
            <Col>
              <div className={styles.balanceAmount}>
                ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </Col>
            <Col>
              <span className={styles.trendBadge}>↑ 20.32%</span>
            </Col>
          </Row>
        </Col>
        <Col>
          <Dropdown
            menu={{ items: dropdownItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <div className={styles.periodBadge}>{daysLabel} ▾</div>
          </Dropdown>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={TAB_ITEMS}
        className={styles.tabs}
      />

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={trendData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={activeColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={activeColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
          />
          <Tooltip content={<CustomTooltip color={activeColor} />} />
          <Area
            type="monotone"
            dataKey={activeTab}
            stroke={activeColor}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={{ r: 4, fill: activeColor, strokeWidth: 0 }}
            activeDot={{
              r: 6,
              fill: "#fff",
              stroke: activeColor,
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BalanceChart;
