import React from 'react';
import {Stack} from '@shopify/polaris';

function Color(props) {
  return (
    <div className="color-container">
      <Stack wrap={false}>
        <div style={{background: props.default}} className="color-preview"></div>
        <p>{props.label}</p>
      </Stack>
    </div>
  )
}

export default Color;
