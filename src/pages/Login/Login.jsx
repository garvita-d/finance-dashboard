import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  Modal,
  Result,
  notification,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import { signIn, signUp, resetPassword } from "../../api/auth/mutations";
import { useAppContext } from "../../context/AppContext";
import styles from "./Login.module.scss";

const { Title, Text } = Typography;

const WaveBg = () => (
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
);

const Login = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [forgotForm] = Form.useForm();
  const [tab, setTab] = useState("signin");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const signInMutation = useMutation({
    mutationFn: (payload) => signIn(payload),
    onSuccess: () => {
      // navigation handled by AppContext auth state change
    },
    onError: (err) => {
      const msg = String(err?.message || err || "Sign in failed").toLowerCase();

      if (msg.includes("email not confirmed")) {
        notificationApi.warning({
          message: "Email not confirmed",
          description:
            "Please check your inbox and click the confirmation link first.",
          duration: 6,
        });
      } else if (
        msg.includes("invalid login credentials") ||
        msg.includes("invalid credentials") ||
        msg.includes("user not found") ||
        msg.includes("no user found")
      ) {
        notificationApi.error({
          message: "Account not found",
          description: (
            <span>
              No account exists with this email.{" "}
              <span
                style={{
                  color: "#f97316",
                  cursor: "pointer",
                  fontWeight: 500,
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setTab("signup");
                  form.resetFields();
                }}
              >
                Sign up here →
              </span>
            </span>
          ),
          duration: 8,
        });
      } else {
        notificationApi.error({
          message: "Sign in failed, Sign up to get started",
          description: err?.message || "Please try again.",
          duration: 5,
        });
      }
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (payload) => signUp(payload),
    onSuccess: (data, variables) => {
      if (!data.session) {
        setConfirmEmail(variables.email);
        setTab("confirm_pending");
      } else {
        notificationApi.success({
          message: "Account created! Welcome to inFlow.",
        });
      }
    },
    onError: (err) =>
      notificationApi.error({ message: err.message || "Sign up failed" }),
  });

  const forgotMutation = useMutation({
    mutationFn: (email) => resetPassword(email),
    onSuccess: () => setForgotSent(true),
    onError: (err) =>
      notificationApi.error({
        message: err.message || "Failed to send reset email",
      }),
  });

  const handleSubmit = (values) => {
    if (tab === "signin") signInMutation.mutate(values);
    else signUpMutation.mutate(values);
  };

  const isLoading = signInMutation.isPending || signUpMutation.isPending;

  if (tab === "confirm_pending") {
    return (
      <div data-theme="light">
        {contextHolder}
        <div className={styles.page}>
          <WaveBg />
          <div className={styles.cardWrap}>
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <Title level={3} className={styles.brand}>
                  inFlow
                </Title>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.confirmBox}>
                  <div className={styles.confirmIcon}>📧</div>
                  <Title level={4} className={styles.cardTitle}>
                    Check your email
                  </Title>
                  <Text className={styles.cardSub}>
                    We sent a confirmation link to
                  </Text>
                  <div className={styles.confirmEmail}>{confirmEmail}</div>
                  <Text className={styles.cardSub}>
                    Click the link to activate your account, then sign in.
                  </Text>
                  <Button
                    type="primary"
                    block
                    size="large"
                    className={styles.submitBtn}
                    style={{ marginTop: 24 }}
                    onClick={() => {
                      setTab("signin");
                      form.resetFields();
                    }}
                  >
                    Go to Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-theme="light">
      {contextHolder}
      <div className={styles.page}>
        <WaveBg />

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
                    {
                      required: true,
                      min: 6,
                      message: "At least 6 characters",
                    },
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
                      <span
                        className={styles.forgotLink}
                        onClick={() => {
                          setForgotOpen(true);
                          setForgotSent(false);
                          forgotForm.resetFields();
                        }}
                      >
                        Click Here
                      </span>
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

      <Modal
        open={forgotOpen}
        onCancel={() => {
          setForgotOpen(false);
          setForgotSent(false);
          forgotForm.resetFields();
        }}
        footer={null}
        title="Reset Password"
        width={400}
        destroyOnClose
      >
        {forgotSent ? (
          <Result
            status="success"
            title="Reset email sent!"
            subTitle="Check your inbox for a password reset link."
            extra={
              <Button
                type="primary"
                className={styles.submitBtn}
                onClick={() => {
                  setForgotOpen(false);
                  setForgotSent(false);
                }}
              >
                Back to Sign In
              </Button>
            }
          />
        ) : (
          <Form
            form={forgotForm}
            layout="vertical"
            onFinish={({ email }) => forgotMutation.mutate(email)}
            style={{ marginTop: 8 }}
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
              <Input placeholder="Enter your email" size="large" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={forgotMutation.isPending}
              className={styles.submitBtn}
            >
              Send Reset Link
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Login;
