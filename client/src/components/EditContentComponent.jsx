import { Container, Button, Row, Col, Form, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ImageSelectorComponent from "./ImageSelectorComponent";
import API from "../API";

const EditContentComponent = ({setErrMsg, contents, setContentList, lastPosition }) => {
  const blockTypes = ["header", "image", "paragraph"];
  const [type, setType] = useState("header");
  const [content, setContent] = useState("");

  const handleContentSubmit = (e) => {
    e.preventDefault();
    if(!content){
        setErrMsg("The content cannot be empty!")
        return;
    }
    setContentList([...contents, { type: type, content: content, position: lastPosition }]);
    setType("header")
    setContent("");
  };

  return (
    <Container>
      <Form.Group className="mb-2" controlId="content-type">
        <Form.Label>Type of content</Form.Label>
        <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
          {blockTypes.map((t) => {
            return (
              <option key={t} value={t}>
                {t}
              </option>
            );
          })}
        </Form.Select>
        {type === "image" ? (
          <ImageSelectorComponent setContent={setContent}/>
        ) : (
          <>
            <Form.Label>Content</Form.Label>
            <Form.Control
              size="md"
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></Form.Control>
          </>
        )}
        <Button variant="primary" onClick={handleContentSubmit}>
          Add content
        </Button>
      </Form.Group>
    </Container>
  );
};

export default EditContentComponent;
