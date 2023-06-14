module.exports = {
  // Other configuration options...
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  // other webpack configuration options...
  performance: {
    hints: false,
  },

};
