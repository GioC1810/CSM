import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { Container, Toast } from "react-bootstrap";
import API from "./API.js";
import NavigationBar from "./components/NavigationBar";
import LoginComponent from "./components/LoginComponent";
import NotAuthorizedComponent from "./components/NotAuthorizedComponent";
import LogoutComponent from "./components/LogoutComponent";
import PagesListComponent from "./components/PagesListComponent";
import EditPageComponent from "./components/EditPageComponent";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [errMsg, setErrMsg] = useState("");
  const [office, setOffice] = useState("");

  useEffect(() => {
    const checkSesssion = async () => {
      const result = await API.getUserInfo();
      if (!result.error){ 
        setUser(result);  
      } else {
        setUser({});
        navigate("/login");
      }
    };
    checkSesssion();
  }, []);

  const handleLogout = async () => {
    await API.logout();
    setUser();
    navigate("/login");
  };

  return (
    <Container fluid>
      <NavigationBar logout={handleLogout} user={user} office={office} />
      <Routes>
        <Route
          path="/login"
          element={<LoginComponent setErrorMsg={setErrMsg} setOffice={setOffice}/>}
        />
        <Route
          path="/"
          element={<LoginComponent setErrorMsg={setErrMsg} setOffice={setOffice}/>}
        />
        //Front office
        <Route
          path="/front"
          element={<PagesListComponent setError={setErrMsg} setOffice={setOffice}/>}
        />
        //Back office
        <Route
          path="/logout"
          element={<LogoutComponent logout={handleLogout} setOffice={setOffice}/>}
        ></Route>
        <Route
          path="/back/pages"
          element={
            user ? (
              <PagesListComponent setError={setErrMsg} setOffice={setOffice}/>
            ) : (
              <NotAuthorizedComponent />
            )
          }
        />
        <Route
          path="/back/edit/"
          element={
            user ? (
              <EditPageComponent setErrMsg={setErrMsg}/>
            ) : (
              <NotAuthorizedComponent />
            )
          }
        />
      </Routes>

      <Toast
        show={errMsg !== ""}
        onClose={() => setErrMsg("")}
        delay={4000}
        autohide
        bg="danger"
      >
        <Toast.Body>{errMsg}</Toast.Body>
      </Toast>
    </Container>
  );
}

export default App;
