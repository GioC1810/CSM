import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../API";
import useAuth from "../hooks/useAuth";

const LoginComponent = (props) => {
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const result = await API.logIn({ username: username, password: password });
    if (result.error) {
      props.setErrorMsg(result.error);
    } else {
      props.setOffice("back-office");
      setUser(result);
      navigate("/back/pages");
    }
  };

  return (
    <Container >
      <Row className="justify-content-center mt-4">
        <Col xs={20} sm={14} md={10} >
          <div className="border border-2 rounded p-4" style={{background: "#E1EBEE"}}>
            <h2 className="text-center">Login</h2>
            <h4 className="text-center">Login is necessary to access back office</h4>
            <Form className="mt-3" onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  value={username}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
              </Form.Group>
              <Container fluid>
                <Row>
                  <Col className="d-flex justify-content-center">
                    <Button variant="primary" style={{background: "#2D68C4"}} type="submit">
                      Login
                    </Button>
                  </Col>
                  <Col className="d-flex justify-content-center">
                    <Button variant="info" style={{background: "#0066b2"}}>
                      <Link
                        to="/front"
                        style={{ textDecoration: "none", color: "white" }}
                      >
                        Go to front office
                      </Link>
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginComponent;
