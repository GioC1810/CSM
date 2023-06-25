import { Container, Button, Row, Col, Form, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import EditContentComponent from "./EditContentComponent";
import API from "../API";

const EditPageComponent = ({ setErrMsg, setOffice, images }) => {
  const location = useLocation();
  const navigate = useNavigate();
  let page = location.state;
  const { user } = useAuth();
  const [showContentForm, setShowContentForm] = useState(false);
  //page attributes states
  const [title, setTitle] = useState(page ? page.title : "");
  const [publicationDate, setPublicationDate] = useState(
    page && page.publicationDate
      ? dayjs(page.publicationDate).format("YYYY-MM-DD")
      : ""
  );
  let creationDate = page
    ? dayjs(page.creationDate).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");
  const [author, setAuthor] = useState(
    page?.author ? page.author : user.username
  );
  const [contentList, setContentList] = useState(
    page ? [...page.contents] : []
  );
  const [users, setUsers] = useState([]);
  //content form attribute
  const [lastId, setLastId] = useState(0);
  const [content, setContent] = useState("")
  const [type, setType] = useState("header");
  const [contentId, setContentId] = useState(-1);

  const handlePublicationDate = (e) => {
    const newPubDate = e.target.value ? dayjs(e.target.value) : "";
    if (newPubDate && newPubDate.isBefore(dayjs(creationDate))) {
      setErrMsg("The publication date can't be before the creation date");
    } else {
      newPubDate
        ? setPublicationDate(newPubDate.format("YYYY-MM-DD"))
        : setPublicationDate(null);
    }
  };

  useEffect(() => {
    if (contentList.length > 0) {
      const maxId = contentList.reduce((v1, v2) =>
        v1.id > v2.id ? v1 : v2
      ).id;
      setLastId(maxId + 1);
    } else {
      setLastId(0);
    }
  }, [contentList]);

  useEffect(() => {
    const retrieveUsers = async () => {
      const result = await API.getUsers();
      if (result.error) {
        setErrMsg(result.error);
      } else {
        setUsers(result);
        if (!author) {
          setAuthor(user.username);
        }
      }
    };
    retrieveUsers();
    setOffice("back-office");
  }, []);

  useEffect(() => {
    if (location.pathname === "/back/new") {
      setShowContentForm(false);
      setTitle("");
      setAuthor(user.username);
      setPublicationDate("");
      creationDate = dayjs().format("YYYY-MM-DD");
      setContentList([]);
    }
  }, [location.pathname]);

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
        author: author ? author : user.username,
        creationDate: creationDate,
        publicationDate: publicationDate ? publicationDate : null,
        contents: contentList,
      };
      if (p.title.length > 20) {
        setErrMsg("the max length for the title is 20 characters!");
        return;
      }
      if (page) {
        p.id = page.id;
        result = await API.modifyPage(p);
      } else {
        result = await API.addPage(p);
      }
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
              {page
                ? user?.role === "admin"
                  ? `Original author: ${page.author}`
                  : "Author"
                : "Author"}
            </Form.Label>
            <Form.Control
              as="select"
              value={author}
              disabled={user.role !== "admin"}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            >
              {users.map((username) => {
                return <option key={username}>{username}</option>;
              })}
            </Form.Control>
            <Form.Label>Creation Date</Form.Label>
            <Form.Control type="date" value={creationDate} disabled />
            <Form.Label>PublicationDate</Form.Label>
            <Form.Control
              type="date"
              value={publicationDate}
              onChange={handlePublicationDate}
            />
          </Form.Group>
          <Button
            style={{ background: "#0093AF" }}
            onClick={() => {
              setShowContentForm(!showContentForm);
              setContent("");
              setType("header");
              setContentId(-1);
            }}
          >
            {showContentForm ? "Close" : "Add content"}
          </Button>
          <EditContentComponent
            contents={contentList}
            setContentList={setContentList}
            content={content}
            setContent={setContent}
            type={type}
            setType={setType}
            contentId={contentId}
            setContentId={setContentId}
            lastId={lastId}
            setErrMsg={setErrMsg}
            showContentForm={showContentForm}
            setShowContentForm={setShowContentForm}
            handleContentDelete={handleContentDelete}
            images={images}
          />

          <Button style={{ background: "#0071c5" }} type="submit">
            {page?.id ? "Modify page" : "Add page"}
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default EditPageComponent;
