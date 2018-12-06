import React, { Component } from 'react';
import Color from './Color';
import Heading from './Heading';
import ImagePicker from './ImagePicker';
import TextArea from './TextArea';
import { 
  TextField,
  ChoiceList,
  Checkbox,
  Select,
  RangeSlider,
} from '@shopify/polaris';

const inputMap = {
  heading: Heading,
  color: Color,
  text: TextField,
  textarea: TextArea,
  radio: ChoiceList,
  checkbox: Checkbox,
  select: Select,
  range: RangeSlider,
  image_picker: ImagePicker,
}

function Input(props) {
  const settings = {...props}
  settings.value = settings.default
  settings.helpText = settings.info
  settings.choices = settings.options
  settings.selected = settings.default
  
  const DynamicComponent = inputMap[settings.type]
  return <DynamicComponent {...settings} />

}

export default Input;
