module.exports = {
  base: '/salesforce-community-tailwindcss/',
  dest: 'docs',
  title: 'Salesforce Community TailwindCSS Example',
  description:
    'Example SFDX project for using TailwindCSS in a Salesforce Lightning Community',
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }
    ]
  ],
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Project Structure',
        link: '/project-structure/'
      },
      {
        text: 'Concepts',
        link: '/concepts/'
      },
      {
        text: 'GitHub',
        link:
          'https://github.com/georgwittberger/salesforce-community-tailwindcss'
      }
    ]
  },
  plugins: ['@vuepress/plugin-back-to-top']
};
