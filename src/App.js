import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { AppProvider, Page, Card, Button, Layout, TextStyle, TextField, Subheading, Stack, Badge, DropZone, FormLayout, ChoiceList, Checkbox, Select, RangeSlider } from '@shopify/polaris';
import Sticky from 'react-stickynode';
import Input from './components/Input';
import settingsSchema from './settings_schema.js';
import { splitByHeadings, translate } from './utils';

class App extends Component {
  state = {
    tempJson: '',
    settingsSchema
  };
  
  componentDidMount = () => {
    this.setState({
      tempJson: JSON.stringify(this.state.settingsSchema, null, 4)
    })
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
    <AppProvider>
      <Page fullWidth>
        <Layout>
          <Layout.Section secondary>
          <Card>
            { this.state.settingsSchema.map && this.state.settingsSchema.map((section) => {
              // Ignore theme info
              if (section.name == 'theme_info') return
              
              return (
                <div>
                  <Card.Section>
                    <p>{ translate(section.name) }</p>
                  </Card.Section>
                  <Card sectioned subdued>
                    { section.settings && splitByHeadings(section.settings).map(headings => {
                      return (
                        <Card sectioned>
                          <FormLayout>
                            { headings && headings.map(setting => <Input {...setting}/>) }
                          </FormLayout>
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
            <Sticky enabled={true} top={0} className="sticky-json">
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
    </AppProvider>
    );
  }
}

export default App;
