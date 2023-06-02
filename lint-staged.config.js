module.exports = {
  '*.{js,ts,vue}': ['yarn lintfix:js', 'yarn lintfix:prettier'],
  '*.{css,scss,sass,html,vue}': 'yarn lintfix:style',
  '*.{js,ts}': () => 'yarn type-check:tsc',
  '*.vue': () => 'yarn type-check:vue-tsc',
}
