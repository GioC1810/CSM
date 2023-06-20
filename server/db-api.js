"use strict";

const db = require("./db-access");
const dayjs = require("dayjs");

exports.getUser = (username) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM USERS WHERE USERNAME = ?";
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      if (row == undefined) {
        resolve({ error: "user not found" });
      } else {
        const user = {
          username: row.username,
          password: row.password,
          salt: row.salt,
          role: row.role,
        };
        resolve(user);
      }
    });
  });
};

exports.getUsers = (username) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM USERS";
    db.all(sql, [username], (err, rows) => {
      if (err) reject(err);
      if (rows == undefined || rows.length === 0) {
        resolve({ error: "users not found" });
      } else {
        const users = rows.map((user) => user.username);
        resolve(users);
      }
    });
  });
};

exports.getRoleAndNickNameByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT role, nickname FROM USERS WHERE USERNAME = ?";
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      if (row == undefined) {
        resolve({ error: "user not found" });
      } else {
        const userData = { role: row.role, nickname: row.nickname };
        resolve(userData);
      }
    });
  });
};

exports.getPages = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM PAGES ";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      if (rows.length === 0) {
        resolve({ error: "pages not present" });
      } else {
        const pagesList = rows.map((page) => {
          let pageType = "draft";
          if (page.publicationDate) {
            let pubDate = dayjs(page.publicationDate, "dd/MM/YYYY");
            pageType = pubDate.isAfter(dayjs()) ? "scheduled" : "published";
          }
          return {
            id: page.id,
            title: page.title,
            author: page.author,
            creationDate: dayjs(page.creationDate, "dd/MM/YYYY"),
            publicationDate:
              page.publicationDate && dayjs(page.publicationDate, "dd/MM/YYYY"),
            type: pageType,
          };
        });
        resolve(pagesList);
      }
    });
  });
};

exports.getPagesByAuthor = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM PAGES WHERE AUTHOR = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) reject(err);
      if (rows.length === 0) {
        resolve({ error: "pages not present" });
      } else {
        const pagesList = rows.map((page) => {
          let pageType = "draft";
          if (page.publicationDate) {
            let pubDate = dayjs(page.publicationDate, "dd/MM/YYYY");
            pageType = pubDate.isAfter(dayjs()) ? "scheduled" : "published";
          }
          return {
            id: page.id,
            title: page.title,
            author: page.author,
            creationDate: dayjs(page.creationDate, "dd/MM/YYYY"),
            publicationDate:
              page.publicationDate && dayjs(page.publicationDate, "dd/MM/YYYY"),
            type: pageType,
          };
        });
        resolve(pagesList);
      }
    });
  });
};

exports.getBlockByPagesId = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM BLOCKS WHERE PAGE = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) reject(err);
      const blockList = rows.map((block) => {
        return {
          id: block.id,
          type: block.type,
          content: block.content,
          position: block.position,
        };
      });
      resolve(blockList);
    });
  });
};

exports.getWebSiteName = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT name FROM WEB_SITE_NAME WHERE id = 1";
    db.get(sql, (err, row) => {
      if (err) reject(err);
      resolve(row.name);
    });
  });
};

exports.modifyWebSiteName = (name) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE WEB_SITE_NAME SET name=? WHERE ID = 1";
    db.run(sql, [name], (err) => {
      console.log(err)
      if (err) reject(err);
      resolve();
    });
  });
};

exports.addPage = (page) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO PAGES (author, creationDate, publicationDate, title) VALUES (?, ?, ?, ?)";
    db.run(
      sql,
      [page.author, page.creationDate, page.publicationDate, page.title],
      function (err) {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
};

exports.addBlocks = (pageId, blocks) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO BLOCKS (page, type, content, position) VALUES (?, ?, ?, ?)";
    const insertions = blocks.map((block) => {
      return new Promise((resolve, reject) => {
        db.run(
          sql,
          [pageId, block.type, block.content, block.position],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    });
    Promise.all(insertions)
      .then(() => resolve())
      .catch((err) => reject());
  });
};

exports.getLastId = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT last_insert_rowid() as lastId";
    db.get(sql, [], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row.lastId);
    });
  });
};

exports.updatePage = (page) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE PAGES SET title = ?, publicationDate = ? WHERE id = ?";
    db.run(sql, [page.title, page.publicationDate, page.id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

exports.deletePage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM PAGES WHERE id = ?";
    db.run(sql, [id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

exports.updatePageAdminMode = (page) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE PAGES SET author = ?, title = ?, publicationDate = ? WHERE id = ?";
    db.run(
      sql,
      [page.author, page.title, page.publicationDate, page.id],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};

exports.deleteBlocks = (pageId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM BLOCKS WHERE page = ?";
    db.run(sql, [pageId], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

exports.getPagesId = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id FROM PAGES";
    db.all(sql, (err, rows) => {
      console.log(err)
      if (err) reject(err);
      console.log(rows)
      const idlist = rows.map((row) => row.id);
      resolve(idlist);
    });
  });
};
