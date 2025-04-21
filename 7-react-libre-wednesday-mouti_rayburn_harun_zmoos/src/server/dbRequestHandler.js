const mysql = require("mysql2");

class DbRequestHandler {
  db;
  constructor() {
    this.db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "wordle_multiplayer",
    });

    this.db.connect((err) => {
      if (err) {
        throw err;
      }
      console.log("MySQL Connected...");
    });
  }

  generateSolution(callback) {
    this.db.query(
      "SELECT word FROM solutions ORDER BY RAND() LIMIT 1",
      (err, results) => {
        if (err) {
          return callback(err, null);
        }
        if (results.length === 0) {
          return callback(new Error("No solutions found"), null);
        }
        callback(null, results[0].word);
      }
    );
  }


  signup(username, hashedPassword, callback){
    const insertStatisticsSql =
      "INSERT INTO statistics (nbGames, winStreak) VALUES (0, 0)";
    this.db.query(insertStatisticsSql, (err, statisticsResult) => {
        if (err) throw err;
  
        const statistics_idstatistics = statisticsResult.insertId;
        const insertUserSql =
          "INSERT INTO users (username, password, statistics_idstatistics) VALUES (?, ?, ?)";
        this.db.query(
          insertUserSql,
          [username, hashedPassword, statistics_idstatistics],
          callback()
        );
      });
  }

  async checkUserExist(username) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users WHERE username = ?";
      this.db.query(sql, [username], (err, result) => {
        if (err) return reject(err);
        resolve(result.length > 0);
      });
    });
  }

  async getUser(username) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users WHERE username = ?";
      this.db.query(sql, [username], (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return resolve(null);
        resolve(result[0]);
      });
    });
  }
}

module.exports = DbRequestHandler;
