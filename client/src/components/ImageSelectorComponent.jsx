import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import API from "../API";

const ImageSelectorComponent = ({ setContent, images }) => {
  const imageStyle = {
    cursor: "pointer",
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const [imagesList, setImagesList] = useState(
    images.map((i) => {
      return { name: i, selected: false };
    })
  );

  const handleClick = (img) => {
    const new_selection = imagesList.map((i) => {
      if (i.name === img.name) {
        i.selected = true;
      }
      if (i.name !== img.name && i.selected === true) {
        i.selected = false;
      }
      return i;
    });
    setImagesList(new_selection);
    setContent(img.name);
  };

  return (
    <Container className="mt-3">
      <Form.Label>Content</Form.Label>
      <Row>
        {imagesList.map((image) => (
          <Col
            key={image.name}
            onClick={() => handleClick(image)}
            style={imageStyle}
            className={image.selected ? "bg-success" : ""}
          >
            <Image
              src={`../../${image.name}`}
              style={{ width: "150px", height: "auto" }}
              rounded
            ></Image>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ImageSelectorComponent;
