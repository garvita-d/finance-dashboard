import { useState } from "react";
import { Form, Input, Button, Typography, Checkbox, notification } from "antd";
import { useMutation } from "@tanstack/react-query";
import { signIn, signUp } from "../../api/auth/mutations";
import styles from "./Login.module.scss";

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [tab, setTab] = useState("signin");

  const signInMutation = useMutation({
    mutationFn: (payload) => signIn(payload),
    onError: (err) =>
      notification.error({ message: err.message || "Sign in failed" }),
  });

  const signUpMutation = useMutation({
    mutationFn: (payload) => signUp(payload),
    onSuccess: () =>
      notification.success({
        message: "Account created! You are now signed in.",
      }),
    onError: (err) =>
      notification.error({ message: err.message || "Sign up failed" }),
  });

  const handleSubmit = (values) => {
    if (tab === "signin") signInMutation.mutate(values);
    else signUpMutation.mutate(values);
  };

  const isLoading = signInMutation.isPending || signUpMutation.isPending;

  return (
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
          <path
            d="M0,600 C200,480 400,680 650,520 C900,360 1100,620 1300,480 C1380,420 1420,500 1440,480 L1440,800 L0,800 Z"
            fill="rgba(249,115,22,0.05)"
          />
          <path
            d="M0,300 C180,180 380,420 580,260 C780,100 980,380 1180,220 C1340,100 1400,220 1440,200 L1440,0 L0,0 Z"
            fill="rgba(249,115,22,0.06)"
          />
          <path
            d="M0,200 C220,80 420,320 620,160 C820,0 1020,280 1220,120 C1360,20 1410,140 1440,120 L1440,0 L0,0 Z"
            fill="rgba(249,115,22,0.04)"
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
            <div className={styles.cardHeader}>
              <Title level={4} className={styles.cardTitle}>
                {tab === "signin" ? "Sign In" : "Sign Up"}
              </Title>
              <Text className={styles.cardSub}>
                {tab === "signin"
                  ? "Welcome. Please enter your details"
                  : "Create your account to get started"}
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className={styles.form}
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Enter a valid email",
                  },
                ]}
              >
                <Input
                  placeholder="Enter your Email"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, min: 6, message: "At least 6 characters" },
                ]}
              >
                <Input.Password
                  placeholder="Enter password"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>

              {tab === "signin" && (
                <div className={styles.rememberRow}>
                  <Checkbox className={styles.remember} defaultChecked>
                    Remember Me
                  </Checkbox>
                  <span className={styles.forgotWrap}>
                    Forgot password?{" "}
                    <span className={styles.forgotLink}>Click Here</span>
                  </span>
                </div>
              )}

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isLoading}
                className={styles.submitBtn}
              >
                {tab === "signin" ? "Sign In" : "Sign Up"}
              </Button>
            </Form>

            <div className={styles.switchRow}>
              {tab === "signin" ? (
                <Text className={styles.switchText}>
                  Don't have an account?{" "}
                  <span
                    className={styles.switchLink}
                    onClick={() => {
                      setTab("signup");
                      form.resetFields();
                    }}
                  >
                    Sign Up
                  </span>
                </Text>
              ) : (
                <Text className={styles.switchText}>
                  Already have an account?{" "}
                  <span
                    className={styles.switchLink}
                    onClick={() => {
                      setTab("signin");
                      form.resetFields();
                    }}
                  >
                    Sign In
                  </span>
                </Text>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
