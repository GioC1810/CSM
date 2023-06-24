import { Container, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import BlockComponent from "./BlockComponent";
import ConfirmDeleteComponent from "./ConfirmDeleteComponent";

const PageComponent = ({ page, logged, setPages, pages }) => {
  const { user } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const [deleteConfermation, setDeleteConfermation] = useState(false);
  const navigate = useNavigate();

  const formatDate = (date, format) => dayjs(date).format(format);

  return (
    <Container className="d-flex justify-content-center">
      <Row className="justify-content-center">
        <Col>
          <h4>{page.title}</h4>
          <h6>By {page.author}</h6>
          <h6>Creation date : {formatDate(page.creationDate, "DD/MM/YYYY")}</h6>
          {page.publicationDate && (
            <h6>
              Publication date: {formatDate(page.publicationDate, "DD/MM/YYYY")}
            </h6>
          )}
          <h6>State: {page.type}</h6>
          {showContent &&
            page.contents
              .sort((b1, b2) => b1.position - b2.position)
              .map((block) => (
                <BlockComponent content={block} key={block.id} />
              ))}
          <Container className="d-flex justify-content-center mb-2">
            {showContent ? (
              <Button
                type="primary"
                size="sm"
                onClick={() => setShowContent(false)}
              >
                Close content
              </Button>
            ) : (
              <Button
                type="success"
                size="sm"
                onClick={() => setShowContent(true)}
              >
                Show content
              </Button>
            )}
          </Container>

          {(user?.role === "admin" || user?.username === page.author) &&
            logged && (
              <Container className="d-flex justify-content-between">
                <Button
                  style={{background: "#005A9C"}}
                  size="sm"
                  onClick={() => navigate(`/back/edit/${page.id}`, { state: page })}
                >
                  Edit page
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteConfermation(true)}
                >
                  Delete page
                </Button>
              </Container>
            )}
        </Col>
      </Row>
      {deleteConfermation && (
        <ConfirmDeleteComponent
          setPages={setPages}
          setDeleteConfermation={setDeleteConfermation}
          pageId={page.id}
          pages={pages}
        />
      )}
    </Container>
  );
};

export default PageComponent;
