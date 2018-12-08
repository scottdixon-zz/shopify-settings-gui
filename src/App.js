import React, { Component } from 'react';
import './App.css';
import { AppProvider, Page, Card, Layout, TextField, FormLayout, Stack } from '@shopify/polaris';
import Sticky from 'react-stickynode';
import Input from './components/Input';
import settingsSchema from './settings_schema.js';
import { splitByHeaders, translate } from './utils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class App extends Component {
  state = {
    tempJson: '',
    settingsSchema,
    toolbarDraggingIndex: -1
  };

  onDragUpdate = (result) => {
    console.log('update')
    console.dir(JSON.stringify(result))
    this.setState({ toolbarDraggingIndex: result.source.index })
  };

  onDragEnd = (result) => {
    console.dir(result)
    const { destination, source } = result;

    // Ignore toolbar components dropped elsewhere
    if (source.droppableId === 'toolbar' && !destination) {
      return;
    }

    // Ignore components dropped onto the toolbar
    if (destination.droppableId === 'toolbar') {
      return;
    }

    // Clone the settings
    const settings = [...this.state.settingsSchema];

    // Which section is our source in?
    const sourceSectionIndex = this.state.settingsSchema.findIndex(setting => {
      return translate(setting.name) === source.droppableId.split('_')[0]
    })

    // Allow items to be removed
    if (!destination) {
      settings[sourceSectionIndex].settings.splice(source.index, 1);
      this.setState({ settingsSchema: settings })
      return;
    }

    // Which section is our source going to?
    const destinationSectionIndex = this.state.settingsSchema.findIndex(setting => {
      return translate(setting.name) === destination.droppableId.split('_')[0]
    })

    let desinationIndex = destination.index;
    let input;

    if (source.droppableId === 'toolbar') {
      // if (settings[sourceSectionIndex].settings.find(setting => setting.content === 'HEADERZ')) {
      //
      // }
      input = { type: "header", content: "Heading" }
    } else {
      // Reference the input, move it
      input = settings[sourceSectionIndex].settings[source.index];
      settings[sourceSectionIndex].settings.splice(source.index, 1);
    }

    settings[destinationSectionIndex].settings.splice(desinationIndex, 0, input);
    this.setState({ settingsSchema: settings })

    this.outputSchema();
  }

  outputSchema = () => {
    const output = [...this.state.settingsSchema];
    this.setState({ tempJson: JSON.stringify(output, null, 4) });
  }

  componentDidMount = () => {
    this.outputSchema();
  }

  handleChange = (tempJson) => {
    this.setState({ tempJson });
    try {
      const settingsSchema = JSON.parse(tempJson);
      this.setState({ settingsSchema });
      console.log('Valid JSON');
    } catch (e) {
      console.log('Waiting for valid JSON');
    }
  };

  render() {
    return (
    <DragDropContext onDragEnd={this.onDragEnd} onDragUpdate={this.onDragUpdate}>
    <AppProvider>
      <Page fullWidth>
        <Layout>
          <Layout.Section secondary>
          <Card>
            {
              this.state.settingsSchema.map && this.state.settingsSchema.map((section) => {

              if (section.name == 'theme_info') return

              return (
                <div key={translate(section.name)}>
                  <Card.Section>
                    <p>{ translate(section.name) }</p>
                  </Card.Section>
                  <Card sectioned subdued>
                    <Droppable droppableId={`${translate(section.name)}`}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className={snapshot.isDraggingOver ? 'card-dragging-over preview' : 'preview'}>

                          { !section.settings.length && <p className="drop-message">Drop some settings here.</p>}


                          { section.settings && splitByHeaders(section.settings).map(headers => {
                              // Handle empty sections
                              if (!headers[0]) return

                              const id = section.name + (headers[0].id || translate(headers[0].content) || translate(headers[0].label))
                              return (
                                <Card sectioned key={id} subdued={snapshot.isDraggingOver}>
                                  <FormLayout>
                                    { headers && headers.map(setting => {
                                        let inputId;
                                        if (setting.id) {
                                          inputId = setting.id;
                                        } else if (setting.label) {
                                          inputId = id + translate(setting.label);
                                        } else if (setting.content) {
                                          inputId = id + translate(setting.content);
                                        }
                                        setting.id = inputId
                                        return (
                                          <Input {...setting} key={inputId} />
                                        )
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
              )
            })
          }
          </Card>
          </Layout.Section>
          <Layout.Section secondary>
            <Card>
              <Card.Section>
              <Droppable droppableId="toolbar" direction="horizontal">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} id="toolbar">
                    <Stack>
                      <Draggable draggableId="heading" index={0}>
                        {provided => {
                          return (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={this.state.toolbarDraggingIndex === 0 ? 'dragging' : 'lock'}>
                              <p><strong>Heading</strong></p>
                            </div>
                          )
                        }}
                      </Draggable>
                      <Draggable draggableId="radio" index={1}>
                        {provided => {
                          return (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={this.state.toolbarDraggingIndex === 1 ? 'dragging' : 'lock'}>
                              <input type="radio"/> Radio
                            </div>
                          )
                        }}
                      </Draggable>
                      <Draggable draggableId="checkbox" index={2}>
                        {provided => {
                          return (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={this.state.toolbarDraggingIndex === 2 ? 'dragging' : 'lock'}>
                              <input type="checkbox"/> Checkbox
                            </div>
                          )
                        }}
                      </Draggable>
                    </Stack>
                  </div>
                )}
                </Droppable>
              </Card.Section>
            </Card>

              <Card>
                <Card.Section>
                  <TextField
                    labelHidden="true"
                    placeholder="json"
                    onChange={this.handleChange}
                    value={this.state.tempJson}
                    multiline
                  />
                </Card.Section>
              </Card>

          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
    </DragDropContext>
    );
  }
}

export default App;
