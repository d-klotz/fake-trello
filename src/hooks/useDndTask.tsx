import React from "react";
import Coord from "../models/Coord";
import TaskList from "../models/List";

export const useDndTask = (
  allLists: TaskList[],
  setAllLists: React.Dispatch<React.SetStateAction<TaskList[]>>
) => {
  const width = React.useRef(0);
  const height = React.useRef(0);
  const [taskDragging, setTaskDragging] = React.useState(false);
  const [coord, setCoord] = React.useState<Coord>({
    x: 0,
    y: 0,
  });

  const mouseOffset = React.useRef<Coord>({
    x: 0,
    y: 0,
  });

  const mouseCoord = React.useRef<Coord>({
    x: 0,
    y: 0,
  });

  const dragIndexes = React.useRef({
    taskIndex: 0,
    listIndex: 0,
  });

  const beginTaskDrag = (
    taskIndex: number,
    listIndex: number,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rect: DOMRect
  ) => {
    mouseOffset.current = {
      x: event.clientX - rect.x,
      y: event.clientY - rect.y,
    };
    dragIndexes.current = {
      taskIndex,
      listIndex,
    };
    width.current = rect.width;
    height.current = rect.height;
    setPosition(event.clientX, event.clientY);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
  };

  const setPosition = React.useCallback((x: number, y: number) => {
    mouseCoord.current = { x, y };
    setCoord({ x: x - mouseOffset.current.x, y: y - mouseOffset.current.y });
  }, []);

  const mouseMove = React.useCallback(
    (ev: MouseEvent) => {
      setTaskDragging(true);
      document.body.style.cursor = "grabbing";
      setPosition(ev.clientX, ev.clientY);
    },
    [setPosition]
  );

  const mouseUp = React.useCallback(() => {
    document.body.style.cursor = "auto";
    setTaskDragging(false);
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", mouseUp);
  }, [mouseMove]);

  const moveTaskHorizontally = React.useCallback(
    (toIndex: number) => {
      if (toIndex === dragIndexes.current.listIndex) return;

      const newList = [...allLists];

      newList[toIndex].tasks.push(
        newList[dragIndexes.current.listIndex].tasks[
          dragIndexes.current.taskIndex
        ]
      );

      newList[dragIndexes.current.listIndex].tasks.splice(
        dragIndexes.current.taskIndex,
        1
      );

      dragIndexes.current = {
        listIndex: toIndex,
        taskIndex: newList[toIndex].tasks.length - 1,
      };

      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  const moveTaskVertically = React.useCallback(
    (toTaskIndex: number) => {
      if (
        toTaskIndex < 0 ||
        toTaskIndex >= allLists[dragIndexes.current.listIndex].tasks.length
      )
        return;

      const newList = [...allLists];

      const tmp =
        newList[dragIndexes.current.listIndex].tasks[
          dragIndexes.current.taskIndex
        ];

      newList[dragIndexes.current.listIndex].tasks.splice(
        dragIndexes.current.taskIndex,
        1
      );

      newList[dragIndexes.current.listIndex].tasks.splice(toTaskIndex, 0, tmp);

      dragIndexes.current.taskIndex = toTaskIndex;

      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  return {
    taskDragging,
    coord,
    beginTaskDrag,
    dragIndexes: dragIndexes.current,
    moveTaskVertically,
    moveTaskHorizontally,
    width: width.current,
    height: height.current,
  };
};
