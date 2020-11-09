# Salesforce Community TailwindCSS Example

> Example SFDX project for using TailwindCSS in a Salesforce Lightning Community

- [Salesforce Community TailwindCSS Example](#salesforce-community-tailwindcss-example)
  - [Overview](#overview)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Deploying the Project](#deploying-the-project)
    - [Setting Up a Community](#setting-up-a-community)
    - [Using TailwindCSS in Theme Layout](#using-tailwindcss-in-theme-layout)
    - [Overriding Style of Standard Components](#overriding-style-of-standard-components)
    - [Building an Optimized CSS File](#building-an-optimized-css-file)
    - [Customizing TailwindCSS](#customizing-tailwindcss)
  - [License](#license)

## Overview

This example project demonstrates how to customize the visual design of a [Salesforce Lightning Community](https://www.salesforce.com/products/community-cloud/overview/) using the [TailwindCSS](https://tailwindcss.com/) library.

## Features

1. Custom theme layout and static resource to integrate TailwindCSS as global CSS resource
2. Build step to support TailwindCSS configuration and generate optimized CSS file
3. Use TailwindCSS in theme layout and web components
4. Use TailwindCSS to override style of standard layouts and components (e.g. global navigation bar)

## Getting Started

### Deploying the Project

Use Salesforce CLI to deploy this SFDX project to your org.

```bash
sfdx force:source:deploy -p force-app
```

### Setting Up a Community

1. Create a Lightning Community in Salesforce Setup using the _Build Your Own_ template.
2. Open the Experience Builder for the community and change the _Default_ theme layout component to _TailwindCSS Default Theme Layout_.
3. Adjust the theme layout properties as desired (e.g. enter a title).
4. Perform additional configuration (e.g. set up members and public access, create navigation items).
5. Activate and publish the community.

### Using TailwindCSS in Theme Layout

The global CSS file containing the TailwindCSS utility classes and other custom style definitions is loaded in the theme layout component `sctw_DefaultThemeLayout`. This makes the classes available to the layout itself and all the other components on the page.

The template of the theme layout component can make use of the TailwindCSS classes.

```html
<aura:component
  implements="forceCommunity:themeLayout"
  access="global"
  description="TailwindCSS Default Theme Layout"
>
  ...
  <ltng:require
    styles="{!$Resource.sctw_GlobalCommunityStyles + '/bin/global.css'}"
  />

  <!-- Use TailwindCSS utility classes -->
  <div class="container mx-auto md:my-4">...</div>
</aura:component>
```

### Overriding Style of Standard Components

Standard components like the global navigation bar, search field and user menu use the Salesforce Lightning Design System by default. They bring their own style definitions with some quite specific CSS selectors. Overriding the design of those components requires more specific selectors to be placed in the global CSS file. Then the TailwindCSS utility classes can be applied using the `@apply` directive.

The following example adjusts the design of the links in the global navigation bar.

```css
header
  .forceCommunityGlobalNavigation
  .comm-navigation__list
  .slds-list__item
  .comm-navigation__item
  a,
header
  .forceCommunityGlobalNavigation
  .comm-navigation__list
  .slds-list__item
  .comm-navigation__item
  a:focus,
header
  .forceCommunityGlobalNavigation
  .comm-navigation__list
  .slds-list__item
  .comm-navigation__item
  a:hover {
  /* Apply TailwindCSS utility classes */
  @apply font-sans font-normal text-base text-blue-800 normal-case px-4 py-2;
}
```

### Building an Optimized CSS File

The global CSS file in the static resource `sctw_GlobalCommunityStyles` comes in two versions:

- The file in the subdirectory `src` is the real source file to be modified as needed.
- The file in the subdirectory `bin` is the result of a build process and should not be modified manually.

During development it can be helpful to have all TailwindCSS classes available in the CSS file because it allows to try out different classes directly on the community pages using the browser's development tools without having to rebuild and deploy the CSS file over and over again. However, once the appropriate classes have been added to the templates an optimized version of the CSS file should be generated which does not include any unused classes.

First, as a one-time setup before running the build scripts make sure to install the Node.js dependencies.

```bash
npm install
```

For the purpose of development the global CSS file should be built using the NPM script `build:css:dev` which generates a rather huge CSS file with all utility classes included.

```bash
npm run build:css:dev
```

Once the appropriate TailwindCSS utility classes have been added to the theme layout and web components the optimized CSS file can be built using the NPM script `build:css:prod` which cleans up any unused classes.

```bash
npm run build:css:prod
```

The TailwindCSS config file in this project is set up to look for CSS class usage in the HTML and JavaScript files of Aura Components and Lightning Web Components. Please read the [official optimization documentation](https://tailwindcss.com/docs/controlling-file-size) for instructions how to write HTML and JavaScript code which can be cleaned up properly.

Note that the static resource must be deployed again after the CSS build has been completed.

### Customizing TailwindCSS

The config file `tailwind.config.js` in the project directory can be used to customize the TailwindCSS output as described in the [official configuration documentation](https://tailwindcss.com/docs/configuration).

## License

[MIT License](https://opensource.org/licenses/MIT)
