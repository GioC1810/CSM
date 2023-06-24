import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useState } from "react";
import "dayjs";

const BlockComponent = ({ content }) => {
  const images = ["canoa.jpg", "mare.jpg", "paesaggio.jpg", "piramide.jpg"];
  const path_to_image = `../../${content.content}`;
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Container>
      <Row className="justify-content-center mt-2 mb-3">
        <Col>
          {images.includes(content.content) ? (
            <Card style={{ width: "18rem" }}>
              {imageLoading && (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
              <Card.Img
                variant="top"
                src={path_to_image}
                onLoad={() => setImageLoading(false)}
              />
              <Card.Body>
                <Card.Title>{content.content.replace(".jpg", "")}</Card.Title>
              </Card.Body>
            </Card>
          ) : content.type === "header" ? (
            <h3>{content.content}</h3>
          ) : <p>{content.content}</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default BlockComponent;
