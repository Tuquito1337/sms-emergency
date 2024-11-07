import React, { useState } from "react";
import { Form, Input, Button, Upload, Avatar, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  UploadOutlined,
  LockOutlined,
} from "@ant-design/icons";
import "./Profile.css";

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleFinish = async (values: {
    username: string;
    email: string;
    currentPassword: string;
    newPassword: string;
  }) => {
    console.log("Form values:", values);

    try {
      const response = await fetch("http://localhost:8000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.message);
        form.resetFields();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <div className="profile-layout">
      <div className="profile-container">
        <div className="profile-info">
          <Upload showUploadList={false} beforeUpload={handleUpload}>
            <Avatar
              size={100} /* Reducción del tamaño del avatar */
              icon={<UserOutlined />}
              src={profileImage || undefined}
              className="profile-avatar"
            />
          </Upload>
          <Button
            icon={<UploadOutlined />}
            style={{
              marginTop: "10px",
              fontSize: "14px",
            }} /* Ajuste en el tamaño de fuente */
          >
            Cambiar Foto de Perfil
          </Button>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="profile-form"
        >
          <Form.Item
            name="username"
            label="Usuario"
            rules={[
              { required: true, message: "Por favor, ingresa tu usuario!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Usuario" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Por favor, ingresa tu email!" },
              { type: "email", message: "Por favor, ingresa un email válido!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="currentPassword"
            label="Contraseña Actual"
            rules={[
              {
                required: true,
                message: "Por favor, ingresa tu contraseña actual!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña Actual"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Nueva Contraseña"
            rules={[
              {
                required: true,
                message: "Por favor, ingresa tu nueva contraseña!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nueva Contraseña"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
