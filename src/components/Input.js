import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {translate, inputs} from '../utils';

function Input(props) {
  const settings = {...props};
  settings.value = settings.default;
  settings.helpText = translate(settings.info);
  settings.label = translate(settings.label);
  settings.content = translate(settings.content);
  settings.choices = settings.options;
  settings.selected = settings.default;

  if (!inputs[settings.type]) {
    return <p><strong>{settings.type}</strong> not supported yet!</p>
  }

  const DynamicComponent = inputs[settings.type].component;

  console.log(`${settings.id}-${settings.originalIndex}`)

  return (
    <Draggable draggableId={`${settings.id}-${settings.originalIndex}`} index={parseInt(settings.originalIndex, 10)}>
      {(provided) => {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="draggable">
            { DynamicComponent ? <DynamicComponent {...settings} /> : <p><strong>{settings.type}</strong> not supported yet!</p> }
          </div>
        )
      }}
    </Draggable>
  )
}

export default Input;
