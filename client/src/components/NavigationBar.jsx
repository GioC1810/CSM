import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { BsDisplay, BsPersonCircle, BsPersonSlash } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API";
import useAuth from "../hooks/useAuth";

const NavigationBar = (props) => {
  const [siteName, setSiteName] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.getSiteName()
      .then((name) => {
        setSiteName(name);
        setLoading(false);
      })
      .catch((err) => setSiteName("..."));
  }, []);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <BsDisplay style={{ color: "white" }} size={30} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Navbar.Brand style={{ color: "grey" }}>
            {loading ? "..." : siteName}
          </Navbar.Brand>
          <Navbar.Brand style={{ color: "red" }}>
            {user ? (props.office ? props.office : "") : ""}
          </Navbar.Brand>
        </div>

        <Nav className="ml-auto">
          {user?.role ? (
            <Nav.Item
              onClick={() => {
                navigate("/logout");
              }}
            >
              <span style={{ color: "white", marginRight: "10px" }}>
                Signed as {user.nickname}
              </span>
              <Container>
                <span style={{ color: "white", marginRight: "5px" }}>
                  Logout
                </span>
                <BsPersonSlash style={{ color: "white" }} size={30} />
              </Container>
            </Nav.Item>
          ) : (
            <Nav.Item onClick={() => navigate("/login")}>
              <span style={{ color: "white", marginRight: "10px" }}>Login</span>
              <BsPersonCircle style={{ color: "white" }} size={30} />
            </Nav.Item>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
