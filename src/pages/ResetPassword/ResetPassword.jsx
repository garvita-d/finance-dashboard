import { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Result } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../api/auth/mutations";
import supabase from "../../config/supabaseClient";
import styles from "../Login/Login.module.scss";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const resetMutation = useMutation({
    mutationFn: (newPassword) => updatePassword(newPassword),
    onSuccess: () => setDone(true),
    onError: (err) => setError(err.message || "Failed to reset password"),
  });

  const handleSubmit = ({ password }) => resetMutation.mutate(password);

  return (
    <div data-theme="light">
      <div className={styles.page}>
        <div className={styles.waveBg}>
          <svg
            viewBox="0 0 1440 800"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,400 C200,250 400,550 600,350 C800,150 1000,500 1200,300 C1350,180 1420,320 1440,280 L1440,800 L0,800 Z"
              fill="rgba(249,115,22,0.08)"
            />
            <path
              d="M0,500 C150,350 350,600 550,420 C750,240 950,550 1150,380 C1320,240 1400,380 1440,350 L1440,800 L0,800 Z"
              fill="rgba(249,115,22,0.06)"
            />
          </svg>
        </div>

        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <Title level={3} className={styles.brand}>
                inFlow
              </Title>
            </div>
            <div className={styles.cardBody}>
              {done ? (
                <Result
                  status="success"
                  title="Password updated!"
                  subTitle="You can now sign in with your new password."
                  extra={
                    <Button
                      type="primary"
                      className={styles.submitBtn}
                      onClick={() => navigate("/login")}
                    >
                      Go to Sign In
                    </Button>
                  }
                />
              ) : !ready ? (
                <div className={styles.confirmBox}>
                  <div className={styles.confirmIcon}>🔐</div>
                  <Title level={4} className={styles.cardTitle}>
                    Verifying link…
                  </Title>
                  <Text className={styles.cardSub}>
                    Please wait while we verify your reset link.
                  </Text>
                </div>
              ) : (
                <>
                  <div className={styles.cardHeader}>
                    <Title level={4} className={styles.cardTitle}>
                      Set new password
                    </Title>
                    <Text className={styles.cardSub}>
                      Enter a new password for your account
                    </Text>
                  </div>
                  {error && (
                    <Text
                      style={{
                        color: "#ef4444",
                        display: "block",
                        marginBottom: 12,
                      }}
                    >
                      {error}
                    </Text>
                  )}
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className={styles.form}
                  >
                    <Form.Item
                      name="password"
                      label="New Password"
                      rules={[
                        {
                          required: true,
                          min: 6,
                          message: "At least 6 characters",
                        },
                      ]}
                    >
                      <Input.Password
                        placeholder="Enter new password"
                        size="large"
                        className={styles.input}
                      />
                    </Form.Item>
                    <Form.Item
                      name="confirm"
                      label="Confirm Password"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value)
                              return Promise.resolve();
                            return Promise.reject(
                              new Error("Passwords do not match"),
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder="Confirm new password"
                        size="large"
                        className={styles.input}
                      />
                    </Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={resetMutation.isPending}
                      className={styles.submitBtn}
                    >
                      Update Password
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
