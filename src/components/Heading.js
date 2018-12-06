import React, { Component } from 'react';
import { Subheading } from '@shopify/polaris';

function Heading(props) {
  return (
    <Subheading>{ props.content }</Subheading>
  )
}

export default Heading;
