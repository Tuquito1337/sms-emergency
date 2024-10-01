import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography } from "antd";
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

  // Función para cargar los conteos
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

  // Cargar los conteos cuando se monte el componente
  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div>
      <Title level={1}>Información</Title>
      <Paragraph>
        En esta sección se presenta un resumen de los datos más relevantes
        relacionados con las catástrofes, los puntos de encuentro y las personas
        involucradas. Esta información es vital para la planificación y
        respuesta ante situaciones de emergencia, permitiendo una mejor
        organización y un adecuado manejo de recursos. A continuación, se
        detallan las cifras actuales:
      </Paragraph>

      <Title level={1}>Estadisticas</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FireOutlined style={{ fontSize: 24, marginRight: 10 }} />
              <div>
                <h3>Cantidad de Catástrofes</h3>
                <p>{catastrofesCount}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <EnvironmentOutlined style={{ fontSize: 24, marginRight: 10 }} />
              <div>
                <h3>Cantidad de Puntos de Encuentro</h3>
                <p>{puntosEncuentroCount}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <UserOutlined style={{ fontSize: 24, marginRight: 10 }} />
              <div>
                <h3>Cantidad de Personas</h3>
                <p>{personasCount}</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
