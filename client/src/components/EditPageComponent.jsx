import { Container, Button, Row, Col, Form, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useLocation, Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import EditContentComponent from "./EditContentComponent";
import BlockComponent from "./BlockComponent";
import ChangeBlockComponent from "./ChangeBlockComponent";
import API from "../API";

const EditPageComponent = ({ setErrMsg }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const page = location.state;
  const editing = page ? true : false;
  const { user } = useAuth();
  const [showContentForm, setShowContentForm] = useState(false);
  //page attributes states
  const [title, setTitle] = useState(page ? page.title : "");
  const [publicationDate, setPublicationDate] = useState(
    page
      ? dayjs(page.publicationDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD")
  );
  const creationDate = page
    ? dayjs(page.creationDate).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");
  const [author, setAuthor] = useState(page ? page.author : null);
  const [contentList, setContentList] = useState(
    page ? [...page.contents] : []
  );

  const [users, setUsers] = useState([]);
  const [lastId, setLastId] = useState(0);

  const handlePublicationDate = (e) => {
    const newPubDate = dayjs(e.target.value);
    if (newPubDate.isBefore(dayjs(creationDate))) {
      setErrMsg("The publication date can't be before the creation date");
    } else {
      setPublicationDate(newPubDate.format("YYYY-MM-DD"));
    }
  };

  useEffect(() => {
    if (contentList.length > 0) {
      const maxId = contentList.reduce((v1, v2) => (v1.id > v2.id ? v1 : v2)).id;
      console.log("lastid: ", maxId)
      setLastId(maxId + 1);
    } else {
      setLastId(0);
    }
  }, [contentList])

  useEffect(() => {
    const retrieveUsers = async () => {
      const result = await API.getUsers();
      if (result.error) {
        setErrMsg(result.error);
      } else {
        setUsers(result);
        if(!author){
          setAuthor(users[0])
        }
      }
    };
    retrieveUsers();
   
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let noHeader = true;
    let noContent = true;
    contentList.map((c) => {
      if (c.type === "header") {
        noHeader = false;
      }
      if (c.type !== "header") {
        noContent = false;
      }
    });
    if (noHeader) {
      setErrMsg("You have to add at least one header in the page");
    } else if (noContent) {
      setErrMsg(
        "You have to add at least one content between an image or a paragraph"
      );
    } else {
      let result;
      let p = {
          title: title,
          author: author ? author : users[0],
          creationDate: creationDate,
          publicationDate: publicationDate,
          contents: contentList,
      }
      console.log(p)
      if(editing){
        p.id = page.id
        result = await API.modifyPage(p);
      } else {
        result = await API.addPage(p);
      }
       console.log(result)
      if (result.error) {
        setErrMsg(result.error);
      } else {
        navigate("/back/pages");
      }
    }
  };

  const handleContentDelete = (index) => {
    const cList = [...contentList];
    cList.splice(index, 1);
    setContentList(cList);
  };

  return (
    <Container>
      <Row className="justify-content-center mt-2 mb-2">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2" controlId="page-field">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Form.Label>
              {user.role === "admin" && page && "Original "}Author{" "}
              {page ? ": " + page.author : ""}
            </Form.Label>
            <Form.Select
              disabled={user.role !== "admin"}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            >
              {users.map((username) => {
                return (
                  <option key={username} selected={username === author}>
                    {username}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Label>Creation Date</Form.Label>
            <Form.Control type="date" value={creationDate} disabled />
            <Form.Label>PublicationDate</Form.Label>
            <Form.Control
              type="date"
              value={publicationDate}
              onChange={handlePublicationDate}
            />
          </Form.Group>

          {showContentForm && (
            <EditContentComponent
              contents={contentList}
              setContentList={setContentList}
              lastId={lastId}
              setErrMsg={setErrMsg}
            />
          )}
          <Button
            variant="success"
            onClick={() => setShowContentForm(!showContentForm)}
          >
            {showContentForm ? "Close" : "Add block"}
          </Button>
          <ChangeBlockComponent
            contentList={contentList}
            setContentList={setContentList}
            handleContentDelete={handleContentDelete}
          />
          <Button variant="info" type="submit">
            Add page
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default EditPageComponent;
