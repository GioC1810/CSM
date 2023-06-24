import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { Container, Toast } from "react-bootstrap";
import API from "./API.js";
import NavigationBar from "./components/NavigationBar";
import LoginComponent from "./components/LoginComponent";
import NotAuthorizedComponent from "./components/NotAuthorizedComponent";
import LogoutComponent from "./components/LogoutComponent";
import PagesListComponent from "./components/PagesListComponent";
import EditPageComponent from "./components/EditPageComponent";
import NotFoundComponent from "./components/NotFoundComponent";
import HomePageComponent from "./components/HomePageComponent";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [errMsg, setErrMsg] = useState("");
  const [office, setOffice] = useState("");

  useEffect(() => {
    const checkSesssion = async () => {
      const result = await API.checkSession();
      if (!result.error) {
        setUser(result);
      } else {
        setUser({});
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
    <Container fluid style={{ background: "#F0F8FF", minHeight: "100vh" }}>
      <NavigationBar
        logout={handleLogout}
        office={office}
        setErrMsg={setErrMsg}
      />
      <Routes>
        <Route
          path="/login"
          element={
            !user?.username ? (
              <LoginComponent setErrorMsg={setErrMsg} setOffice={setOffice} />
            ) : (
              <Navigate replace to="/back/pages" />
            )
          }
        />
        <Route path="/" element={<HomePageComponent />} />
        //Front office
        <Route
          path="/front"
          element={
            <PagesListComponent setError={setErrMsg} setOffice={setOffice} />
          }
        />
        //Back office
        <Route
          path="/logout"
          element={
            user?.username ? (
              <LogoutComponent logout={handleLogout} setOffice={setOffice} />
            ) : (
              <NotAuthorizedComponent />
            )
          }
        ></Route>
        <Route
          path="/back/pages"
          element={
            user?.username ? (
              <PagesListComponent setError={setErrMsg} setOffice={setOffice} />
            ) : (
              <NotAuthorizedComponent />
            )
          }
        />
         <Route
          path="/back/new"
          element={
            user?.username ? (
              <EditPageComponent setErrMsg={setErrMsg} setOffice={setOffice} />
            ) : (
              <NotAuthorizedComponent />
            )
          }
        />
        <Route
          path="/back/edit/:id"
          element={
            user?.username ? (
              <EditPageComponent setErrMsg={setErrMsg} setOffice={setOffice} />
            ) : (
              <NotAuthorizedComponent />
            )
          }
        />
        <Route path="*" element={<NotFoundComponent />} />
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
