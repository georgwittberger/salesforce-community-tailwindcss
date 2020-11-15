module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
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
