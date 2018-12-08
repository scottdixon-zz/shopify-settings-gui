import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { inputs, prettify } from '../utils';
import { Card, Stack } from '@shopify/polaris';

const Toolbar = ({ dragging }) => (
  <Card>
    <Card.Section>
    <Droppable droppableId="toolbar" direction="horizontal">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} id="toolbar">
          <Stack>
          { Object.keys(inputs).map((input, index) => {
            if (inputs[input].json) {
              return (
                <Draggable draggableId={input} index={index} key={input}>
                  {provided => {
                    return (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={dragging === input ? 'dragging' : 'lock'}>
                        <Card subdued>{prettify(input)}</Card>
                      </div>
                    )
                  }}
                </Draggable>
              )
            }
          })}
          </Stack>
        </div>
      )}
      </Droppable>
    </Card.Section>
  </Card>
);

export default Toolbar;
