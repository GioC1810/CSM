const SERVER_URL = "http://localhost:3000/";

const getJson = (httpResponse) => {
  return new Promise((resolve, reject) => {
    httpResponse
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse the response" }));
        } else {
          response
            .json()
            .then((json) => {
                reject(json)
            })
            .catch((err) => {
            reject({ error: "Cannot parse the response" })
        });
        }
      })
      .catch((err) => {
        reject(err);
      })
  });
};

const getSiteName = async () => {
  try {
    const name = await getJson(fetch(SERVER_URL + "site-name"), {
      credentials: "include",
    });
    return name;
  } catch (err) {
    return err;
  }
};

const checkSession = async () => {
  try {
    const user = await getJson(
      fetch(SERVER_URL + "session", { credentials: "include", mode: 'cors' })
    );
    return user;
  } catch (err) {
    return err;
  }
};

const logIn = async (credentials) => {
  try {
    const obj = JSON.stringify(credentials);
    const user = await getJson(
      fetch(SERVER_URL + "login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // this parameter specifies that authentication cookie must be forwared
        body: JSON.stringify(credentials),
        mode: "cors"
      })
    );
    return user;
  } catch (err) {
    return {error: "The credentials are invalid"};
  }
};

const logout = () =>{
  fetch(SERVER_URL + "logout", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // this parameter specifies that authentication cookie must be forwared
    mode: "cors"
  })
}

const getAllPages = async () =>{
  try {
    const pages = await getJson(
      fetch(SERVER_URL + "page/all", { credentials: "include", mode: 'cors' })
    );
    return pages;
  } catch (err) {
    return err;
  }
}

const getUsers = async () =>{
  try{
    const users = await getJson(
      fetch(SERVER_URL + "users", {credentials: "include", mode: "cors"})
    );
    return users;
  } catch(err) {
    return err;
  }
}

const addPage = async (page) => {
  try{
    const result = await getJson(
      fetch(SERVER_URL + "page/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // this parameter specifies that authentication cookie must be forwared
        mode: "cors",
        body: JSON.stringify(page)
      })
    );
    return result;
  } catch(err){
    return err;
  }
}

const deletePage = async (id) => {
  try{
    const result = await getJson(
      fetch(SERVER_URL + `page/${id}`, {
        method : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // this parameter specifies that authentication cookie must be forwared
        mode: "cors",
      })
    );
    return result;
  } catch(err){
    return err;
  }
}

const modifyPage = async (page) => {
  try{
    const result = await getJson(
      fetch(SERVER_URL + `page/${page.id}`, {
        method : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // this parameter specifies that authentication cookie must be forwared
        mode: "cors",
        body: JSON.stringify(page)
      })
    );
    return result;
  } catch(err){
    return err;
  }
}

const changeSiteName = async (name) => {
  try{
    const result = await getJson(
      fetch(SERVER_URL + `site-name`, {
        method : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // this parameter specifies that authentication cookie must be forwared
        mode: "cors",
        body: JSON.stringify({siteName: name})
      })
    );
    return result;
  } catch(err){
    return err;
  }
}

const getImages = async () =>{
  try{
    const images = await getJson(
      fetch(SERVER_URL + "images", {
        headers:{
          "Content-Type": "application/json",
        },
        mode: "cors"
      })
    );
    return images;
  } catch(err){
    return err;
  }
}

const API = { getSiteName, logIn, checkSession, logout, getAllPages, getUsers, addPage, deletePage, modifyPage, changeSiteName, getImages };
export default API;
