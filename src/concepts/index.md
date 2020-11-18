---
sidebar: auto
---

# Concepts

The example project implements quite some architectural concepts in order to integrate [TailwindCSS](https://tailwindcss.com/) into Salesforce Lightning Community pages. The following sections explain these concepts and why they are used in the project.

## CSS Utility Classes First

One important concept introduced by TailwindCSS is the preference of CSS utility classes over logically named CSS classes. Please read the official TailwindCSS documentation about the reasons why this [utility-first](https://tailwindcss.com/docs/utility-first) approach is justified.

## Global CSS Files in Static Resource

The project relies on global CSS files which are stored in a Salesforce static resource and loaded as global stylesheets on every community page. In fact, in the example project there is only one single CSS file which contains all necessary style definitions.

There are several reasons for this architectural decision.

- Global CSS files provide a single source of style definitions which are reusable in multiple components without duplication. Since TailwindCSS builds on utility classes it makes sense to encapsulate the definition of these classes in a central place.
- Changes of global styles like colors and fonts are automatically applied to all components only by deploying a newer version of the global CSS file. There is no need to change each and every single component.
- Overriding the styles of standard components like the global navigation bar, search input field and user profile menu is only possible using global CSS in the community pages.
- Usage of TailwindCSS [functions and directives](https://tailwindcss.com/docs/functions-and-directives) inside the CSS files requires a build step to transform the CSS code into something which can really be interpreted by a browser. This transformation takes some seconds and therefore should be limited to some few CSS files in the project.

## Build Step for Global CSS Files

The global CSS files inside the static resource are subdivided in two separate directories.

- The directory `src` contains the source files which are intended to be modified by developers as needed.
- The directory `bin` contains the transformed output of optimized files which are eventually loaded in the community pages.

There are multiple reasons for this separation.

- Processing the CSS files with TailwindCSS enables the externalization of design properties like colors, fonts, breakpoint sizes, etc. These properties can be changed without having to touch any CSS code.
- Source CSS files can leverage TailwindCSS functions and directives to apply the lower-level utility classes to higher-level style definitions. This is handy for overriding the styles of standard components.
- Transformation of the source CSS files allows for optimized production code. Unused utility classes are excluded from the optimized files and the CSS code is converted into a compact format. This results in smaller CSS files which are faster to load and process by the browser.

### PostCSS as Build Tool

The command line interface of [PostCSS](https://postcss.org/) is used as a build tool to convert the source CSS files from the `src` directory of the static resource into optimized CSS files stored in the `bin` directory.

For this purpose the respective PostCSS dependencies have been added to the project along with some NPM scripts and configuration.

```json
{
  "config": {
    "buildCssRoot": "./force-app/main/default/staticresources/sctw_GlobalCommunityStyles"
  },
  "scripts": {
    "build:css:dev": "cross-env NODE_ENV=development npm run build:css",
    "build:css:prod": "cross-env NODE_ENV=production npm run build:css",
    "build:css": "cross-env-shell \"postcss $npm_package_config_buildCssRoot/src/**/*.css --base $npm_package_config_buildCssRoot/src --dir $npm_package_config_buildCssRoot/bin\""
  },
  "devDependencies": {
    "cross-env": "^7.0.2",
    "postcss": "^8.1.6",
    "postcss-cli": "^8.2.0"
  }
}
```

The NPM scripts `build:css:dev` and `build:css:prod` are intended to be executed by developers depending on whether they want to produce CSS files for development or production use. The difference is explained in the following section.

The lower-level script `build:css` executes the PostCSS transformation. It converts all CSS files located in the `src` directory of the static resource (and all its subdirectories) and stores the output in the `bin` directory.

The base path of the static resource has been extracted to the NPM configuration property `buildCssRoot` to make it easier for other projects to adapt the concept without having to rewrite the script itself.

After the Node dependencies have been installed by running `npm install` the CSS transformation can be executed by running one of the following scripts.

```bash
$ npm run build:css:dev
# Generates the development version of the CSS files

$ npm run build:css:prod
# Generates the production version of the CSS files
```

### TailwindCSS as PostCSS Plugin

TailwindCSS is integrated as a PostCSS plugin following the official documentation for [using TailwindCSS with PostCSS](https://tailwindcss.com/docs/installation#using-tailwind-with-post-css).

With this approach the conversion of TailwindCSS specific code is performed as part of the PostCSS build step. It does not require any additional commands to be executed at build time.

First, it is necessary to install TailwindCSS as a Node dependency in the package as described in the official [installation guide](https://tailwindcss.com/docs/installation#install-tailwind-via-npm).

```json
{
  "dependencies": {
    "tailwindcss": "^1.9.6"
  }
}
```

Then the library can be configured as a plugin in the PostCSS configuration file `postcss.config.js` in the project root directory.

```javascript
module.exports = {
  plugins: [require('tailwindcss')]
};
```

Finally, the [basic TailwindCSS directives](https://tailwindcss.com/docs/installation#add-tailwind-to-your-css) must be included in one of the source CSS files in the static resource (e.g. `src/global.css`). This will populate the output CSS file with all the TailwindCSS utility classes.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Additionally, the TailwindCSS configuration file `tailwind.config.js` in the project root directory is set up to support CSS optimization for production builds. It specifically takes into account the HTML templates and JavaScript files of Aura components and Lightning Web Components.

```javascript
module.exports = {
  future: {},
  purge: {
    mode: 'layers',
    layers: ['base', 'components', 'utilities'],
    content: [
      '**/aura/**/*.cmp',
      '**/aura/**/*.js',
      '**/lwc/**/*.html',
      '**/lwc/**/*.js'
    ]
  },
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
};
```

With the above configuration the optimized CSS file will be processed by [PurgeCSS](https://purgecss.com/) when the environment variable `NODE_ENV` is set to `production`. This tool scans the files matching the patterns in the `content` array for occurrences of CSS class names from the CSS file being processed. If a class name is not found in any of the scanned files the CSS definition is excluded from the output. In this context it means that a utility class is removed from the CSS file when it is not used in any HTML template or JavaScript file of any Aura component or Lightning Web Component.

The reason for this additional optimization is that it generates significantly smaller CSS files for production use. This can improve user experience because the stylesheets are loaded and processed faster in the user's browser. Read more about [file size optimization](https://tailwindcss.com/docs/controlling-file-size) in the official documentation.

However, during development it is desirable to have a global CSS file with all TailwindCSS utility classes loaded in the community pages. This makes it easier to try out different classes directly in the browser's development tools. For this reason the PurgeCSS processing is skipped when `NODE_ENV` is not set to `production`, as it is when running the NPM script `build:css:dev`.

### CSSNano as PostCSS Plugin

Although the production build of PostCSS already produces an optimized CSS file by eliminating unused code there is the opportunity to reduce the file size further. The post-processor [CSSNano](https://cssnano.co/) is added as another PostCSS plugin to produce a compact CSS output.

This optimization requires an additional Node dependency to be installed in the package.

```json
{
  "devDependencies": {
    "cssnano": "^4.1.10"
  }
}
```

Then it can simply be added as another plugin to the PostCSS configuration file `postcss.config.js` in the project root directory.

```javascript
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('cssnano')({
      preset: 'default'
    })
  ]
};
```

## Integration of Global CSS into Community Pages

The global CSS files stored in the Salesforce static resource are loaded into the community pages using a [custom theme layout](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/components_config_for_builder_theme_layout.htm) component.

The reason for this architectural decision is to have the inclusion of the CSS file represented in the source code rather than relying on including the correct CSS file using HTML head markup in the community configuration. The only configuration required in the Lightning Community is to change the theme layout component.

In the example project the TailwindCSS theme layout component includes the optimized CSS file from the static resource using the `ltng:require` element in the component template.

```html{11-13}
<aura:component
  implements="forceCommunity:themeLayout"
  access="global"
  description="TailwindCSS Default Theme Layout"
>
  <aura:attribute name="search" type="Aura.Component[]" required="false" />
  <aura:attribute name="profileMenu" type="Aura.Component[]" required="false" />
  <aura:attribute name="navBar" type="Aura.Component[]" required="false" />
  <aura:attribute name="title" type="String" required="false" />

  <ltng:require
    styles="{!$Resource.sctw_GlobalCommunityStyles + '/bin/global.css'}"
  />

  ...
</aura:component>
```

As soon as this theme layout component is selected as "Default" theme layout in the community the CSS file is automatically loaded as global stylesheet on every page (except login pages).

### Using TailwindCSS Classes in Theme Layout

The theme layout component can use the TailwindCSS utility classes to create an outer layout if desired. In the example project the header is implemented this way.

```html{9}
<aura:component
  implements="forceCommunity:themeLayout"
  access="global"
  description="TailwindCSS Default Theme Layout"
>
  ...
  <div>
    <header
      class="flex flex-wrap md:flex-no-wrap container mx-auto mt-4 mb-12 px-4"
    >
      ...
    </header>
    <div>{!v.body}</div>
  </div>
</aura:component>
```

::: warning
TailwindCSS functions and directives **cannot** be used inside CSS files belonging to Aura Components because these files are not processed by PostCSS.
:::

### Using TailwindCSS Classes in Content Layout

The content layouts can use the TailwindCSS utility classes to create inner layouts as needed.

```html{12}
<aura:component
  implements="forceCommunity:layout"
  access="global"
  description="TailwindCSS Default Content Layout"
>
  <aura:attribute
    name="content"
    type="Aura.Component[]"
    required="false"
  ></aura:attribute>

  <div class="container mx-auto px-4">
    {!v.content}
  </div>
</aura:component>
```

::: warning
TailwindCSS functions and directives **cannot** be used inside CSS files belonging to Aura Components because these files are not processed by PostCSS.
:::

### Using TailwindCSS Classes in Lightning Web Components

Custom Lightning Web Components can use the TailwindCSS utility classes for their individual styling.

```html{2-3}
<template>
  <div class="container text-center mx-auto my-12 px-4">
    <h1 class="font-black text-5xl text-lwc-brand leading-none mt-0 mb-8">
      {title}
    </h1>
  </div>
</template>
```

::: warning
TailwindCSS functions and directives **cannot** be used inside CSS files belonging to Lightning Web Components because these files are not processed by PostCSS.
:::

## Overriding Styles of Standard Components

There are some standard Lightning components for communities like the global navigation bar, search input field and user profile menu which are built by Salesforce using the Lightning Design System. Customizing the visual design of these standard components works by overriding particular CSS selectors with more specific ones in the global CSS files.

Given the CSS file is processed by TailwindCSS the `@apply` directive can be used to include utility classes as mixins into the override selectors.

```css{13,29}
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
  button {
  @apply font-primary font-normal text-base text-lwc-nav-text px-4 py-4;
}

@screen md {
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
    button {
    @apply py-2;
  }
}
```

The example project includes an extended customization of the styles for the standard components. Check out the source CSS file `src/global.css` in the static resource.

However, this approach feels like a dirty hack because it relies on the HTML structure and CSS classes of the standard components.

## Configurable Colors and Fonts

The project provides a mechanism allowing the theme settings of Experience Builder like colors and fonts to be used as CSS utility classes.

The reason for this architectural decision is to give editors control over the colors and fonts used in community pages. It depends on the project whether this is desired or not.

The approach is to introduce custom colors and font definitions in the TailwindCSS configuration file `tailwind.config.js` in the project root directory. The definitions must refer to the CSS custom properties (aka [design tokens](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/tokens_standard_communities.htm)) which are set by the standard Lightning Community framework.

```javascript
module.exports = {
  future: {},
  purge: {},
  theme: {
    fontFamily: {
      primary: ['var(--lwc-fontFamily)', 'sans-serif'],
      header: ['var(--lwc-fontFamilyHeader)', 'sans-serif']
    },
    extend: {
      colors: {
        'lwc-text': 'var(--lwc-colorTextDefault)',
        'lwc-nav-text': 'var(--lwc-brandNavigationColorText)',
        'lwc-detail': 'var(--lwc-colorTextWeak)',
        'lwc-brand': 'var(--lwc-colorBrand)',
        'lwc-link': 'var(--lwc-colorTextLink)',
        'lwc-overlay': 'var(--lwc-colorTextInverse)',
        'lwc-border': 'var(--lwc-colorBorder)',
        'lwc-bg': 'var(--lwc-colorBackground)',
        'lwc-nav-bg': 'var(--lwc-brandNavigationBackgroundColor)'
      }
    }
  },
  variants: {},
  plugins: []
};
```

This configuration results in new groups of utility classes being available in the global CSS files.

The classes can be used directly in HTML code.

```html
<h1 class="font-header text-lwc-brand">
  Text with header font in brand color
</h1>
```

Or they can be applied to higher-level classes in the global CSS file.

```css
.navigation-item {
  @apply text-lwc-nav-text bg-lwc-nav-bg;
}
```
