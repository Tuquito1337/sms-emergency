import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";

// Definir la interfaz para los datos del historial
interface HistorialData {
  id: number;
  catastrofe_tipo: string;
  catastrofe_mensaje: string;
  persona_nombre: string;
  persona_telefono: string;
  persona_direccion: string;
  empresa_nombre: string | null;
  fecha: string;
  punto_encuentro_id: number;
}

const Historial: React.FC = () => {
  const [data, setData] = useState<HistorialData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para cargar los datos del historial desde la API usando fetch
  const fetchHistorial = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/historial");
      if (!response.ok) {
        throw new Error("Error al obtener los datos del historial");
      }
      const data = await response.json();

      setData(data); // Los datos son directamente un array
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
      dataIndex: "catastrofe_tipo",
      key: "catastrofe_tipo",
    },
    {
      title: "Mensaje de Catástrofe",
      dataIndex: "catastrofe_mensaje",
      key: "catastrofe_mensaje",
    },
    {
      title: "Persona",
      dataIndex: "persona_nombre",
      key: "persona_nombre",
    },
    {
      title: "Teléfono",
      dataIndex: "persona_telefono",
      key: "persona_telefono",
    },
    {
      title: "Dirección",
      dataIndex: "persona_direccion",
      key: "persona_direccion",
    },
    {
      title: "Empresa",
      dataIndex: "empresa_nombre",
      key: "empresa_nombre",
      render: (empresa: string | null) => (empresa ? empresa : "N/A"),
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      render: (text: string) => new Date(text).toLocaleDateString("es-ES"), // Formato de la fecha
    },
    {
      title: "Punto de Encuentro",
      dataIndex: "punto_encuentro_id",
      key: "punto_encuentro_id",
    },
  ];

  // Tabla de historial
  return (
    <div style={{ padding: "20px" }}>
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
