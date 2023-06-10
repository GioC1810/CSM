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

const getUserInfo = async () => {
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

const API = { getSiteName, logIn, getUserInfo, logout, getAllPages, getUsers };
export default API;
