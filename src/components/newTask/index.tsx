import React from "react";
import { Container } from "./styled";
import { FiX } from "react-icons/fi";
import { withTheme, DefaultTheme } from "styled-components";
import useKeyMouseToSaveClose from "../../hooks/useKeyMouseToSaveClose";
import useFocusInput from "../../hooks/useFocusInput";
import { TaskListContext } from "../../Contexts/TaskListContext";

interface Props {
  theme: DefaultTheme;
  listIndex: number;
  closeNewTask: () => void;
  scrolDown: () => void;
}

const NewTask = ({ theme, closeNewTask, listIndex, scrolDown }: Props) => {
  const [input, setInput] = React.useState("");
  const inputRef = useFocusInput<HTMLInputElement>();
  const {
    taskListActions: { addNewTask },
  } = React.useContext(TaskListContext);

  const saveInput = React.useCallback(() => {
    if (!input) return;
    addNewTask(input, listIndex);
    setInput("");
    scrolDown();
  }, [setInput, addNewTask, input, listIndex, scrolDown]);

  const { containerRef } = useKeyMouseToSaveClose(saveInput, closeNewTask);

  return (
    <Container ref={containerRef}>
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a title for this card..."
      />
      <div>
        <button
          onClick={() => {
            saveInput();
          }}
        >
          Add Card
        </button>
        <button onClick={closeNewTask}>
          <FiX size={24} color={theme.fontColor} />
        </button>
      </div>
    </Container>
  );
};

export default withTheme(NewTask);
