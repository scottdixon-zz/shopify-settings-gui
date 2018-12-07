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

const splitByHeaders = (section) => {
  let split = [];
  let temp = [];
  for (let subsectionIndex in section) {
    let subsection = {...section[subsectionIndex]}

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
}

// Label might be a string or a hash of translations
const translate = (content) => {
  if (typeof(content) === 'object') {
    // Pull out english if it's available otherwise the first translation
    return content['en'] || content[Object.keys(content)[0]]
  } else {
    return content;
  }
}

const inputMap = {
  header: Heading,
  color: Color,
  text: TextField,
  textarea: TextArea,
  radio: ChoiceList,
  checkbox: Checkbox,
  select: Select,
  range: RangeSlider,
  image_picker: ImagePicker,
}

export { splitByHeaders, translate, inputMap };
