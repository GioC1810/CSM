import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Container, Row, Col, Button } from "react-bootstrap";


const HomePageComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container fluid className="text-center">
      <h3>Home</h3>
        <p>Select one of the following options</p>
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

export default HomePageComponent;