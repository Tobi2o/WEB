import { DropMessage, MoveMessage, RotateMessage } from "./messages.js";
import { cellPixelSize } from "./constants.js";

var lastCol;

export function onMouseMovement(canvas, mouseMovement, messageListener) {
  const rect = canvas.getBoundingClientRect();
  const newCol = Math.floor(
    (mouseMovement.clientX - rect.left) / cellPixelSize
  );
  if (newCol != lastCol) {
    var msg = new MoveMessage(newCol);
    messageListener(msg);
  }
  lastCol = newCol;
}

export function onKeyPress(onKey, messageListener) {
  const keyName = onKey.key;
  var msg;
  if (keyName === "ArrowLeft") {
    msg = new RotateMessage("left");
  } else if (keyName === "ArrowRight") {
    msg = new RotateMessage("right");
  } else if (keyName === "ArrowDown") {
    msg = new DropMessage();
  }
  messageListener(msg);
}

/**
 * Sets up all event listeners for user interactions:
 * - A click on the canvas or a key press on the down arrow will send a `DropMessage`.
 * - A movement of the mouse on the canvas will send a `MoveMessage` with the corresponding column.
 * - A key press on the left or right arrow will send a left or right `RotateMessage`.
 * @param canvas The canvas on which the game is drawn
 * @param messageListener The callback function handling the messages to be sent. It expects a `Message` as unique argument.
 */
export function setListeners(canvas, messageListener) {
  window.addEventListener("keydown", (onKey) => {
    onKeyPress(onKey, messageListener);
  });

  canvas.addEventListener("mousemove", (mouseMovement) => {
    onMouseMovement(canvas, mouseMovement, messageListener);
  });

  canvas.addEventListener("click", (click) => {
    // left click
    if (click.button === 0) {
      var msg = new DropMessage();
      messageListener(msg);
    }
  });
}
