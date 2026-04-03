import { Row, Col, Typography, Card, Avatar, Spin, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetTransactions } from "../../api/transactions/queries";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import BalanceChart from "../../components/BalanceChart/BalanceChart";
import SpendingChart from "../../components/SpendingChart/SpendingChart";
import {
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  formatCurrency,
} from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../constants";
import styles from "./Dashboard.module.scss";

const { Title, Text } = Typography;

const CARD_CONFIG = (income, expenses, balance) => [
  {
    title: "Balance",
    amount: balance,
    percent: "10.32",
    isPositive: true,
    color: "#4f46e5",
    icon: "💳",
  },
  {
    title: "Incomes This Month",
    amount: income,
    percent: "16.02",
    isPositive: true,
    color: "#10b981",
    icon: "📥",
  },
  {
    title: "Expenses This Month",
    amount: expenses,
    percent: "4.32",
    isPositive: false,
    color: "#ef4444",
    icon: "📤",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: transactions = [], isLoading } = useGetTransactions();

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Spin size="large" />
      </div>
    );
  }

  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  const balance = getBalance(transactions);
  const recentTransactions = transactions.slice(0, 4);
  const cards = CARD_CONFIG(income, expenses, balance);

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.pageHeader}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Dashboard
          </Title>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {cards.map((card) => (
          <Col xs={24} sm={12} lg={8} key={card.title}>
            <SummaryCard {...card} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} xl={15}>
          <BalanceChart transactions={transactions} />
        </Col>
        <Col xs={24} xl={9}>
          <SpendingChart transactions={transactions} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card
            title={
              <Text className={styles.sectionTitle}>Recent Transactions</Text>
            }
            extra={
              <Button
                type="link"
                onClick={() => navigate("/transactions")}
                className={styles.viewAll}
              >
                View all
              </Button>
            }
            className={styles.txCard}
          >
            {recentTransactions.length === 0 ? (
              <div className={styles.empty}>No transactions yet</div>
            ) : (
              <Row gutter={[12, 0]}>
                {recentTransactions.map((tx) => (
                  <Col xs={24} sm={12} key={tx.id}>
                    <div className={styles.txItem}>
                      <Avatar
                        size={36}
                        style={{
                          background: `${CATEGORY_COLORS[tx.category] || "#6b7280"}18`,
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            color: CATEGORY_COLORS[tx.category] || "#6b7280",
                            fontSize: 15,
                          }}
                        >
                          {tx.category?.[0]}
                        </span>
                      </Avatar>
                      <div className={styles.txMeta}>
                        <Text className={styles.txName}>{tx.description}</Text>
                        <Text className={styles.txDate}>{tx.date}</Text>
                      </div>
                      <Text
                        className={
                          tx.type === "income"
                            ? styles.txAmountIn
                            : styles.txAmountOut
                        }
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </Text>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
