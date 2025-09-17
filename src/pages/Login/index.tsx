import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Spin, App } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth";
import { authApi } from "../../lib/api/auth";
import { useTranslation } from "../../hooks/useTranslation";
import type { LoginCredentials } from "../../types";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { t } = useTranslation();
  const { message } = App.useApp();

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(values);
      login(data.user, data.tokens);
      message.success(t("auth.loginSuccess") as string);
      navigate("/");
    } catch (error: any) {
      message.error(
        error.response?.data?.message || (t("auth.loginFailed") as string)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center full-height" style={{ background: "#f0f2f5" }}>
      <Card
        style={{
          width: 400,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="text-center" style={{ marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            Cong Phone Admin
          </Title>
          <Text type="secondary">{t("auth.signInToAccount") as string}</Text>
        </div>

        <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t("validation.required") as string },
              { type: "email", message: t("validation.email") as string },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t("auth.email") as string}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: t("validation.required") as string },
              {
                min: 6,
                message: t("validation.minLength", { min: 6 }) as string,
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("auth.password")}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
              style={{ width: "100%" }}
            >
              {loading ? <Spin size="small" /> : (t("auth.signIn") as string)}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Text type="secondary">{t("auth.contactAdmin") as string}</Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
