import React, { useState } from "react";
import { Input, Button, Alert, Typography } from "antd";

const { Title } = Typography;

const Messages: React.FC = () => {
  const [message, setMessage] = useState<string>(""); // Guardar el mensaje ingresado
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // Para mostrar el mensaje de "enviado"

  // Función para manejar el envío del mensaje
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setIsSubmitted(true); // Mostrar mensaje de enviado
      // Aquí podrías realizar otras acciones, como enviar el mensaje a la API
      setMessage(""); // Limpiar el campo de texto
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Title level={2}>Mensajes Automatizados</Title>

        {/* Mostrar mensaje de éxito después de enviar */}
        {isSubmitted && (
          <Alert
            message="Mensaje Enviado"
            type="success"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        )}

        {/* Input para el mensaje */}
        <Input.TextArea
          rows={4}
          placeholder="Escribe el mensaje para el desastre"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ marginBottom: "20px" }}
        />

        {/* Botón para enviar el mensaje */}
        <Button type="primary" onClick={handleSendMessage}>
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default Messages;
