import React from 'react';
import { Stack } from '@shopify/polaris';

function Color(props) {
  return (
    <Stack wrap={false}>
      <div style={{ background: props.default, borderRadius: '3px', height: '19px', width: '38px' }}></div>
      <p>{ props.label }</p>
    </Stack>
  )
}

export default Color;
