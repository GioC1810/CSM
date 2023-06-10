import { Container, Button, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import API from "../API";

const EditPageComponent = ({ pages, setPages, setErrMsg }) => {
  const location = useLocation();
  const page = location.state;
  const { user } = useAuth();
  const [title, setTitle] = useState(page ? page.title : "");
  const [publicationDate, setPublicationDate] = useState(
    page ? dayjs(page.publicationDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
  );
  const creationDate = page ? dayjs(page.creationDate).format('YYYY-MM-DD') : dayjs().format("YYYY-MM-DD")
  const [author, setAuthor] = useState(page ? page.author : "");
  const [contents, setContents] = useState(page ? page.contents : []);
  const [users, setUsers] = useState([]);

  const handlePublicationDate = (e) =>{
    const newPubDate = dayjs(e.target.value);
    if(newPubDate.isBefore(dayjs(creationDate))){
        setErrMsg("The publication date can't be before the creation date")
    } else {
        setPublicationDate(newPubDate.format("YYYY-MM-DD"));
    }
  }

  useEffect(() => {
    console.log("retriving users")
    const retrieveUsers = async () => {
        const result = await API.getUsers();
        if(result.error){
            setErrMsg(result.error);
        } else {
            console.log(result)
            setUsers(result);
        }
    }
    retrieveUsers();
  }, []);

  const handleSubmit = (e) =>{
    e.preventDefault();
  }

  return (
    <Container>
      <Row className="justify-content-center mt-2">
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <Form.Label>Author : {author}</Form.Label>
                <Form.Select disabled={user.role !== "admin"}>
                    {users.map(username => {
                        return <option key={username} selected={username === author}>{username}</option>
                    })}
                </Form.Select>
                <Form.Label>Creation Date</Form.Label>
                <Form.Control type="date" value={creationDate} onChange={(e) => setCreationDate(creationDate)} disabled/>
                <Form.Label>PublicationDate</Form.Label>
                <Form.Control type="date" value={publicationDate} onChange={handlePublicationDate}/>
            </Form.Group>
        </Form>
      </Row>
    </Container>
  );
};

export default EditPageComponent;
