import { useState, useMemo, useCallback } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
  Table,
  Tag,
  Popconfirm,
  notification,
  Dropdown,
  Space,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { useAppContext } from "../../context/AppContext";
import { useGetTransactions } from "../../api/transactions/queries";
import TransactionModal from "../../components/TransactionModal/TransactionModal";
import { exportToCSV, exportToJSON } from "../../utils/helpers";
import { CATEGORIES, CATEGORY_COLORS } from "../../constants";
import {
  PlusIcon,
  SearchIcon,
  ExportIcon,
  EditIcon,
  DeleteIcon,
} from "../../icons/icons";
import styles from "./Transactions.module.scss";

const { Title, Text } = Typography;

const TYPE_FILTER_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
];

const CATEGORY_FILTER_OPTIONS = [
  { label: "All Categories", value: "" },
  ...CATEGORIES.map((c) => ({ label: c, value: c })),
];

const Transactions = () => {
  const { deleteTransaction, isDeleting } = useAppContext();
  const { data: transactions = [], isLoading } = useGetTransactions();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [modalState, setModalState] = useState({ open: false, editData: null });

  const openAddModal = useCallback(
    () => setModalState({ open: true, editData: null }),
    [],
  );
  const openEditModal = useCallback(
    (record) => setModalState({ open: true, editData: record }),
    [],
  );
  const closeModal = useCallback(
    () => setModalState({ open: false, editData: null }),
    [],
  );

  const handleDelete = useCallback(
    (id) => {
      deleteTransaction(id, {
        onSuccess: () =>
          notification.success({ message: "Transaction deleted" }),
      });
    },
    [deleteTransaction],
  );

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchSearch =
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter ? t.type === typeFilter : true;
        const matchCategory = categoryFilter
          ? t.category === categoryFilter
          : true;
        return matchSearch && matchType && matchCategory;
      })
      .sort((a, b) =>
        sortOrder === "desc"
          ? dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
          : dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      );
  }, [transactions, search, typeFilter, categoryFilter, sortOrder]);

  const exportMenuItems = [
    {
      key: "csv",
      label: "Export as CSV",
      onClick: () => exportToCSV(filtered),
    },
    {
      key: "json",
      label: "Export as JSON",
      onClick: () => exportToJSON(filtered),
    },
  ];

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (d) => (
        <span className={styles.dateText}>
          {dayjs(d).format("DD MMM YYYY")}
        </span>
      ),
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <Row align="middle" gutter={10}>
          <Col>
            <div
              className={styles.txDot}
              style={{
                background: CATEGORY_COLORS[record.category] || "#9ca3af",
              }}
            />
          </Col>
          <Col>
            <span className={styles.descText}>{text}</span>
          </Col>
        </Row>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => (
        <Tag
          style={{
            background: `${CATEGORY_COLORS[cat] || "#9ca3af"}20`,
            color: CATEGORY_COLORS[cat] || "#9ca3af",
            border: "none",
          }}
        >
          {cat}
        </Tag>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={type === "income" ? "success" : "error"}
          style={{ textTransform: "capitalize" }}
        >
          {type}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <span
          className={
            record.type === "income" ? styles.amountIn : styles.amountOut
          }
        >
          {record.type === "income" ? "+" : "-"}₹
          {Number(amount).toLocaleString("en-IN")}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditIcon />}
            onClick={() => openEditModal(record)}
            className={styles.editBtn}
          />
          <Popconfirm
            title="Delete this transaction?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteIcon />}
              className={styles.deleteBtn}
              loading={isDeleting}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Transactions
          </Title>
          <span className={styles.subtitle}>
            {filtered.length} transactions found
          </span>
        </Col>
        <Col>
          <Space size={8}>
            <Dropdown menu={{ items: exportMenuItems }}>
              <Button icon={<ExportIcon />} size="small">
                Export
              </Button>
            </Dropdown>
            <Button
              type="primary"
              icon={<PlusIcon />}
              onClick={openAddModal}
              size="small"
            >
              Add new
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filters */}
      <Row gutter={[8, 8]} className={styles.filterRow} align="middle">
        <Col xs={24} sm={8}>
          <Input
            placeholder="Search transactions..."
            prefix={<SearchIcon />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={8} sm={4}>
          <Select
            options={TYPE_FILTER_OPTIONS}
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={8} sm={5}>
          <Select
            options={CATEGORY_FILTER_OPTIONS}
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: "100%" }}
            showSearch
          />
        </Col>
        <Col xs={8} sm={4}>
          <Select
            value={sortOrder}
            onChange={setSortOrder}
            style={{ width: "100%" }}
            options={[
              { label: "Newest", value: "desc" },
              { label: "Oldest", value: "asc" },
            ]}
          />
        </Col>
      </Row>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📭</div>
          <span className={styles.emptyText}>No transactions found</span>
          <span className={styles.emptyHint}>
            Try adjusting your filters or add a new transaction
          </span>
        </div>
      ) : (
        <>
          <div className={styles.desktopTable}>
            <Table
              dataSource={filtered}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10, showSizeChanger: true }}
              className={styles.table}
            />
          </div>

          <div className={styles.mobileCardList}>
            {filtered.map((tx) => {
              const color = CATEGORY_COLORS[tx.category] || "#9ca3af";
              const isIncome = tx.type === "income";
              return (
                <div key={tx.id} className={styles.mobileCard}>
                  <div
                    className={styles.mobileCardDot}
                    style={{ background: `${color}22` }}
                  >
                    <span style={{ color, fontSize: 16 }}>
                      {tx.category?.[0]}
                    </span>
                  </div>
                  <div className={styles.mobileCardBody}>
                    <span className={styles.mobileCardDesc}>
                      {tx.description}
                    </span>
                    <div className={styles.mobileCardMeta}>
                      <span className={styles.mobileCardDate}>
                        {dayjs(tx.date).format("DD MMM YYYY")}
                      </span>
                      <span
                        className={styles.mobileCardCat}
                        style={{
                          background: `${color}18`,
                          color,
                        }}
                      >
                        {tx.category}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 6,
                    }}
                  >
                    <span
                      className={styles.mobileCardAmount}
                      style={{ color: isIncome ? "#10b981" : "#ef4444" }}
                    >
                      {isIncome ? "+" : "-"}₹
                      {Number(tx.amount).toLocaleString("en-IN")}
                    </span>
                    <div className={styles.mobileCardActions}>
                      <Space size={4}>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditIcon />}
                          onClick={() => openEditModal(tx)}
                          className={styles.editBtn}
                        />
                        <Popconfirm
                          title="Delete?"
                          onConfirm={() => handleDelete(tx.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteIcon />}
                            className={styles.deleteBtn}
                          />
                        </Popconfirm>
                      </Space>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <TransactionModal
        open={modalState.open}
        onClose={closeModal}
        editData={modalState.editData}
      />
    </div>
  );
};

export default Transactions;
