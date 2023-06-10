import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const NotAuthorizedComponent = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" >
      <h4>You do not have access to the back office without login</h4>
      
        <Button variant="dark" size="md">
        <Link to="/login" style={{ textDecoration: "none" }}>Login</Link>
      </Button>
    </Container>
  );
};

export default NotAuthorizedComponent;