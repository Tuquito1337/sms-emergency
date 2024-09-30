// src/components/LoginForm.tsx
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore"; // Importa el store de Zustand
import "./Login.css"; // Asegúrate de importar el archivo CSS
import logo from "/sirena.png"; // Asegúrate de que esta ruta sea correcta

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Para redirigir después del login
  const login = useAuthStore((state) => state.login); // Obtener la función login del store de Zustand

  const onFinish = (values: any) => {
    setLoading(true);
    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          message.success("¡Inicio de sesión exitoso!");
          login(); // Autenticar al usuario usando Zustand
          navigate("/home"); // Redirigir al usuario al inicio
        } else {
          message.error("Credenciales incorrectas");
        }
      })
      .catch(() => {
        setLoading(false);
        message.error("Error en el servidor");
      });
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">SOS: Sistema de Emergencia</h2>
        <Form name="login_form" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Por favor ingresa tu usuario" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              placeholder="Usuario"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="Contraseña"
              className="login-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-button"
            >
              Ingresar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
