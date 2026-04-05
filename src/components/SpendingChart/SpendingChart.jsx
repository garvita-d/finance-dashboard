import { useState } from "react";
import { Card, Row, Col, Typography, Tabs } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORY_COLORS } from "../../constants";
import styles from "./SpendingChart.module.scss";

const { Text } = Typography;

const TAB_ITEMS = [
  { key: "income", label: "Incomes" },
  { key: "expense", label: "Expenses" },
];

const getBreakdown = (transactions, type) => {
  const filtered = transactions.filter((t) => t.type === type);
  const map = {};
  filtered.forEach((t) => {
    map[t.category] = (map[t.category] || 0) + Number(t.amount);
  });
  const total = Object.values(map).reduce((s, v) => s + v, 0);
  return Object.entries(map)
    .map(([name, value]) => ({
      name,
      value,
      percent: total ? ((value / total) * 100).toFixed(1) : "0.0",
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);
};

const SpendingChart = ({ transactions = [] }) => {
  const [activeTab, setActiveTab] = useState("income");
  const data = getBreakdown(transactions, activeTab);

  return (
    <Card className={styles.card}>
      <Row justify="space-between" align="middle">
        <Col>
          <span className={styles.title}>Analytics</span>
        </Col>
      </Row>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={TAB_ITEMS}
        className={styles.tabs}
      />
      {data.length === 0 ? (
        <div className={styles.empty}>No data available</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={76}
                dataKey="value"
                strokeWidth={3}
                stroke="var(--bg-card)"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] || "#9ca3af"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, name) => [
                  `₹${Number(v).toLocaleString("en-IN")}`,
                  name,
                ]}
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                  fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.legend}>
            {data.map((entry) => (
              <div key={entry.name} className={styles.legendItem}>
                <span
                  className={styles.dot}
                  style={{
                    background: CATEGORY_COLORS[entry.name] || "#9ca3af",
                  }}
                />
                <span className={styles.legendLabel}>{entry.name}</span>
                <span className={styles.legendPct}>{entry.percent}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default SpendingChart;
