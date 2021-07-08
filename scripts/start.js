const webpack = require('webpack');
const path = require('path');
const WebpackDevServer = require('webpack-dev-server');

const devConfig = require('../config/webpack.js');
// eslint-disable-next-line import/no-dynamic-require
const owningPackage = require(useUsersFile('package.json'));

function useUsersFile(file) {
  return path.resolve(process.cwd(), file);
}

const start = args => {
  const PORT = 8080;
  const HOST = 'localhost';
  const SIGNALS = ['SIGINT', 'SIGTERM'];
  const webpackConfig = devConfig;
  const compiler = webpack(webpackConfig);

  const webpackDevServerOptions = webpackConfig.devServer || {};
  const options = {
    contentBase: './dist',
    hot: true,
    host: HOST,
    // WebpackDevServer does not auto merge config.devServer with this options
    // so spread them out here
    ...webpackDevServerOptions
  };

  if (owningPackage.proxy) {
    options.proxy = owningPackage.proxy;
  }

  const devServer = new WebpackDevServer(compiler, options);

  return new Promise((resolve, reject) => {
    SIGNALS.forEach(sig => {
      process.on(sig, () => {
        devServer.close();
        process.exit();
      });
    });

    return devServer.listen(PORT, HOST, err => {
      if (err) return reject(err);
      return resolve(`Listening on ${HOST}:${PORT}`);
    });
  });
};

module.exports = async args => {
  const msg = await start(args);
  console.log(msg);
};
