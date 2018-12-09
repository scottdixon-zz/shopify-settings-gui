import Color from './components/Color';
import Heading from './components/Heading';
import ImagePicker from './components/ImagePicker';
import TextArea from './components/TextArea';
import {
  TextField,
  ChoiceList,
  Checkbox,
  Select,
  RangeSlider,
} from '@shopify/polaris';

const prettify = (str) => {
  return str.split('_').map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join(' ');
};

const splitByHeaders = (section) => {
  const split = [];
  let temp = [];
  for (let subsectionIndex in section) {
    const subsection = {...section[subsectionIndex]}

    // Settings are broken up into sections,
    // we need to keep track of their original index
    // so we can rearrange later
    subsection.originalIndex = subsectionIndex

    if (subsection.type === 'header' && temp.length) {
      // Push what we have so far and reset temp
      split.push([...temp]);
      temp = [];
    }
    temp.push(subsection);
  }
  split.push([...temp]);
  return split;
};

// Label might be a string or a hash of translations
const translate = (content) => {
  if (typeof content === 'object') {
    // Pull out english if it's available otherwise the first translation
    return content.en || content[Object.keys(content)[0]];
  } else {
    return content;
  }
};

const inputs = {
  header: {
    component: Heading,
    json: {
      type: 'header',
      content: 'Heading Example',
    },
  },
  text: {
    component: TextField,
    json: {
      type: 'text',
      id: 'text_example',
      default: '',
      placeholder: 'placeholder',
      label: 'Text Example',
    },
  },
  textarea: {
    component: TextArea,
    json: {
      type: 'textarea',
      id: 'textarea_example',
      label: 'Textarea Example',
      info: '',
    },
  },
  radio: {
    component: ChoiceList,
    json: {
      type: 'radio',
      id: 'radio_example',
      label: 'Radio Example',
      options: [
        {value: 'one', label: 'Radio one'},
        {value: 'two', label: 'Radio two'},
      ],
      default: 'two',
    },
  },
  checkbox: {
    component: Checkbox,
    json: {
      type: 'checkbox',
      id: 'checkbox_example',
      label: 'Checkbox Example',
      default: false,
      info: 'Optional information about this checkbox',
    },
  },
  select: {
    component: Select,
    json: {
      type: 'select',
      id: 'select_example',
      label: 'Select Example',
      options: [
        {value: 'Option 1', label: 'Option 1'},
        {value: 'Option 2', label: 'Option 2'},
      ],
      default: 'Option 2',
      info: 'Optional information about this select',
    },
  },
  range: {
    component: RangeSlider,
    json: {
      type: 'range',
      id: 'range_example',
      min: 12,
      max: 18,
      step: 1,
      unit: 'px',
      label: 'Range Example',
      default: 16,
      info: 'Optional information about this range',
    },
  },
  color: {
    component: Color,
    json: {
      type: 'color',
      label: 'Colour Example',
      id: 'color_example',
      default: '#333333',
    },
  },
  image_picker: {
    component: ImagePicker,
    json: {
      type: 'image_picker',
      id: 'image_picker_example',
      label: 'Image Picker Example',
    },
  },
};

export {splitByHeaders, translate, inputs, prettify};
