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
    extend: {}
  },
  variants: {},
  plugins: []
};
