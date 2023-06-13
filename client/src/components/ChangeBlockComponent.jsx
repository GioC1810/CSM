import { Container, Button, Row, Col, Form, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ImageSelectorComponent from "./ImageSelectorComponent";
import BlockComponent from "./BlockComponent";
import API from "../API";

const ChangeBlockComponent = ({
  contentList,
  setContentList,
  handleContentDelete,
}) => {

  return (
    <>
      {contentList.map((c, i) => (
        <Row className="mt-3" key={i}>
          <Col>
            <BlockComponent content={c}  />
          </Col>
          <Col>
            <Button variant="danger" onClick={() => handleContentDelete(i)}>
              Remove content
            </Button>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default ChangeBlockComponent;
