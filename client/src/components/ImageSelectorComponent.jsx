import { Container, Button, Row, Col, Form, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import API from "../API";

const ImageSelectorComponent = ({ setContent }) => {
  const imageStyle = {
    cursor: "pointer",
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const [images, setImages] = useState([
    { name: "canoa.jpg", selected: false },
    { name: "mare.jpg", selected: false },
    { name: "paesaggio.jpg", selected: false },
    { name: "piramide.jpg", selected: false }
  ]);

  const handleClick = (img) => {
    const new_selection = images.map(i => {
        if(i.name === img.name){
            i.selected = true;
        }
        if(i.name !== img.name && i.selected === true){
            i.selected = false;
        }
        return i;
    });
    setImages(new_selection);
    setContent(img.name);
  };

  return (
    <Container className="mt-3">
      <Form.Label>Content</Form.Label>
      <Row>
        {images.map((image) => (
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
