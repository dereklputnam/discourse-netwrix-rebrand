# Netwrix Discourse Rebrand Theme

A custom Discourse theme component for Netwrix branding and styling.

## Features

- Custom dark mode detection and theming
- Branded color schemes for light and dark modes
- Custom category styling with colored accent bars
- Responsive category icons sizing
- Product category icon management
- Custom list removal utilities

## Installation

### From GitHub

1. In your Discourse admin panel, go to **Customize > Themes**
2. Click **Install** and choose **From a git repository**
3. Enter the repository URL
4. Click **Install**

### Manual Installation

1. Download this repository as a ZIP file
2. In your Discourse admin panel, go to **Customize > Themes**
3. Click **Install** and choose **Upload a theme**
4. Select the ZIP file and click **Upload**

## Structure

```
discourse-netwrix-rebrand/
├── about.json                              # Theme metadata
├── common/
│   ├── common.scss                         # Main stylesheet
│   └── head_tag.html                       # Dark mode detection script
└── javascripts/
    └── discourse/
        └── initializers/
            ├── remove-custom-lists.js       # Remove custom navigation lists
            ├── category-icon-resize.js      # Resize category icons
            └── hide-product-icons.js        # Hide product category icons
```

## Modernization

This theme has been updated to use modern Discourse APIs:
- Converted from deprecated `<script type="text/discourse-plugin">` to `apiInitializer`
- Uses modern ES6 imports
- Compatible with Discourse's latest plugin architecture

## Development

To make changes to this theme:

1. Clone the repository
2. Make your changes to the appropriate files
3. Test on a development Discourse instance
4. Commit and push your changes
5. The theme will auto-update on instances using the GitHub installation method

## Browser Support

This theme supports all modern browsers that Discourse supports.

## License

Copyright Netwrix. All rights reserved.
