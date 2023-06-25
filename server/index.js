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

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    db_API.getUser(username).then((user) => {
      if (user.error) {
        return cb(null, false, { message: "user not present in the db" });
      }

      crypto.scrypt(password, user.salt, 32, (err, hashedPwd) => {
        if (err) reject(err);
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
    res.json({ username: req.body.username, ...userData });
  });
});

app.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: "user not authenitcated" });
  }
});

const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ error: "NOT AUTHENTICATED - GO AWAY" });
  }
};

app.get("/page/all", async (req, res) => {
  try {
    let pages = await db_API.getPages();
    const pagesWithBlock = await Promise.all(
      pages.map(async (page) => {
        const block = await db_API.getBlockByPagesId(page.id);
        page.contents = block;
        return page;
      })
    );
    pagesWithBlock.sort((p1, p2) => {
      if (p1.publicationDate && p2.publicationDate) {
        return p1.publicationDate.diff(p2.publicationDate);
      } else if (p1.publicationDate) {
        return -1;
      } else if (p2.publicationDate) {
        return 1;
      } else {
        return 0;
      }
    });
    if (req.isAuthenticated()) {
      res.status(200).json(pagesWithBlock);
    } else {
      res
        .status(200)
        .json(pagesWithBlock.filter((p) => p.type === "published"));
    }
  } catch (err) {
    res.status(500).json({ error: "an error occurred", content: err });
  }
});

app.get("/site-name", (req, res) => {
  db_API
    .getWebSiteName()
    .then((name) => res.status(200).json(name))
    .catch((err) => res.status(500).json({ error: "Cannot connect to db" }));
});

app.get("/images", (req, res) => {
  db_API.getImages()
  .then((images) => res.status(200).json(images))
  .catch((err) => res.status(500).json({error: "Cannot retrieve images"}))
})

app.use(isLogged);

app.put(
  "/site-name",
  [check("siteName").isLength({ min: 1, max: 50 })],
  async (req, res) => {
    if (req.user.role !== "admin") {
      res.status(400).json({error: "user not authorized to perform this action"})
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({error: "title length too long"});
      }
      try {
        await db_API.modifyWebSiteName(req.body.siteName);
        res.status(200).json({ message: "site name change correctly" });
      } catch (err) {
        res.status(500).json({ error: "db error" });
      }
    }
  }
);

app.get("/users", (req, res) => {
  db_API
    .getUsers()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) =>
      res.status(500).json({ error: "errror in retrieving the users" })
    );
});

app.post(
  "/page/",
  [
    check("title").isLength({ min: 1, max: 20 }),
    check("author").isLength({ min: 5, max: 15 }),
    check("contents[0].position").isNumeric(),
    check("contents.length").isInt({ min: 2 }),
  ],
  async (req, res) => {
    if (req.body.author !== req.user.username && req.user.role !== "admin") {
      res
        .status(400)
        .json({ error: "user not authorized to perform this operation" });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors);
      }
      //check sulle date
      const creationDate = req.body.creationDate;
      if (!dayjs(creationDate, "dd/MM/YYYY").isValid()) {
        return res
          .status(400)
          .json({ error: "the creation date is in a wrong format" });
      }
      const publicationDate = req.body.publicationDate;

      if (publicationDate && !dayjs(publicationDate, "dd/MM/YYYY").isValid()) {
        return res
          .status(400)
          .json({ error: "the publication date is in a wrong format" });
      }
      const pagesTitle = await db_API.getPagesTitle();
      if(pagesTitle.includes(req.body.title)){
        return res.status(400).json({error: "a page with this title already exist!"})
      }
      //check sulla validità dei contenuti
      //si verifica che il tipo sia o header, o image o paragraph
      //e che nel caso sia image, l'immagine sia di una di quelle valide
      //e che l'header sia presente
      let contentTypeIsValid = true;
      let headerPresent = false;
      const images = await db_API.getImages();

      req.body.contents.forEach((block) => {
        if (
          !contentsType.includes(block.type) ||
          (block.type == "image" && !images.includes(block.content))
        ) {
          contentTypeIsValid = false;
          return;
        }
        if (block.type == "header") {
          headerPresent = true;
        }
      });

      if (!contentTypeIsValid || !headerPresent) {
        return res
          .status(400)
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
  }
);

app.put(
  "/page/:id",
  [
    check("title").isLength({ min: 1, max: 20 }),
    check("author").isLength({ min: 5, max: 15 }),
    check("contents[0].position").isNumeric(),
    check("contents.length").isInt({ min: 2 }),
  ],
  async (req, res) => {
    const pages = await db_API.getPagesByAuthor(req.user.username);
    const pageToDelete =
      pages.length > 0
        ? pages.filter((p) => p.id === parseInt(req.params.id))[0]
        : null;
    if (
      (!pageToDelete && req.user.role !== "admin") ||
      (req.user.role !== "admin" && pageToDelete.author !== req.user.username)
    ) {
      res
        .status(400)
        .json({ error: "user not authorized to perform this operation" });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors);
      }
      //check sulle date
      const creationDate = req.body.creationDate;
      if (!dayjs(creationDate, "dd/MM/YYYY").isValid()) {
        return res
          .status(400)
          .json({ error: "the creation date is in a wrong format" });
      }
      const publicationDate = req.body.publicationDate;

      if (publicationDate && !dayjs(publicationDate, "dd/MM/YYYY").isValid()) {
        return res
          .status(400)
          .json({ error: "the publication date is in a wrong format" });
      }
      const pagesTitle = await db_API.getPagesTitle();
      if(pagesTitle.includes(req.body.title)){
        return res.status(400).json({error: "a page with this title already exist!"})
      }

      let contentTypeIsValid = true;
      let headerPresent = false;
      const images = await db_API.getImages();

      req.body.contents.forEach((block) => {
        if (
          !contentsType.includes(block.type) ||
          (block.type == "image" && !images.includes(block.content))
        ) {
          contentTypeIsValid = false;
          return;
        }
        if (block.type == "header") {
          headerPresent = true;
        }
      });

      if (!contentTypeIsValid || !headerPresent) {
        return res
          .status(400)
          .json({ error: "the type of the content is not valid" });
      }

      const page = {
        id: req.params.id,
        title: req.body.title,
        author: req.body.author,
        publicationDate: req.body.publicationDate,
      };
      try {
        if (req.user.role === "admin") {
          await db_API.updatePageAdminMode(page);
        } else {
          await db_API.updatePage(page);
        }

        await db_API.deleteBlocks(page.id);
        await db_API.addBlocks(page.id, req.body.contents);
        res.status(200).json({ message: "page modified correctly" });
      } catch (err) {
        res.status(500).json({ error: "an error occurred", content: err });
      }
    }
  }
);

app.delete("/page/:id", [check("id").isNumeric()], async (req, res) => {
  const pages = await db_API.getPagesByAuthor(req.user.username);
  const pageToDelete =
    pages.length > 0
      ? pages.filter((p) => p.id === parseInt(req.params.id))[0]
      : null;
  if (
    (!pageToDelete && req.user.role !== "admin") ||
    (req.user.role !== "admin" && pageToDelete.author !== req.user.username)
  ) {
    res
      .status(400)
      .json({ error: "user not authorized to perform this operation" });
  } else {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    try {
      const listId = await db_API.getPagesId();
      if (!listId.includes(parseInt(req.params.id, 10))) {
        res.status(404).json({ error: "page not present in the db" });
      } else {
        await db_API.deletePage(req.params.id);
        await db_API.deleteBlocks(req.params.id);
        res.status(200).json({ msg: "page correctly eliminated" });
      }
    } catch (err) {
      res.status(500).json({ error: "the db is not available" });
    }
  }
});

app.delete("/logout", (req, res) => {
  req.logout(() => {
    res.json({ result: "logout executed" }).end();
  });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
