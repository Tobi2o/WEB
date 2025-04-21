const WebSocket = require("ws");

class GameHandler {
  parties;
  wsPartyMap;
  constructor() {
    this.parties = {};
    this.wsPartyMap = new Map();
  }
  singlePlayer(ws, dbRequestHandler) {
    dbRequestHandler.generateSolution((err, solution) => {
      if (err) {
        ws.send(
            JSON.stringify({
              type: 'error',
              message: 'Failed to generate solution'
            })
        );
        return;
      }
        ws.send(
            JSON.stringify({
              type: 'single-player-solution',
              solution
            })
        );
    });
  }
  create_party(ws, dbRequestHandler) {
    const partyCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.parties[partyCode] = {
      players: [],
      guesses: {},
      solution: "",
      finished: {},
    };
    dbRequestHandler.generateSolution((err, solution) => {
      if (err) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Failed to generate solution",
          })
        );
        return;
      }
      this.parties[partyCode].solution = solution;
      ws.send(JSON.stringify({ type: "party-created", partyCode }));
    });
  }

  join_party(ws, partyCode, user, clientList, rejoinTimeouts) {
    if (!this.parties[partyCode]) {
      ws.send(JSON.stringify({ type: "error", message: "Party not found" }));
      return;
    }

    //if the user isn't already in the party and there is still room, join
    if (
      !this.parties[partyCode].players.includes(user) &&
      this.parties[partyCode].players.length < 2
    ) {
      this.parties[partyCode].players.push(user);
      this.parties[partyCode].guesses[user] = [];
      this.wsPartyMap.set(ws, partyCode);

      ws.send(JSON.stringify({ type: "joined-party", partyCode }));

      if (this.parties[partyCode].players.length === 2) {
        this.parties[partyCode].players.forEach((player) => {
          clientList.forEach((client) => {
            if (
              client.readyState === WebSocket.OPEN &&
              client.username === player
            ) {
              client.send(JSON.stringify({ type: "start-game" }));
            }
          });
        });
      } else {
        ws.send(JSON.stringify({ type: "waiting-for-opponent" }));
      }
    } else {
      // If the player was already in the party, handle rejoining
      clearTimeout(rejoinTimeouts.get(user)); // Clear any existing rejoin timeout
      rejoinTimeouts.delete(user);

      this.wsPartyMap.set(ws, partyCode);
      ws.send(JSON.stringify({ type: "joined-party", partyCode }));

      // Send all previous guesses in one batch if the player is rejoining
      const playerGuesses = this.parties[partyCode].guesses[user] || [];
      ws.send(JSON.stringify({ type: "ack-guesses", guesses: playerGuesses }));

      // Check if the player is waiting for the opponent to finish
      if (this.parties[partyCode].finished[user]) {
        ws.send(JSON.stringify({ type: "waiting-for-opponent-to-finish" }));
      } else if (this.parties[partyCode].players.length < 2) {
        ws.send(JSON.stringify({ type: "waiting-for-opponent" }));
      } else {
        // If both players are in the party, ensure the game starts
        this.parties[partyCode].players.forEach((player) => {
          clientList.forEach((client) => {
            if (
              client.readyState === WebSocket.OPEN &&
              client.username === player &&
              playerGuesses === 0
            ) {
              client.send(JSON.stringify({ type: "start-game" }));
            }
          });
        });
      }
    }
  }

  guess(ws, user, guess, clientList) {
    const partyCode = this.wsPartyMap.get(ws);

    if (!partyCode || !this.parties[partyCode]) {
      ws.send(JSON.stringify({ type: "error", message: "Party not found" }));
      return;
    }

    const solution = this.parties[partyCode].solution;
    const formattedGuess = formatGuess(guess, solution);

    console.log("Formatted Guess:", formattedGuess); // Add logging here

    if (formattedGuess.length)
      this.parties[partyCode].guesses[user].push(formattedGuess);

    const playerGuesses = this.parties[partyCode].guesses[user];
    const isCorrect = playerGuesses
      .slice(-1)[0]
      .every((letter) => letter.color === "green");

    // Send acknowledgment to the client
    if (formattedGuess.length)
      ws.send(JSON.stringify({ type: "ack", guess: formattedGuess }));

    if (isCorrect || playerGuesses.length >= 6) {
      this.#endGame(partyCode, ws, user, playerGuesses, clientList);
    }
  }

  #endGame(partyCode, ws, user, playerGuesses, clientList) {
    this.parties[partyCode].finished[user] = playerGuesses.length;
    if (
      Object.keys(this.parties[partyCode].finished).length ===
      this.parties[partyCode].players.length
    ) {
      const winner = determineWinner(this.parties[partyCode].finished);
      this.parties[partyCode].players.forEach((player) => {
        clientList.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client.username === player) {
            switch(winner) {
              case 'draw':
                client.send(JSON.stringify({ type: 'game-over', result: 'draw' }));
                break;
              case player:
                client.send(JSON.stringify({ type: 'game-over', result: 'win' }));
                break;
              default:
                client.send(JSON.stringify({ type: 'game-over', result: 'lose', winner }));
            }
          }
        });
      });
      // Clean up after game over
      delete this.parties[partyCode];
      this.wsPartyMap.forEach((value, key) => {
        if (value === partyCode) {
          this.wsPartyMap.delete(key);
        }
      });
    } else {
      // Notify the player that they are waiting for the opponent to finish
      ws.send(JSON.stringify({ type: "waiting-for-opponent-to-finish" }));
      // Notify the opponent that the player has finished
      this.parties[partyCode].players.forEach((player) => {
        if (player !== user) {
          clientList.forEach((client) => {
            if (
              client.readyState === WebSocket.OPEN &&
              client.username === player
            ) {
              client.send(JSON.stringify({ type: "opponent-finished" }));
            }
          });
        }
      });
    }
  }

  leave(ws, rejoinTimeouts) {
    const partyCode = this.wsPartyMap.get(ws);
    if (partyCode) {
      this.wsPartyMap.delete(ws);

      // Set a timeout for rejoining
      rejoinTimeouts.set(
        ws.username,
        setTimeout(() => {
          if (this.parties[partyCode]) {
            this.parties[partyCode].players = this.parties[
              partyCode
            ].players.filter((player) => player !== ws.username);
            if (
              this.parties[partyCode].players.length === 0 ||
              Object.keys(this.parties[partyCode].finished).length ===
                this.parties[partyCode].players.length
            ) {
              delete this.parties[partyCode];
            }
          }
          rejoinTimeouts.delete(ws.username);
        }, 30000)
      ); // 30 seconds timeout for rejoining
    }
  }
}

function formatGuess(guess, solution) {
  guess = guess.toUpperCase();
  solution = solution.toUpperCase();
  let solutionArray = [...solution];
  let formattedGuess = [...guess].map((l) => ({ key: l, color: "grey" }));

  formattedGuess.forEach((l, i) => {
    if (solution[i] === l.key) {
      formattedGuess[i].color = "green";
      solutionArray[i] = null;
    }
  });

  formattedGuess.forEach((l, i) => {
    if (solutionArray.includes(l.key) && l.color !== "green") {
      formattedGuess[i].color = "yellow";
      solutionArray[solutionArray.indexOf(l.key)] = null;
    }
  });

  return formattedGuess;
}

function determineWinner(finished) {
  const [player1, player2] = Object.keys(finished);
  if (finished[player1] < finished[player2]) return player1;
  if (finished[player2] < finished[player1]) return player2;
  return "draw";
}

module.exports = GameHandler