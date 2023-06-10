import { Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../API";
import useAuth from "../hooks/useAuth";

const HomeComponent = (props) => {

  useEffect(() => props.setOffice(""), [])
  return (
    <Container className="d-flex justify-content-center mt-5">
      <Row>
        <Col>
          <Button style={{ backgroundColor: "#e3e3e3" }} size="lg">
            <Link to="/front" style={{ textDecoration: 'none' }} onClick={() => props.setOffice("Front office")}>Front Office</Link>
          </Button>
        </Col>
        <Col>
          <Button style={{ backgroundColor: "#f95959" }} size="lg">
            <Link to="</back/pages>" style={{ textDecoration: 'none' }} onClick={() => props.setOffice("Back office")}>Back Office</Link>
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeComponent;
