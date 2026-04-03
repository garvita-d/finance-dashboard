import { Row, Col, Typography, Card, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetTransactions } from "../../api/transactions/queries";
import {
  getCategoryBreakdown,
  getMonthlyComparison,
  getTotalExpenses,
  getTotalIncome,
} from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../constants";
import styles from "./Analytics.module.scss";

const { Title, Text } = Typography;

const Analytics = () => {
  const { data: transactions = [], isLoading } = useGetTransactions();

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Spin size="large" />
      </div>
    );
  }

  const breakdown = getCategoryBreakdown(transactions);
  const monthly = getMonthlyComparison(transactions);
  const topCategory = breakdown[0];
  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
      : 0;

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Analytics & Insights
          </Title>
          <Text className={styles.subtitle}>
            Understand your financial patterns
          </Text>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={8}>
          <Card className={styles.insightCard}>
            <div
              className={styles.insightIcon}
              style={{ background: "#fef3c7" }}
            >
              🏆
            </div>
            <Text className={styles.insightLabel}>Highest Spending</Text>
            <Text
              className={styles.insightValue}
              style={{ color: CATEGORY_COLORS[topCategory?.name] || "#374151" }}
            >
              {topCategory?.name || "N/A"}
            </Text>
            <Text className={styles.insightSub}>
              ${topCategory?.value?.toLocaleString() || 0} total
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.insightCard}>
            <div
              className={styles.insightIcon}
              style={{ background: "#d1fae5" }}
            >
              💰
            </div>
            <Text className={styles.insightLabel}>Savings Rate</Text>
            <Text className={styles.insightValue} style={{ color: "#10b981" }}>
              {savingsRate}%
            </Text>
            <Text className={styles.insightSub}>of total income saved</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.insightCard}>
            <div
              className={styles.insightIcon}
              style={{ background: "#ede9fe" }}
            >
              📊
            </div>
            <Text className={styles.insightLabel}>Expense Categories</Text>
            <Text className={styles.insightValue} style={{ color: "#4f46e5" }}>
              {breakdown.length}
            </Text>
            <Text className={styles.insightSub}>active spending areas</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} className={styles.chartSection}>
        <Col xs={24} xl={14}>
          <Card
            title={
              <Text className={styles.cardTitle}>
                Monthly Income vs Expenses
              </Text>
            }
            className={styles.chartCard}
          >
            {monthly.length === 0 ? (
              <div className={styles.empty}>No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={monthly}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, ""]} />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  <Bar
                    dataKey="income"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Income"
                  />
                  <Bar
                    dataKey="expense"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    name="Expense"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card
            title={<Text className={styles.cardTitle}>Spending Breakdown</Text>}
            className={styles.chartCard}
          >
            {breakdown.length === 0 ? (
              <div className={styles.empty}>No expense data</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={breakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {breakdown.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={CATEGORY_COLORS[entry.name] || "#9ca3af"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`$${v.toLocaleString()}`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.breakdownList}>
                  {breakdown.slice(0, 5).map((item) => (
                    <Row
                      key={item.name}
                      justify="space-between"
                      align="middle"
                      className={styles.breakdownRow}
                    >
                      <Col>
                        <Row align="middle" gutter={8}>
                          <Col>
                            <span
                              className={styles.breakdownDot}
                              style={{
                                background:
                                  CATEGORY_COLORS[item.name] || "#9ca3af",
                              }}
                            />
                          </Col>
                          <Col>
                            <Text className={styles.breakdownName}>
                              {item.name}
                            </Text>
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Row align="middle" gutter={12}>
                          <Col>
                            <Text className={styles.breakdownPct}>
                              {item.percent}%
                            </Text>
                          </Col>
                          <Col>
                            <Text className={styles.breakdownAmt}>
                              ${item.value.toLocaleString()}
                            </Text>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
