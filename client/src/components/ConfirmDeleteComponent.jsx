import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../API";

const ConfirmDeleteComponent = ({ setPages, setDeleteConfermation, pageId, pages, setErrMsg }) => {

  const navigate = useNavigate();

  const handleDelete = async () =>{
    const result = await API.deletePage(pageId);
    if(result.error){
        setErrMsg(result.error);
    } else {
        setPages(pages.filter(p => p.id !== pageId));
    }
    setDeleteConfermation(false);
    navigate("/back/pages");
  }

  return (
    <>
      <Modal show={true}>
        <Modal.Header>
          <Modal.Title>Page delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete that page?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfermation(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmDeleteComponent;
