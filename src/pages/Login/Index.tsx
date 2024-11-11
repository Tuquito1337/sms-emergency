import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons"; // Agregado MailOutlined
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore"; // Store de Zustand
import "./Login.css"; // Estilos
import logo from "/sirena.png"; // Asegúrate de que esta ruta sea correcta

// Definir el tipo para los valores del formulario
interface LoginFormValues {
  username: string;
  password: string;
}

interface RegisterFormValues extends LoginFormValues {
  email: string;
  confirmPassword: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // Alternar entre login y registro
  const navigate = useNavigate(); // Para redirigir después del login
  const login = useAuthStore((state) => state.login); // Obtener la función login de Zustand

  // Manejo de envío del formulario
  const onFinish = (values: LoginFormValues | RegisterFormValues) => {
    setLoading(true);
    const endpoint = isRegister
      ? "http://localhost:8000/api/register"
      : "http://localhost:8000/api/login";

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          message.success(
            isRegister ? "¡Registro exitoso!" : "¡Inicio de sesión exitoso!"
          );
          if (!isRegister) {
            login();
            navigate("/"); // Redirigir tras login
          } else {
            setIsRegister(false); // Cambiar a login tras registro
          }
        } else {
          message.error(data.message || "Error en el servidor");
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
        <h2 className="login-title">{isRegister ? "Registro" : "Inicio de Sesión"}</h2>

        <Form
          name={isRegister ? "register_form" : "login_form"}
          className="login-form"
          onFinish={onFinish}
        >
          {/* Campo de email solo en registro */}
          {isRegister && (
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Por favor ingresa tu correo" },
                { type: "email", message: "Ingresa un correo válido" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="input-icon" />}
                placeholder="Email"
                className="login-input"
              />
            </Form.Item>
          )}

          {/* Campo de usuario */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Por favor ingresa tu usuario" }]}
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              placeholder="Usuario"
              className="login-input"
            />
          </Form.Item>

          {/* Campo de contraseña */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="Contraseña"
              className="login-input"
            />
          </Form.Item>

          {/* Confirmar contraseña solo en registro */}
          {isRegister && (
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Por favor confirma tu contraseña" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Las contraseñas no coinciden")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Confirmar contraseña"
                className="login-input"
              />
            </Form.Item>
          )}

          {/* Botón de enviar */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-button"
            >
              {isRegister ? "Registrarse" : "Ingresar"}
            </Button>
          </Form.Item>
        </Form>

        {/* Cambiar entre login y registro */}
        <Button
          type="link"
          onClick={() => setIsRegister(!isRegister)}
          className="toggle-form-button"
        >
          {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </Button>
      </div>
    </div>
  );
};

export default Login;
