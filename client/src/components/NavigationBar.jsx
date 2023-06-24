import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import {
  BsDisplay,
  BsPersonCircle,
  BsPersonSlash,
  BsFillPencilFill,
} from "react-icons/bs";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../API";
import useAuth from "../hooks/useAuth";

const NavigationBar = (props) => {
  const [siteName, setSiteName] = useState("");
  const [modifiedSiteName, setModifiedSiteName] = useState("");
  const [loading, setLoading] = useState(true);
  const [changeSiteName, setChangeSiteName] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.getSiteName()
      .then((name) => {
        setSiteName(name);
        setModifiedSiteName(name);
        setLoading(false);
      })
      .catch((err) => setSiteName("..."));
  }, []);

  const handleChangeName = async (e) => {
    e.preventDefault();
    const result = await API.changeSiteName(modifiedSiteName);
    if (result.error) {
      props.setErrMsg(result.error);
    } else {
      setSiteName(modifiedSiteName);
      setModifiedSiteName(modifiedSiteName);
    }
    setChangeSiteName(false);
  };

  return (
    <Navbar style={{background: "#034694"}} variant="dark">
      <Container>
        <BsDisplay style={{ color: "white" }} size={30} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Navbar.Brand style={{ color: "#E1EBEE" }}>
            {loading ? "..." : siteName}
            {user?.role === "admin" && (
              <BsFillPencilFill
                style={{ color: "white", marginLeft: "10px" }}
                size={15}
                onClick={() => setChangeSiteName(true)}
              />
            )}
          </Navbar.Brand>
          <Navbar.Brand style={{ color: "#AFDBF5" }}>
            {user ? (props.office ? props.office : "") : "front-office"}
          </Navbar.Brand>
        </div>
        <Nav>
          <NavDropdown title="Navigate" id="nav-dropdown">
            <NavDropdown.Item onClick={() => navigate("/front")}>
              Front office
            </NavDropdown.Item>
            {user?.username && (
              <>
                <NavDropdown.Item onClick={() => navigate("/back/pages")}>
                  Back office
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/back/new")}>
                  Create new page
                </NavDropdown.Item>
              </>
            )}
          </NavDropdown>
        </Nav>

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
      {changeSiteName && (
        <Modal show={true} animation={false}>
          <Modal.Header>
            <Modal.Title>Change App Name</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleChangeName}>
            <Modal.Body>
              Are you sure you want to change the name of the app?
              <Form.Control
                size="md"
                type="text"
                value={modifiedSiteName}
                onChange={(e) => setModifiedSiteName(e.target.value)}
                required
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setChangeSiteName(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" type="submit">
                Confirm
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Navbar>
  );
};

export default NavigationBar;
