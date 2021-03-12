import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CheckboxInput, TextInput } from '../components/core/Input';
// import { ThemeConfig } from '../components/config/Theme';
// import { PrimaryButtonLink, TextLink } from '../components/core/Link';
// import { LandingHeaderText, LandingHeaderTitle } from '../components/core/Text';

// fake data generator
const getItems = (count: number) => Array.from({ length: count }, (v, k) => k).map((k) => ({
  id: `item-${k}`,
  content: `item ${k}`,
}));

// a little function to help us with reordering the result
// eslint-disable-next-line max-len
const reorder = (list: Iterable<unknown> | ArrayLike<unknown>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: any) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});

function LandingPage() {
  const [reorderEnable, setReorderEnable] = useState<any>(true);
  const [input, setInput] = useState<any>("test");
  const [items, setItems] = useState<any>(getItems(10));

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index,
    );

    console.log(items);

    setItems(newItems);
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <>
      <CheckboxInput
        id="reorder-enable-1"
        checked={reorderEnable}
        onChange={(e) => setReorderEnable(!reorderEnable)}
      />
      <TextInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <TextInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <TextInput value="Test" readOnly={!reorderEnable} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {items.map((item: any, index: any) => (
                // eslint-disable-next-line max-len
                <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={reorderEnable} disableInteractiveElementBlocking={reorderEnable}>
                  {(providedTemp, snapshotTemp) => (
                    <div>
                      <div
                        ref={providedTemp.innerRef}
                        {...providedTemp.draggableProps}
                        {...providedTemp.dragHandleProps}
                        style={getItemStyle(
                          snapshotTemp.isDragging,
                          providedTemp.draggableProps.style,
                        )}
                      >
                        <TextInput
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                        />
                        {item.content}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

// Put the thing into the DOM!
export default LandingPage;

// function LandingPage() {
//   return (
//     <>
//       <LandingHeaderTitle>
//         CodeJoust
//       </LandingHeaderTitle>
//       <LandingHeaderText>
//         Compete live against friends and classmates to solve coding challenges.
//       </LandingHeaderText>
//       <PrimaryButtonLink
//         color={ThemeConfig.colors.gradients.blue}
//         to="/game/create"
//       >
//         Create a room
//       </PrimaryButtonLink>
//       <br />
//       <TextLink to="/game/join">
//         Or join an existing room &#8594;
//       </TextLink>
//     </>
//   );
// }

// export default LandingPage;
