import React, { Component } from 'react';
import { TextField } from '@shopify/polaris';

function TextArea(props) {
  return (
    <TextField {...props} multiline />
  )
}

export default TextArea;
