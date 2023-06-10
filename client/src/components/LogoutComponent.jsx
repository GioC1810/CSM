import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LogoutComponent = ({ logout, setOffice }) => {
  const navigate = useNavigate();

  const handleLogout = () =>{
    setOffice("");
    logout();
  }

  return (
    <>
      <Modal show={true}>
        <Modal.Header>
          <Modal.Title>Logout Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LogoutComponent;
