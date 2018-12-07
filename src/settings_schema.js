export default [
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
        "type": "header",
        "content": "Another Heading Example"
      },
      {
        "type": "header",
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
      },
      {
         "type":      "radio",
         "id":        "radio_example",
         "label":     "Radio Example",
         "options": [
           { "value": "one", "label": "Radio one" },
           { "value": "two", "label": "Radio two" }
         ],
         "default":   "two"
      },
      {
         "type":      "checkbox",
         "id":        "checkbox_example",
         "label":     "Checkbox Example",
         "default":   false,
      },
      {
         "type":      "select",
         "id":        "select_example",
         "label":     "Select Example",
         "options": [
           {
             "value": "Option 1",
             "label": "Option 1"
           },
           {
             "value": "Option 2",
             "label": "Option 2"
           }
         ],
         "default":   "Option 2",
      },
      {
        "type":      "range",
        "id":        "range_example",
        "min":       12,
        "max":        18,
        "step":       1,
        "unit":       "px",
        "label":     "Range Example",
        "default":   16,
      },
      {
        "type": "image_picker",
        "id": "image_picker_example",
        "label": "Image Picker Example"
      }
    ]
  },
  {
    "name": "Typography"
  }
];
