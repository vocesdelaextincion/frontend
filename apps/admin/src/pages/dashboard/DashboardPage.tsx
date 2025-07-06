import { Panel, Col, Row } from 'rsuite';

const DashboardPage = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the Voces de la Extinción admin panel.</p>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col md={6}>
          <Panel bordered header="Users">
            <p>Total users: 10</p>
          </Panel>
        </Col>
        <Col md={6}>
          <Panel bordered header="Recordings">
            <p>Total recordings: 50</p>
          </Panel>
        </Col>
        <Col md={6}>
          <Panel bordered header="Tags">
            <p>Total tags: 25</p>
          </Panel>
        </Col>
        <Col md={6}>
          <Panel bordered header="Scientists">
            <p>Total scientists: 5</p>
          </Panel>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
