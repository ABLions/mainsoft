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
};
