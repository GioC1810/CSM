import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Container, Row, Col, Button } from "react-bootstrap";


const NotFoundComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container fluid>
      <h3>Not found section, please navigate to a valid route</h3>
      <Row>
        <Col>
          <Button variant="primary" onClick={() => navigate("/front")}>
            Go to front office
          </Button>
        </Col>
        <Col>
          {user?.username ? (
            <Button variant="dark" onClick={() => navigate("/back/pages")}>
              Go to back office
            </Button>
          ) : (
            <Button variant="dark" onClick={() => navigate("/login")}>
              Go to login
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundComponent;