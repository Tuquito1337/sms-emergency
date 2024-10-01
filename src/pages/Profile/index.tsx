import React, { useState } from "react";
import { Form, Input, Button, Typography, Upload, Avatar, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  UploadOutlined,
  LockOutlined,
} from "@ant-design/icons"; // Importar el ícono LockOutlined
import "./Profile.css";

const { Title } = Typography;

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleFinish = async (values: {
    username: string;
    email: string;
    currentPassword: string;
    newPassword: string;
  }) => {
    console.log("Form values:", values); // Para depuración

    try {
      const response = await fetch("http://localhost:3000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Envía los valores del formulario
      });

      const data = await response.json(); // Analiza la respuesta JSON

      if (response.ok) {
        message.success(data.message); // Mostrar un mensaje de éxito
        form.resetFields(); // Opcional: restablece los campos del formulario
      } else {
        message.error(data.message); // Mostrar un mensaje de error
      }
    } catch (error) {
      console.error("Error de red:", error);
      // Aquí puedes mostrar un mensaje de error al usuario
    }
  };

  const handleUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    return false; // Prevenir el comportamiento predeterminado de Ant Design
  };

  return (
    <div className="profile-container">
      <div className="profile-info">
        <Upload showUploadList={false} beforeUpload={handleUpload}>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={profileImage ? profileImage : undefined}
            style={{ cursor: "pointer" }}
          />
          <Button icon={<UploadOutlined />} style={{ marginTop: "10px" }}>
            Cambiar Foto de Perfil
          </Button>
        </Upload>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ width: "300px", marginLeft: "20px" }}
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
            prefix={<LockOutlined />} // Añadir el ícono de candado
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
            prefix={<LockOutlined />} // Añadir el ícono de candado
            placeholder="Nueva Contraseña"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
