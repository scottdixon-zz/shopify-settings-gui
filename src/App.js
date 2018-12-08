import React, { Component } from 'react';
import './App.css';
import { AppProvider, Page, Card, Layout, TextField, Stack, Badge } from '@shopify/polaris';
import Sticky from 'react-stickynode';
import Toolbar from './components/Toolbar';
import SettingSection from './components/SettingSection';
import { translate, inputs } from './utils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class App extends Component {
  state = {
    tempJson: '',
    settingsSchema: [{"name": "First section","settings": []}],
    dragging: null
  };

  onDragUpdate = ({draggableId}) => {
    this.setState({ dragging: draggableId })
  };

  // Each input needs a unique ID for Shopify themes and drag & drop
  createUniqueId = (input, inputUniqueProperty, destinationSectionIndex, instances) => {
    instances = instances || 0
    let id = input[inputUniqueProperty]
    let needle = instances ? `${id}${inputUniqueProperty === 'id' ? '_' : ' '}${instances}` : id;
    let matched = false;

    for (let section in this.state.settingsSchema) {
      for (let setting of this.state.settingsSchema[section].settings) {
        if (setting.type === input.type && setting[inputUniqueProperty] === needle) {
          matched = true;
        }
      }
    }

    if (!matched) {
      return needle
    }

    return this.createUniqueId(input, inputUniqueProperty, destinationSectionIndex, ++instances);
  };

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

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
      input = {...inputs[draggableId].json}
      const inputUniqueProperty = (input.type === 'header') ? 'content' : 'id';
      input[inputUniqueProperty] = this.createUniqueId(input, inputUniqueProperty, destinationSectionIndex)
    } else {
      // Reference the input, move it
      input = settings[sourceSectionIndex].settings[source.index];
      settings[sourceSectionIndex].settings.splice(source.index, 1);
    }

    settings[destinationSectionIndex].settings.splice(desinationIndex, 0, input);
    this.setState({ settingsSchema: settings })

    this.outputSchema();
  }

  updateDimensions = () => {
    if (document.querySelector('#TextField1')) {
      document.querySelector('#TextField1').style.maxHeight = window.innerHeight - 170 + 'px'
    }
  }

  componentWillUnmount = () => {
      window.removeEventListener("resize", this.updateDimensions);
  }

  outputSchema = () => {
    const output = [...this.state.settingsSchema];
    this.setState({ tempJson: JSON.stringify(output, null, 4) });
  }

  componentDidMount = () => {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
    this.outputSchema();
  }

  handleChange = (tempJson) => {
    // Handle empty panel
    if (tempJson === '') {
      tempJson = JSON.stringify([{"name": "First section","settings": []}], null, 4);
    }

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

        <Toolbar dragging={this.state.dragging} />

        <p>&nbsp;</p>
        <Layout>
          <Layout.Section secondary>
          <Card>
            {
              this.state.settingsSchema.map && this.state.settingsSchema.map((section) => {

              // Some theme settings contain theme_info, we can ignore this
              if (section.name == 'theme_info') return

              return <SettingSection section={section} key={section.name} />
            })
          }
          </Card>
          </Layout.Section>
          <Layout.Section secondary>


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
