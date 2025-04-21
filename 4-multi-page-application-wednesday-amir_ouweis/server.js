import express from "express";
import sqlite3 from "sqlite3";

const app = express();

// Configure express
app.use(express.urlencoded());
app.use(express.json());

// Configure the template engine
app.set("view engine", "ejs");

// Connect to the database dictons.sqlite
const DBSOURCE = "dictons.sqlite";
let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  }
});

// GET /
// Displays a random dicton in HTML.
// Example: <q>random dicton</q>
app.get("/", (req, res) => {
  var sql = "SELECT * FROM dictons ORDER BY RANDOM() LIMIT 1";
  var params = [];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (row) {
      res.render("dicton", {
        dicton: row.dicton,
      });
    } else {
      res.status(404).send("404 not found");
    }
  });
});

// GET /list
// Displays all the dictons ordered by id in HTML
// Example: <ul><li><a href="/1">dicton 1</a></li></ul>
app.get("/list", (req, res) => {
  var sql = "select * from dictons";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.render("list", { rows: rows });
  });
});

// GET /create
// Displays a HTML form for creating new dictons with POST requests.
// Example: <form method=POST><input type='text' name='dicton'></input><button>Nouveau dicton</button></form>
app.get("/create", (req, res) => {
  res.render("create");
});

// POST /create
// Inserts a new dicton in the database and redirect the user to its url
// Example: 301 /list
app.post("/create", (req, res) => {
  db.run(
    "INSERT INTO dictons (dicton) VALUES (?)",
    req.body.dicton,
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        const insertedId = this.lastID;
        res.redirect(`/${insertedId}`);
      }
    }
  );
});

// GET /:id
// Returns a dicton by its id.
app.get("/:id", (req, res) => {
  var sql = "SELECT dicton FROM  dictons WHERE id = ?";
  db.get(sql, req.params.id, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (row) {
      res.render("dicton", {
        dicton: row.dicton,
      });
    } else {
      res.status(404).send("404 not found");
    }
  });
});

export default app;
