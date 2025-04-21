import { assert, expect } from "chai";
import { cellPixelSize } from "../src/constants.js";
import { MoveMessage } from "../src/messages.js";
import { onMouseMovement } from "../src/inputListener.js";

describe("Input listener", () => {
  it("Moving mouse to same position should not send message twice", () => {
    // Test that, if moving mouse two times in a row so that the two positions belong te the same column, then only one message is sent to move the shape.

    const mouseMove = { clientX: cellPixelSize + 10 };
    const canvas = {
      getBoundingClientRect: () => {
        return { left: 0 };
      },
    };

    const column = Math.floor((mouseMove.clientX - 0) / cellPixelSize);
    var count = 0;

    var messageListener = (msg) => {
      //test that the column in the message is the right one
      expect(msg.getCol()).to.equal(column);
      count += 1;
    };

    onMouseMovement(canvas, mouseMove, messageListener);
    onMouseMovement(canvas, mouseMove, messageListener);

    expect(count).to.equal(1);
  });
});
