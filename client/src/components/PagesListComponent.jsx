import { ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import "dayjs";
import API from "../API";
import useAuth from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import PageComponent from "./PageComponent";

const PagesListComponent = ({setError, setOffice}) => {

    const {user} = useAuth();
    const location = useLocation();
    const [pages, setPages] = useState([]);

    useEffect(() => {
        setOffice(location.pathname === "/front" ? "front-office" : "back-office");
    }, []);

    useEffect(() => {
        const getPages = async () => {
          let result = await API.getAllPages();
          if (result.error) {
            setError(result.error);
          } else {
            if(location.pathname === "/front"){
                result = result.filter(p => p.type === "published");
            }
            setPages(result);
          }
        };
        getPages();
      }, []);

    return(
        <ListGroup>
            {pages && pages.map(page =>{
                 return <ListGroup.Item key={page.id}><PageComponent page={page} logged={location.pathname === "/back/pages"}/></ListGroup.Item>
            })}
        </ListGroup>
    );
}

export default PagesListComponent;