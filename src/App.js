import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { AppProvider, Page, Card, Button, Layout, TextStyle, TextField, Subheading, Stack, Badge, DropZone, FormLayout, ChoiceList, Checkbox, Select, RangeSlider } from '@shopify/polaris';
import Sticky from 'react-stickynode';
import Input from './components/Input';
import settingsSchema from './settings_schema.js';
import { splitByHeaders, translate } from './utils';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

class App extends Component {
  state = {
    tempJson: '',
    settingsSchema
  };

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    // Which section is our source in?
    const sourceSectionIndex = this.state.settingsSchema.findIndex(setting => {
      return setting.name === source.droppableId.split('_')[0]
    })

    // Which section is our source going to?
    const destinationSectionIndex = this.state.settingsSchema.findIndex(setting => {
      return setting.name === destination.droppableId.split('_')[0]
    })

    // Clone the settings
    const settings = [...this.state.settingsSchema];

    // Reference the input, move it
    const input = settings[sourceSectionIndex].settings[source.index];
    settings[sourceSectionIndex].settings.splice(source.index, 1);
    settings[destinationSectionIndex].settings.splice(destination.index, 0, input);

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
      console.log('Valid JSON')
    } catch (e) {
      console.log('Waiting for valid JSON')
    }
  };

  render() {
    return (
    <DragDropContext onDragEnd={this.onDragEnd}>
    <AppProvider>
      <Page fullWidth>
        <Layout>
          <Layout.Section secondary>
          <Card>
            {
              this.state.settingsSchema.map && this.state.settingsSchema.map((section) => {

              let originalIndex = 0;

              if (section.name == 'theme_info') return
              return (
                <div key={section.name}>
                  <Card.Section>
                    <p>{ translate(section.name) }</p>
                  </Card.Section>
                  <Card sectioned subdued>
                    { section.settings && splitByHeaders(section.settings).map(headers => {

                      const id = headers[0].content
                      return (
                        <Card sectioned key={id}>
                          <Droppable droppableId={`${section.name}_${id}`}>

                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                <FormLayout>

                                { headers && headers.map(setting => {
                                  let inputId;
                                  if (setting.id) {
                                    inputId = setting.id;
                                  } else if (setting.label) {
                                    inputId = id + setting.label;
                                  } else if (setting.content) {
                                    inputId = id + setting.content;
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
