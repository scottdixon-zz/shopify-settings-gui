import React from 'react';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import {inputs, prettify, translate, splitByHeaders} from '../utils';
import {Card, Stack, FormLayout} from '@shopify/polaris';
import Input from './Input';

const SettingSection = ({section}) => (

  <div key={translate(section.name)} className="setting-section">
    <Card.Section>
      <p>{ translate(section.name) }</p>
    </Card.Section>
    <Card sectioned subdued>
      <Droppable droppableId={`${translate(section.name)}`}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className={`preview ${snapshot.isDraggingOver ? 'card-dragging-over' : ''}`}>

            {
              // If there are no settings yet display a message
              !section.settings.length && <p className="drop-message">Drop settings here!</p>
            }

            {
              section.settings && splitByHeaders(section.settings).map((headers) => {
                // Handle empty sections
                if (!headers[0]) {
                  return null;
                }

                const id = section.name + (headers[0].id || translate(headers[0].content) || translate(headers[0].label));
                return (
                  <Card sectioned key={id} subdued={snapshot.isDraggingOver}>
                    <FormLayout>
                      { headers && headers.map((setting) => {
                          // Each input needs a unique ID for drag & drop
                          setting.id = setting.id || id + translate(setting.content);
                          return <Input {...setting} key={setting.id} />
                        })
                      }
                      {provided.placeholder}
                    </FormLayout>
                  </Card>
                )
              })
            }
          </div>
        )}
      </Droppable>
    </Card>
  </div>
);

export default SettingSection;
