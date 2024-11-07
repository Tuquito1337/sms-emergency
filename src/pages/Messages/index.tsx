import React, { useState, useEffect } from "react";
import { Input, Button, Alert, Typography, Select } from "antd";
import axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Messages: React.FC = () => {
  const [message, setMessage] = useState<string>(""); // Guardar el mensaje ingresado
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null); // Guardar el mensaje seleccionado
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // Guardar el número de teléfono
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // Mostrar mensaje de "enviado"
  const [error, setError] = useState<string | null>(null); // Para manejar errores
  const [predefinedMessages, setPredefinedMessages] = useState<
    { disaster_type: string; message: string }[]
  >([]); // Mensajes predeterminados obtenidos del backend

  // Cargar mensajes predeterminados desde el backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/catastrofes/messages"
        );
        setPredefinedMessages(response.data);
      } catch (err) {
        setError("No se pudieron cargar los mensajes predeterminados.");
      }
    };

    fetchMessages();
  }, []);

  // Función para manejar el envío del mensaje
  const handleSendMessage = async () => {
    if (message.trim() === "") {
      setError("El mensaje no puede estar vacío.");
      return;
    }
    if (phoneNumber.trim() === "") {
      setError("El número de teléfono no puede estar vacío.");
      return;
    }
    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
      setError(
        "El número de teléfono debe estar en formato internacional (ej: +1234567890)."
      );
      return;
    }

    try {
      setError(null);

      // Enviar el mensaje a través de Twilio
      const response = await axios.post(
        "http://localhost:8000/api/send-message",
        {
          message,
          phone_number: phoneNumber,
        }
      );

      if (response.status === 200) {
        setIsSubmitted(true);
        setMessage("");
        setPhoneNumber("");
        setSelectedMessage(null);
      }
    } catch (err) {
      setError("Hubo un problema al enviar el mensaje. Inténtalo de nuevo.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "20px",
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2}>Mensajes Automatizados</Title>

        {/* Mostrar mensaje de éxito después de enviar */}
        {isSubmitted && (
          <Alert
            message="Mensaje enviado con éxito"
            type="success"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        )}

        {/* Mostrar error si algo falla */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        )}

        {/* Selector de mensajes predeterminados */}
        <Select
          style={{ width: "100%", marginBottom: "20px" }}
          placeholder="Selecciona un mensaje predeterminado"
          onChange={(value) => {
            setSelectedMessage(value);
            if (!message) {
              setMessage(value); // Solo llenar el mensaje si el campo está vacío
            }
          }}
          value={selectedMessage}
        >
          {predefinedMessages.map((msg, index) => (
            <Option key={index} value={msg.message}>
              {msg.disaster_type}: {msg.message}
            </Option>
          ))}
        </Select>

        {/* Input para el mensaje */}
        <TextArea
          rows={4}
          placeholder="Escribe o selecciona un mensaje para el desastre"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ marginBottom: "20px" }}
        />

        {/* Input para el número de teléfono */}
        <Input
          placeholder="Número de teléfono (ej: +1234567890)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{ marginBottom: "20px" }}
        />

        {/* Botón para enviar el mensaje */}
        <Button
          type="primary"
          onClick={handleSendMessage}
          style={{ width: "100%" }}
        >
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default Messages;
