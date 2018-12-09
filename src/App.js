import React, {Component} from 'react';
import './App.css';
import {AppProvider, Page, Card, Layout, TextField, Stack, Badge} from '@shopify/polaris';
import Sticky from 'react-stickynode';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Toolbar from './components/Toolbar';
import SettingSection from './components/SettingSection';
import {translate, inputs } from './utils';

class App extends Component {
  state = {
    tempJson: '',
    settingsSchema: [{name: 'Section 1', settings: []}],
    dragging: null,
  };

  onDragUpdate = ({draggableId}) => {
    this.setState({dragging: draggableId});
  };

  // Each input needs a unique ID for Shopify themes and drag & drop
  createUniqueId = (input, inputUniqueProperty, destinationSectionIndex, instances=0) => {
    const id = input[inputUniqueProperty];
    const needle = instances ? `${id}${inputUniqueProperty === 'id' ? '_' : ' '}${instances}` : id;
    let matched = false;

    for (let section in this.state.settingsSchema) {
      for (let setting of this.state.settingsSchema[section].settings) {
        if (setting.type === input.type && setting[inputUniqueProperty] === needle) {
          matched = true;
        }
      }
    }

    if (!matched) {
      return needle;
    }

    return this.createUniqueId(input, inputUniqueProperty, destinationSectionIndex, ++instances);
  };

  onDragEnd = (result) => {
    const {destination, source, draggableId } = result;

    // Ignore toolbar components dropped elsewhere
    if (source.droppableId === 'toolbar' && !destination) {
      return;
    }

    // Ignore components dropped onto the toolbar
    if (destination && destination.droppableId === 'toolbar') {
      return;
    }

    // Clone the settings
    const settings = [...this.state.settingsSchema];

    // Which section is our source in?
    const sourceSectionIndex = this.state.settingsSchema.findIndex((setting) => {
      return translate(setting.name) === source.droppableId.split('_')[0];
    });

    // Allow items to be removed
    if (!destination) {
      settings[sourceSectionIndex].settings.splice(source.index, 1);
      this.setState({settingsSchema: settings});
      return;
    }

    // Which section is our source going to?
    const destinationSectionIndex = this.state.settingsSchema.findIndex((setting) => {
      return translate(setting.name) === destination.droppableId.split('_')[0];
    });

    const desinationIndex = destination.index;
    let input;

    if (source.droppableId === 'toolbar') {
      // handle individual sections
      if (result.draggableId === 'section') {
        settings.push({name: `Section ${settings.length + 1}`, settings: []});
        this.setState({settingsSchema: settings}, () => this.outputSchema());
        return;
      }
      input = {...inputs[draggableId].json};
      const inputUniqueProperty = (input.type === 'header') ? 'content' : 'id';
      input[inputUniqueProperty] = this.createUniqueId(input, inputUniqueProperty, destinationSectionIndex);
    } else {
      // Reference the input, move it
      input = settings[sourceSectionIndex].settings[source.index];
      settings[sourceSectionIndex].settings.splice(source.index, 1);
    }

    settings[destinationSectionIndex].settings.splice(desinationIndex, 0, input);
    this.setState({settingsSchema: settings});

    this.outputSchema();
  };

  updateDimensions = () => {
    if (document.querySelector('#TextField1')) {
      document.querySelector('#TextField1').style.maxHeight = window.innerHeight - 170 + 'px';
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateDimensions);
  };

  outputSchema = () => {
    const output = [...this.state.settingsSchema];
    this.setState({tempJson: JSON.stringify(output, null, 4)});
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
    this.outputSchema();
  };

  handleChange = (tempJson) => {
    // Handle empty panel
    if (tempJson === '') {
      tempJson = JSON.stringify([{name: 'Section 1', settings: []}], null, 4);
    }

    this.setState({tempJson});
    try {
      const settingsSchema = JSON.parse(tempJson);
      this.setState({settingsSchema});
    } catch (error) {
      // Waiting for valid JSON
    }
  };

  render() {
    return (
      <AppProvider>
        <DragDropContext onDragEnd={this.onDragEnd} onDragUpdate={this.onDragUpdate}>
          <Page fullWidth>
            <Toolbar dragging={this.state.dragging} />
            <Layout>
              <Layout.Section secondary>
              <Card>
                {
                  this.state.settingsSchema.map && this.state.settingsSchema.map((section) => {
                    // Some theme settings contain theme_info, we can ignore this
                    if (section.name !== 'theme_info') {
                      return <SettingSection section={section} key={section.name} />
                    }
                  })
                }
              </Card>
              </Layout.Section>
              <Layout.Section secondary>
                <Sticky enabled={true} top={0} bottomBoundary={0}>
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
                </Sticky>
              </Layout.Section>
            </Layout>
          </Page>
        </DragDropContext>
      </AppProvider>
    );
  }
}

export default App;
