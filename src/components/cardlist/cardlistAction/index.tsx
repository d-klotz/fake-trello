import React from "react";
import { FiX } from "react-icons/fi";
import { TaskListContext } from "../../../Contexts/TaskListContext";
import useKeyMouseToSaveClose from "../../../hooks/useKeyMouseToSaveClose";
import Coord from "../../../models/Coord";
import { Container, Division } from "./styled";

interface Props {
  menuPosition: Coord;
  close: () => void;
  openNewTask: () => void;
  listIndex: number;
}

const CardlistAction = ({
  menuPosition,
  close,
  openNewTask,
  listIndex,
}: Props) => {
  const { containerRef } = useKeyMouseToSaveClose(() => {}, close);
  const {
    taskListActions: { deleteList },
  } = React.useContext(TaskListContext);
  return (
    <Container
      ref={containerRef}
      style={{
        top: menuPosition.y,
        left: menuPosition.x,
      }}
    >
      <header>
        <p>List Actions</p>
        <button onClick={close}>
          <FiX size={16} />
        </button>
      </header>
      <Division />
      <ul>
        <li>
          <button
            onClick={() => {
              openNewTask();
              close();
            }}
          >
            Add Card...
          </button>
        </li>
      </ul>
      <Division />
      <ul>
        <li>
          <button
            onClick={() => {
              deleteList(listIndex);
              close();
            }}
          >
            Archive this List
          </button>
        </li>
      </ul>
    </Container>
  );
};

export default CardlistAction;
