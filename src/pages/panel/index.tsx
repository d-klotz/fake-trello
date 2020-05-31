import React from "react";
import { ThemeContext } from "styled-components";
import CardList from "../../components/cardlist";
import VisualList from "../../components/cardlist/visualList";
import NewList from "../../components/newList";
import VisualTaskCard from "../../components/taskCard/VisualTaskCard";
import DndTaskContext, {
  DndTaskContextValue,
} from "../../Contexts/DndTaskContext";
import { LabelContext } from "../../Contexts/LabelContext";
import { TaskListContext } from "../../Contexts/TaskListContext";
import useDndList from "../../hooks/useDnDList";
import { useDndTask } from "../../hooks/useDndTask";
import useMouseScrollHorizontal from "../../hooks/useMouseScrollHorizontal";
import { Container, LabelBtn, LabelFilter, ListContainter } from "./styles";

const Panel = () => {
  const theme = React.useContext(ThemeContext);
  const { state, actions } = React.useContext(LabelContext);
  const { allLists , setAllLists} = React.useContext(TaskListContext);

  // useInit(taskListContextValue.addList, actions.createLabel, theme);

  const {
    beginDragList,
    draggedListIndex,
    draggingList,
    draggedListCoord,
    height,
    moveListHorizontally,
  } = useDndList(allLists, setAllLists);

  const {
    beginTaskDrag,
    coord,
    taskDragging,
    dragIndexes,
    moveTaskVertically,
    width,
    moveTaskHorizontally,
    height: taskHeight,
  } = useDndTask(allLists, setAllLists);

  const { scrollRef, scrollToRight } = useMouseScrollHorizontal(draggingList);

  const dndContextValue: DndTaskContextValue = React.useMemo(
    () => ({
      beginTaskDrag,
      taskDragging,
      taskIndex: dragIndexes.taskIndex,
      listIndex: dragIndexes.listIndex,
      moveTaskVertically,
      moveTaskHorizontally,
      height: taskHeight,
    }),
    [
      dragIndexes.taskIndex,
      dragIndexes.listIndex,
      taskDragging,
      beginTaskDrag,
      moveTaskVertically,
      moveTaskHorizontally,
      taskHeight,
    ]
  );

  // if (!allLists[dragIndexes.listIndex].tasks[dragIndexes.taskIndex]) {
  //   console.log(allLists);
  //   console.log(dragIndexes);
  // }

  return (
    <DndTaskContext.Provider value={dndContextValue}>
      <Container>
        <LabelFilter>
          {state.labels.map((label) => (
            <LabelBtn
              key={label.id}
              on={label.selected}
              color={label.color}
              onClick={() => actions.toggleSelection(label.id)}
            >
              {label.title}
            </LabelBtn>
          ))}
          <LabelBtn
            on={state.noTagSelected}
            color="#ccc"
            onClick={() => actions.toggleNoTag()}
          >
            No label
          </LabelBtn>
        </LabelFilter>
        <ListContainter id="scroll-test" ref={scrollRef}>
          {allLists.map((list, index) => (
            <CardList
              selfTaskDragging={taskDragging && dragIndexes.listIndex === index}
              key={list.id}
              listIndex={index}
              list={list}
              beginDragList={beginDragList}
              draggingSelf={draggingList && draggedListIndex === index}
              draggingList={draggingList}
              moveListHorizontally={moveListHorizontally}
            />
          ))}
          <NewList scrollToRight={scrollToRight} />
          <div
            style={{
              minWidth: "8px",
              height: "100%",
              margin: 0,
            }}
          />
        </ListContainter>

        {taskDragging && (
          <VisualTaskCard
            task={allLists[dragIndexes.listIndex].tasks[dragIndexes.taskIndex]}
            left={coord.x}
            top={coord.y}
            width={width}
          />
        )}

        {draggingList && (
          <VisualList
            list={allLists[draggedListIndex]}
            listIndex={draggedListIndex}
            left={draggedListCoord.x}
            top={draggedListCoord.y}
            height={height}
          />
        )}
      </Container>
    </DndTaskContext.Provider>
  );
};

export default Panel;
