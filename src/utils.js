const splitByHeaders = (section) => {
  let split = [];
  let temp = [];
  for (let subsectionIndex in section) {
    let subsection = {...section[subsectionIndex]}
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

export { splitByHeaders, translate };
