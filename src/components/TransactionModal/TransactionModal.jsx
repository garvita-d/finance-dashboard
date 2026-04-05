import { useEffect } from "react";
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
  const { addTransaction, editTransaction, isAdding, isEditing } =
    useAppContext();

  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue({
          ...editData,
          date: dayjs(editData.date),
        });
      } else {
        form.setFieldsValue({
          type: TRANSACTION_TYPES.EXPENSE,
          date: dayjs(),
          description: undefined,
          amount: undefined,
          category: undefined,
        });
      }
    }
  }, [open, editData, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        amount: Number(values.amount),
      };
      if (editData) {
        editTransaction(
          { id: editData.id, ...payload },
          {
            onSuccess: () => {
              notification.success({ message: "Transaction updated" });
              form.resetFields();
              onClose();
            },
          },
        );
      } else {
        addTransaction(payload, {
          onSuccess: () => {
            notification.success({ message: "Transaction added" });
            form.resetFields();
            onClose();
          },
        });
      }
    });
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      title={editData ? "Edit Transaction" : "Add Transaction"}
      footer={null}
      width={480}
      destroyOnClose={false}
    >
      <Form form={form} layout="vertical" className={styles.form}>
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
                prefix="₹"
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
            <Button
              onClick={() => {
                form.resetFields();
                onClose();
              }}
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={isAdding || isEditing}
            >
              {editData ? "Update" : "Add Transaction"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TransactionModal;
