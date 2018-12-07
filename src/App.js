import React, { Component } from 'react';
import './App.css';
import { AppProvider, Page, Card, Layout, TextField, FormLayout } from '@shopify/polaris';
import Sticky from 'react-stickynode';
import Input from './components/Input';
import settingsSchema from './settings_schema.js';
import { splitByHeaders, translate } from './utils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class App extends Component {
  state = {
    tempJson: '',
    settingsSchema
  };

  onDragUpdate = (result) => {
    console.log('update')
    console.dir(JSON.stringify(result))
  };

  onDragEnd = (result) => {
    console.dir(result)
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    // Which section is our source in?
    const sourceSectionIndex = this.state.settingsSchema.findIndex(setting => {
      return translate(setting.name) === source.droppableId.split('_')[0]
    })

    // Which section is our source going to?
    const destinationSectionIndex = this.state.settingsSchema.findIndex(setting => {
      return translate(setting.name) === destination.droppableId.split('_')[0]
    })

    // Clone the settings
    const settings = [...this.state.settingsSchema];

    let desinationIndex = destination.index + Number(destination.droppableId.split('-')[1]);
    let input;

    if (source.droppableId === 'toolbar') {
      input = { type: "header", content: "HEADERZ" }

    } else {
      // Reference the input, move it
      input = settings[sourceSectionIndex].settings[source.index];
      settings[sourceSectionIndex].settings.splice(source.index, 1);

      if (desinationIndex >= source.index) {
        desinationIndex--;
      }
    }

    settings[destinationSectionIndex].settings.splice(desinationIndex, 0, input);






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
                    { section.settings && splitByHeaders(section.settings).map(headers => {
                      if (!headers[0]) {
                        return
                      }

                      const id = headers[0].id || translate(headers[0].content) || translate(headers[0].label)
                      console.log(headers)
                      return (
                        <Card sectioned key={id}>
                          <Droppable droppableId={`${translate(section.name)}_${id}-${headers[0].originalIndex}`}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
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
                                  { provided.placeholder }
                                  </FormLayout>
                                </div>
                              )}

                          </Droppable>
                        </Card>
                      )
                    }) }
                  </Card>
                </div>
              )
            }) }
          </Card>
          </Layout.Section>
          <Layout.Section secondary>
            <Card>
              <Card.Section>
              <Droppable droppableId="toolbar">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Draggable draggableId="heading" index={0}>
                      {provided => {
                        return (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="draggable">
                            <p>Heading</p>
                          </div>
                        )
                      }}
                    </Draggable>
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
