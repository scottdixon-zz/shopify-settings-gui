import React, { Component } from 'react';
import { DropZone } from '@shopify/polaris';

function ImagePicker(props) {
  return (
    <DropZone label={ props.label } type="image">
      <DropZone.FileUpload />
    </DropZone>
  )
}

export default ImagePicker;
