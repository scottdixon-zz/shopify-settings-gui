import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { AppProvider, Page, Card, Button, Layout, TextStyle, TextField, Heading } from '@shopify/polaris';

class App extends Component {
  state = {
    value: '',
    json: [
      {
        "name": "theme_info",
        "theme_name": "Debut",
        "theme_author": "Shopify",
        "theme_version": "10.1.1",
        "theme_documentation_url": "https:\/\/help.shopify.com\/manual\/using-themes\/themes-by-shopify\/debut",
        "theme_support_url": "https:\/\/support.shopify.com\/"
      },
      {
        "name": "Colors",
        "settings": [
          {
            "type": "color",
            "id": "color_text",
            "label": "Titles and headings",
            "default": "#3d4246"
          }
        ]
      },
      {
        "name": "Typography"
      }
    ]
  };
  
  componentDidMount = () => {
    this.setState({
      value: JSON.stringify(this.state.json, null, 4)
    })
  }

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
      <Page fullWidth>
        <Layout>
          <Layout.Section secondary>
          <Card>
            { this.state.json.map && this.state.json.map((section) => {
              if (section.name == 'theme_info') {
                return
              }
              return (
                <div>
                  <Card.Section>
                    <p>{ section.name }</p>
                  </Card.Section>
                  <Card sectioned subdued>
                    <Card sectioned>
                      <Heading>Online store dashboard</Heading>
                    </Card>
                  </Card>
                </div>
              )
            }) }
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
