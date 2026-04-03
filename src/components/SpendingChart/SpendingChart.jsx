import { Card, Row, Col, Typography, Tabs } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getCategoryBreakdown } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../constants";
import styles from "./SpendingChart.module.scss";

const { Text } = Typography;

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.08) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const TAB_ITEMS = [
  { key: "incomes", label: "Incomes" },
  { key: "expenses", label: "Expenses" },
];

const SpendingChart = ({ transactions = [] }) => {
  const breakdown = getCategoryBreakdown(transactions);
  const topFour = breakdown.slice(0, 4);

  return (
    <Card className={styles.card}>
      <Row justify="space-between" align="middle">
        <Col>
          <Text className={styles.title}>Analytics</Text>
        </Col>
        <Col>
          <div className={styles.infoIcon}>i</div>
        </Col>
      </Row>
      <Tabs
        defaultActiveKey="incomes"
        items={TAB_ITEMS}
        className={styles.tabs}
      />
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={topFour}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            strokeWidth={2}
            stroke="#fff"
          >
            {topFour.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name] || "#9ca3af"}
              />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, ""]} />
        </PieChart>
      </ResponsiveContainer>
      <div className={styles.legend}>
        {topFour.map((entry) => (
          <div key={entry.name} className={styles.legendItem}>
            <span
              className={styles.dot}
              style={{ background: CATEGORY_COLORS[entry.name] || "#9ca3af" }}
            />
            <Text className={styles.legendLabel}>{entry.name}</Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SpendingChart;
