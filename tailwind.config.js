module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: {
    enabled: true,
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
