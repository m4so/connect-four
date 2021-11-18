import { useEffect, useState } from "react";

const getCircleId1d = (offset, radius, margin) => {
  let circleId1d = -1;
  const div = offset / (2 * (radius + margin));
  const difference = Math.abs(div - Math.floor(div) - 0.5);
  if (difference < (radius * 0.8) / (2 * (radius + margin))) {
    circleId1d = Math.floor(div);
  }
  return circleId1d;
};

const getCircleId = (offset, windowSize) => {
  const [offsetX, offsetY] = offset;
  let circleId = -1;
  let radius, margin;
  if (windowSize.width < 768) {
    radius = 32;
    margin = 10;
  } else {
    radius = 48;
    margin = 15;
  }
  const circleIdX = getCircleId1d(offsetX, radius, margin);
  if (circleIdX < 0) {
    return circleId;
  }
  const circleIdY = getCircleId1d(offsetY, radius, margin);
  if (circleIdY < 0) {
    return circleId;
  }
  circleId = circleIdX + 4 * circleIdY;
  return circleId;
};

const useListLines = (props) => {
  const {
    windowSize,
    ctxRef,
    offsetStartDrawing,
    setOffsetStartDrawing,
    offsetFinishDrawing,
    setOffsetFinishDrawing,
    dotsToLine,
    lineToValidLines,
    willPlay,
    ...rest
  } = props;
  const [lines, setLines] = useState([]);
  const [validLines, setValidLines] = useState(Array(92).fill(1));
  useEffect(() => {
    if (offsetFinishDrawing[0] < 0 || offsetStartDrawing[0] < 0) {
      return;
    }
    if (!willPlay) {
      setOffsetStartDrawing([-1, -1]);
      setOffsetFinishDrawing([-1, -1]);
      return;
    }
    if (dotsToLine === undefined || lineToValidLines === undefined) {
      return;
    }
    if (offsetFinishDrawing[0] >= 0) {
      // save state
      const start = getCircleId(offsetStartDrawing, windowSize);
      const end = getCircleId(offsetFinishDrawing, windowSize);
      if (start < 0 || end < 0) {
        return;
      }
      const line = dotsToLine[start * 16 + end];

      // is valid line
      if (line === -1) {
        return;
      }
      if (validLines[line] === 0) {
        return;
      }
      //set state
      setLines((prevArray) => [...prevArray, line]);
      setValidLines((prevArray) => {
        let array = prevArray.slice();
        for (var i = 0; i < 92; i++) {
          array[i] *= lineToValidLines[line * 92 + i];
        }
        return array;
      });
      //draw line
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(offsetStartDrawing[0], offsetStartDrawing[1]);
      ctxRef.current.lineTo(offsetFinishDrawing[0], offsetFinishDrawing[1]);
      ctxRef.current.stroke();
    }
    // // init
    setOffsetStartDrawing([-1, -1]);
    setOffsetFinishDrawing([-1, -1]);
  }, [offsetFinishDrawing, dotsToLine, lineToValidLines, willPlay]);

  return [lines, setLines, validLines, setValidLines];
};
export default useListLines;
