import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {AppProvider, Page, Card, Button, Layout, TextStyle, TextField } from '@shopify/polaris';

class App extends Component {
  state = {
    value: '',
    json: {}
  };

  handleChange = (value) => {
    this.setState({ value });
    try {
      const json = JSON.parse(value);
      this.setState({ json });
      console.log('Valid JSON', json)
    } catch (e) {
      console.log('Waiting for valid JSON')
    }
  };
  
  render() {
    return (
    <AppProvider>
      <Page fullWidth title="Example app">
        <Layout>
          <Layout.Section secondary>
          <Card>
          { this.state.json.map && this.state.json.map((section) => {
            if (section.name == 'theme_info') {
              return
            }
            return (
              <Card.Section>
                <p>{ section.name }</p>
              </Card.Section>
            )
          }) }

            <Card.Section>
              <p>Typography</p>
            </Card.Section>
          </Card>
          </Layout.Section>
          <Layout.Section secondary>
            <Card>
              <Card.Section>
                <TextField
                  label="Shipping address"
                  labelHidden="true"
                  placeholder="json"
                  onChange={this.handleChange}
                  value={this.state.value}
                  multiline
                />
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
    );
  }
}

export default App;
