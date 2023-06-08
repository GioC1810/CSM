"use strict";

const PORT = 3000;

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const crypto = require("crypto");
const dayjs = require("dayjs");
const db_API = require("./db-api");
const { check, validationResult } = require("express-validator");

const contentsType = ["header", "image", "paragraph"];
const images = ["canoa.jpg", "mare.jpg", "paesaggio.jpg", "piramide.jpg"];

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    db_API.getUser(username).then((user) => {
      if (user.error) {
        return cb(null, false, { message: "user not present in the db" });
      }

      crypto.scrypt(password, user.salt, 32, (err, hashedPwd) => {
        if (err) rejec(err);
        if (
          !crypto.timingSafeEqual(Buffer.from(user.password, "hex"), hashedPwd)
        ) {
          return cb(null, false, { message: "incorrect username or password" });
        }
        return cb(null, user);
      });
    });
  })
);

app.use(
  session({
    secret: "abcdegrtshabdqbdijbdwd",
    resave: false,
    saveUninitialized: false,
  })
);

//session personalization
passport.serializeUser((user, cb) => {
  cb(null, { username: user.username, role: user.role });
});

passport.deserializeUser((user, cb) => {
  cb(null, { username: user.username, role: user.role });
});

app.use(passport.authenticate("session"));

app.post("/login", passport.authenticate("local"), (req, res) => {
  db_API.getRoleAndNickNameByUsername(req.body.username).then((userData) => {
    res.json(userData);
  });
});

const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(500).send("NOT AUTHENTICATED - GO AWAY");
  }
};

function requireAdminRole() {
  return (req, res, next) => {
    console.log(req.user);
    if (req.isAuthenticated() && req.user.role === "admin") {
      next();
    } else {
      res.sendStatus(403);
    }
  };
}

app.use(isLogged);

app.get("/response", (req, res) => {
  console.log(req.user);
  res.json("hello, you are authenitcated");
});

app.get("/admin", requireAdminRole(), (req, res) => {
  res.json("you are an admin role");
});

app.post(
  "/page/",
  [
    check("title").isLength({ min: 1, max: 20 }),
    check("author").isLength({ min: 5, max: 15 }),
    check("contents[0].content").isLength({ min: 5 }),
    check("contents[0].position").isNumeric(),
    check("contents.length").isInt({min: 2})
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
    //check sulle date
    const creationDate = req.body.creationDate;
    if (!dayjs(creationDate, "dd/MM/YYYY").isValid()) {
      return res
        .status(422)
        .json({ error: "the creation date is in a wrong format" });
    }
    const publicationDate = req.body.publicationDate;

    if (publicationDate && !dayjs(publicationDate, "dd/MM/YYYY").isValid()) {
      return res
        .status(422)
        .json({ error: "the publication date is in a wrong format" });
    }
    //check sulla validità dei contenuti
    //si verifica che il tipo sia o header, o image o paragraph
    //e che nel caso sia image, l'immagine sia di una di quelle valide
    //e che l'header sia presente
    let contentTypeIsValid = true;
    let headerPresent = false;

    req.body.contents.forEach((block) => {
      if (
        !contentsType.includes(block.type) ||
        (block.type == "image" && !images.includes(block.content))
      ) {
        contentTypeIsValid = false;
        return;
      }
      if(block.type == "header"){
        headerPresent = true;
      }
    });

    if (!contentTypeIsValid || !headerPresent) {
      return res
        .status(422)
        .json({ error: "the type of the content is not valid" });
    }

    const new_page = {
      title: req.body.title,
      author: req.body.author,
      creationDate: req.body.creationDate,
      publicationDate: req.body.publicationDate,
    };
    try {
      await db_API.addPage(new_page);
      const lastId = await db_API.getLastId();
      await db_API.addBlocks(lastId, req.body.contents);
      res
        .status(200)
        .json({ message: "page inserted correctly with its content" });
    } catch (err) {
      res.status(500).json({ error: "an error occurred", content: err });
    }
  }
);

app.put(
  "/page/:id",
  [
    check("title").isLength({ min: 1, max: 20 }),
    check("author").isLength({ min: 5, max: 15 }),
    check("contents[0].content").isLength({ min: 5 }),
    check("contents[0].position").isNumeric(),
    check("contents.length").isInt({min: 2})
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
    //check sulle date
    const creationDate = req.body.creationDate;
    if (!dayjs(creationDate, "dd/MM/YYYY").isValid()) {
      return res
        .status(422)
        .json({ error: "the creation date is in a wrong format" });
    }
    const publicationDate = req.body.publicationDate;

    if (publicationDate && !dayjs(publicationDate, "dd/MM/YYYY").isValid()) {
      return res
        .status(422)
        .json({ error: "the publication date is in a wrong format" });
    }
    //check sulla validità dei contenuti
    //si verifica che il tipo sia o header, o image o paragraph
    //e che nel caso sia image, l'immagine sia di una di quelle valide
    //e che l'header sia presente
    let contentTypeIsValid = true;
    let headerPresent = false;

    req.body.contents.forEach((block) => {
      if (
        !contentsType.includes(block.type) ||
        (block.type == "image" && !images.includes(block.content))
      ) {
        contentTypeIsValid = false;
        return;
      }
      if(block.type == "header"){
        headerPresent = true;
      }
    });

    if (!contentTypeIsValid || !headerPresent) {
      return res
        .status(422)
        .json({ error: "the type of the content is not valid" });
    }

    const page = {
      id: req.params.id,
      title: req.body.title,
      author: req.body.author,
      publicationDate: req.body.publicationDate,
    };
    try {
      if(req.user.role == 'admin'){
        console.log("admin role")
        await db_API.updatePageAdminMode(page);
      }else{
        console.log("user role")
        await db_API.updatePage(page)
      }
      
      await db_API.deleteBlocks(page.id);
      await db_API.addBlocks(page.id, req.body.contents);
      res
        .status(200)
        .json({ message: "page inserted correctly with its content" });
    } catch (err) {
      res.status(500).json({ error: "an error occurred", content: err });
    }
  }
);

app.delete("/page/:id", [check("id").isNumeric()], async (req, res) =>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
  try{
    await db_API.deletePage(req.params.id);
    await db_API.deleteBlocks(req.params.id);
    res.status(200).json({msg: "page correctly eliminated"})
  }catch(err){
    res.status(500).json({error: "the db is not available"})
  }
})

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});

