import { Link, useLocation } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const NotAuthorizedComponent = () => {
  const path = useLocation().pathname;
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center">
      <h4>
        {path === "/logout"
          ? "You do not have access to the logout page without have logged in"
          : "You do not have access to the back office without have login"}
      </h4>

      <Button variant="primary" style={{background: "#2D68C4"}} size="md">
        <Link to="/login" style={{ textDecoration: "none", color: "white" }}>
          Login
        </Link>
      </Button>
    </Container>
  );
};

export default NotAuthorizedComponent;
