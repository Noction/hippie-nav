module.exports = {
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html'
    },
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss'
    }
  ],
  extends: [
    'stylelint-config-standard-scss', // configure for SCSS
    'stylelint-config-recommended-vue', // add overrides for .Vue files
    'stylelint-config-recess-order', // use the recess order for properties
    'stylelint-config-css-modules', // configure for CSS Modules methodology
  ],
  plugins: ['stylelint-scss'],
  rules: {
    'no-empty-source': null,
    'block-no-empty': null,
    'unit-allowed-list': ['px', 'em', 'rem', 's', '%', 'vh', 'vw', 'fr', 'deg', 'cm'],
    'comment-no-empty': true,
    'no-descending-specificity': null,
    'font-weight-notation': 'numeric',
    'comment-empty-line-before': null,
    'comment-whitespace-inside': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'declaration-no-important': true,
    'declaration-block-single-line-max-declarations': 1,
    'selector-pseudo-element-no-unknown': true
  }
}
