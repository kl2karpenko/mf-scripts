module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['>0.25%', 'not dead', 'not ie 11', 'not op_mini all']
        }
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [['@babel/plugin-transform-runtime'], ['@babel/plugin-proposal-class-properties']]
};
