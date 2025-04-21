const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const cookieParser = require("cookie-parser");

var zxcvbn = require("zxcvbn");
const GameHandler = require("./gameHandler.js");
const DbRequestHandler = require("./dbRequestHandler.js");
// Function to validate email
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

require("dotenv").config();

const jwtSecret = process.env.PRIVATE_KEY;
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const dbRequestHandler = new DbRequestHandler();

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/auth-check", authenticateToken, (req, res) => {
  res.status(200).json({ username: req.user.username });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await dbRequestHandler.getUser(email);
    if (!user) {
      // Hash the password to prevent timing attacks
      await bcrypt.hash(password, 10);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ username: user.username }, jwtSecret, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!validateEmail(username)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    const userExist = await dbRequestHandler.checkUserExist(username);
    if (userExist) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Check password strength
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
      return res.status(400).json({ error: "Password is too weak" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    dbRequestHandler.signup(username, hashedPassword, (err, userResult) => {
      if (err) throw err;
      res.status(201).json({ message: "User created successfully." });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "An error occurred during signup." });
  }
});

app.get("/user", authenticateToken, async (req, res) => {
  try {
    const user = await dbRequestHandler.getUser(req.user.username);
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "An error occurred while retrieving user" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true });
  res.status(200).json({ message: "Logged out successfully" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, verifyClient });

const gameHandler = new GameHandler();
const rejoinTimeouts = new Map();

function verifyClient(info, callback) {
  const cookies = info.req.headers.cookie;
  if (!cookies) {
    return callback(false, 401, "Unauthorized");
  }

  const token = cookies.split(";").find((c) => c.trim().startsWith("token="));
  if (!token) {
    return callback(false, 401, "Unauthorized");
  }

  jwt.verify(token.split("=")[1], jwtSecret, (err, user) => {
    if (err) {
      return callback(false, 403, "Forbidden");
    }
    info.req.user = user;
    callback(true);
  });
}

wss.on("connection", (ws, req) => {
  ws.username = req.user.username; // Ensure username is stored in WebSocket

  // Set up a heartbeat mechanism
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    const user = ws.username;

    switch (data.type) {
      case "create-party":
        gameHandler.create_party(ws, dbRequestHandler);
        break;
      case "join-party":
        const { partyCode } = data;
        gameHandler.join_party(
          ws,
          partyCode,
          user,
          wss.clients,
          rejoinTimeouts
        );
        break;
      case "guess":
        const guess = data.guess;
        gameHandler.guess(ws, user, guess, wss.clients);
        break;
      case "single-player":
        gameHandler.singlePlayer(ws, dbRequestHandler);
        break;
      default:
        break;
    }
  });

  ws.on("close", () => {
    gameHandler.leave(ws, rejoinTimeouts);
  });
});

// Set up a heartbeat interval
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", () => {
  clearInterval(interval);
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
