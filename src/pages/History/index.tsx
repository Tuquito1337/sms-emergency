import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";

// Definir la interfaz para los datos del historial
interface HistorialData {
  id: number;
  catastrofe_id: number; // Cambiado a number si es numérico en la base de datos
  persona_id: number; // Cambiado a number si es numérico en la base de datos
  fecha: string;
  punto_encuentro_id: number; // Cambiado a number si es numérico en la base de datos
}

const Historial: React.FC = () => {
  const [data, setData] = useState<HistorialData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para cargar los datos del historial desde la API usando fetch
  const fetchHistorial = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/historial");
      if (!response.ok) {
        throw new Error("Error al obtener los datos del historial");
      }
      const data = await response.json();

      if (data.success) {
        setData(data.data); // Asegúrate de acceder a data.data
      } else {
        console.error("Error en la respuesta:", data.message);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      setLoading(false);
    }
  };

  // Cargar los datos cuando se monte el componente
  useEffect(() => {
    fetchHistorial();
  }, []);

  // Definir las columnas de la tabla
  const columns: ColumnsType<HistorialData> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Catástrofe",
      dataIndex: "catastrofe_id",
      key: "catastrofe_id",
    },
    {
      title: "Persona",
      dataIndex: "persona_id",
      key: "persona_id",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      render: (text) => new Date(text).toLocaleDateString("es-ES"), // Formato de la fecha
    },
    {
      title: "Punto de Encuentro",
      dataIndex: "punto_encuentro_id",
      key: "punto_encuentro_id",
    },
  ];

  // Tabla de catástrofes
  return (
    <div>
      {/* Tabla de catástrofes */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Historial;
