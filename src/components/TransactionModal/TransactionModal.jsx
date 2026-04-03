import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Button,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useAppContext } from "../../context/AppContext";
import { CATEGORIES, TRANSACTION_TYPES } from "../../constants";
import styles from "./TransactionModal.module.scss";

const TYPE_OPTIONS = [
  { label: "Income", value: TRANSACTION_TYPES.INCOME },
  { label: "Expense", value: TRANSACTION_TYPES.EXPENSE },
];

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ label: c, value: c }));

const TransactionModal = ({ open, onClose, editData }) => {
  const [form] = Form.useForm();
  const { addTransaction, editTransaction } = useAppContext();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        amount: Number(values.amount),
      };
      if (editData) {
        editTransaction({ id: editData.id, ...payload });
        notification.success({ message: "Transaction updated" });
      } else {
        addTransaction(payload);
        notification.success({ message: "Transaction added" });
      }
      form.resetFields();
      onClose();
    });
  };

  const initialValues = editData
    ? { ...editData, date: dayjs(editData.date) }
    : { type: TRANSACTION_TYPES.EXPENSE, date: dayjs() };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={editData ? "Edit Transaction" : "Add Transaction"}
      footer={null}
      width={480}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className={styles.form}
      >
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Enter description" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                placeholder="0.00"
                min={0}
                precision={2}
                style={{ width: "100%" }}
                prefix="$"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select options={TYPE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select options={CATEGORY_OPTIONS} showSearch />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end" gutter={12} className={styles.footer}>
          <Col>
            <Button onClick={onClose}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={handleSubmit}>
              {editData ? "Update" : "Add Transaction"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TransactionModal;
