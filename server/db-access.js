const sqlite = require('sqlite3');
const db = new sqlite.Database('CMSmall.db', (err) => {
    if(err) throw err;
});

module.exports = db ;