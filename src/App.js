import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { AppProvider, Page, Card, Button, Layout, TextStyle, TextField, Subheading, Stack, Badge, FormLayout } from '@shopify/polaris';

const splitByHeadings = (section) => {
  let split = [];
  let temp = [];
  for (let subsection of section) {
    if (subsection.type === 'heading' && temp.length) {
      // Push what we have so far and reset temp
      split.push([...temp]);
      temp = [];
    }
    temp.push(subsection);
  }
  split.push([...temp]);
  return split;
}


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
            "type": "heading",
            "content": "Heading Example"
          },
          {
            "type": "color",
            "label": "Colour Example",
            "id": "color_example",
            "default": "#333333"
          },
          {
             "type": "text",
             "id": "text_example",
             "default": "",
             "placeholder": "placeholder",
             "label": "Text Example",
          },
          {
             "type": "textarea",
             "id": "textarea_example",
             "label": "Textarea Example",
             "info": ""
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
                    { section.settings && splitByHeadings(section.settings).map(headings => {
                      return (
                        <Card sectioned>
                          <FormLayout>
                            { headings && headings.map(setting => {
                              if (setting.type === 'heading') {
                                return (
                                  <Subheading>{ setting.content }</Subheading>
                                )
                              } else if (setting.type === 'color') {
                                return (
                                  <Stack wrap={false}>
                                    <div style={{ background: setting.default, borderRadius: '3px', height: '19px', width: '38px' }}></div>
                                    <p>{ setting.label }</p>
                                  </Stack>
                                )
                              } else if (setting.type === 'text') {
                                return (
                                  <TextField
                                    label={ setting.label }
                                    value={ setting.default }
                                    helpText={ setting.info }
                                    placeholder={ setting.placeholder }
                                  />
                                )
                              } else if (setting.type === 'textarea') {
                                return (
                                  <TextField
                                    label={ setting.label }
                                    value={ setting.default }
                                    helpText={ setting.info }
                                    placeholder={ setting.placeholder }
                                    multiline
                                  />
                                )
                              } else {
                                console.log('Unrecognized type:', setting.type)
                              }
                            })}
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
