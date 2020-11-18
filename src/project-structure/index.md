---
sidebar: auto
---

# Project Structure

In order to showcase how TailwindCSS can be integrated with a Salesforce Lightning Community there are some configuration files and example components which have been added to a standard SFDX project.

## NPM Package Manifest

The NPM package manifest file `package.json` in the project root directory actually is already part of a typical SFDX project. Nevertheless, it is worth mentioning that the file has been extended with additional scripts and dependencies required for the TailwindCSS integration.

## PostCSS Configuration

The additional configuration file `postcss.config.js` in the project root directory contains settings for the PostCSS utility which is used before deployment to convert the source CSS files into optimized CSS files.

Read more about the [PostCSS build process](/concepts/#postcss-as-build-tool).

## TailwindCSS Configuration

The additional configuration file `tailwind.config.js` in the project root directory contains settings for TailwindCSS which allows customization of colors, fonts, breakpoints and much more.

Read more about the [TailwindCSS integration concept](/concepts/#tailwindcss-as-postcss-plugin).

## Static Resource for Global Styles

The static resource `sctw_GlobalCommunityStyles` is the home of global CSS files. It contains two subdirectories `src` and `bin` containing the source files and the optimized files.

Read more about the [reasons for two separate stylesheet directories](/concepts/#build-step-for-global-css-files).

## Aura Components

The Aura component `sctw_DefaultThemeLayout` provides a theme layout for Lightning Communities which is optimized for usage with TailwindCSS.

The Aura component `sctw_DefaultContentLayout` provides a lean content layout for community pages which does not contain anything else than a content region.

## Lightning Web Components

The Lightning Web Component `sctw_HeroTeaser` provides an example hero teaser with a big heading and call-to-action buttons. It is best used as the first section on a landing page.

The Lightning Web Component `sctw_IconsRow` provides an example icons row with up to three icons displayed next to each other. It can be used to present features and benefits of a product or service.

All these web components are configured to be exposed in Experience Builder. They can be dragged into community pages from the Components panel.
