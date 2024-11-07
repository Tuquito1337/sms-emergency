import React, { useEffect, useState } from "react";
import { Col, Row, Typography } from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  FireOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const [catastrofesCount, setCatastrofesCount] = useState<number>(0);
  const [puntosEncuentroCount, setPuntosEncuentroCount] = useState<number>(0);
  const [personasCount, setPersonasCount] = useState<number>(0);

  const fetchCounts = async () => {
    try {
      const catastrofesResponse = await fetch(
        "http://localhost:3000/api/catastrofes/count"
      );
      const catastrofesData = await catastrofesResponse.json();
      if (catastrofesData.success) {
        setCatastrofesCount(catastrofesData.count);
      }

      const puntosResponse = await fetch(
        "http://localhost:3000/api/puntos_encuentro/count"
      );
      const puntosData = await puntosResponse.json();
      if (puntosData.success) {
        setPuntosEncuentroCount(puntosData.count);
      }

      const personasResponse = await fetch(
        "http://localhost:3000/api/personas/count"
      );
      const personasData = await personasResponse.json();
      if (personasData.success) {
        setPersonasCount(personasData.count);
      }
    } catch (error) {
      console.error("Error al obtener los conteos:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div style={{ padding: '10px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Información General
      </Title>
      <Paragraph
        style={{
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto',
          fontSize: '14px',
          color: '#595959',
        }}
      >
        A continuación se presenta un resumen de los datos más relevantes
        relacionados con las catástrofes, los puntos de encuentro y las personas
        involucradas. Esta información es vital para la planificación y
        respuesta ante situaciones de emergencia.
      </Paragraph>

      <Title level={3} style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
        Estadísticas Actuales
      </Title>
      
      <Row gutter={[8, 8]} justify="center">
        <Col xs={24} sm={12} md={6}>
          <div style={{ textAlign: 'center' }}>
            <FireOutlined style={{ fontSize: 36, color: '#fa541c', marginBottom: '5px' }} />
            <Title level={4} style={{ margin: 0 }}>Catástrofes</Title>
            <Paragraph style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {catastrofesCount}
            </Paragraph>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <div style={{ textAlign: 'center' }}>
            <EnvironmentOutlined style={{ fontSize: 36, color: '#52c41a', marginBottom: '5px' }} />
            <Title level={4} style={{ margin: 0 }}>Puntos de Encuentro</Title>
            <Paragraph style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {puntosEncuentroCount}
            </Paragraph>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <div style={{ textAlign: 'center' }}>
            <UserOutlined style={{ fontSize: 36, color: '#1890ff', marginBottom: '5px' }} />
            <Title level={4} style={{ margin: 0 }}>Personas</Title>
            <Paragraph style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {personasCount}
            </Paragraph>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
