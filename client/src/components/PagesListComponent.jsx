import { Container, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import "dayjs";
import API from "../API";
import useAuth from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import PageComponent from "./PageComponent";

const PagesListComponent = ({ setError, setOffice, images }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const getPages = async () => {
      let result = await API.getAllPages();
      if (result.error) {
        setError(result.error);
      } else {
        if (location.pathname === "/front") {
          result = result.filter((p) => p.type === "published");
        }
        setPages(result);
      }
    };
    getPages();
    setOffice(location.pathname === "/front" ? "front-office" : "back-office");
  }, [location]);

  return (
    <Container className="mt-4 border-2 rounded">
      <ListGroup>
        {pages &&
          pages.map((page) => {
            return (
              <ListGroup.Item key={page.id}>
                <PageComponent
                  page={page}
                  logged={location.pathname === "/back/pages"}
                  setPages={setPages}
                  pages={pages}
                  setErrMsg={setError}
                  images={images}
                />
              </ListGroup.Item>
            );
          })}
      </ListGroup>
    </Container>
  );
};

export default PagesListComponent;
