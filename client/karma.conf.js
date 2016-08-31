const webpackConfig = require( './webpack.config' );

webpackConfig.entry = {};

const testEntry = './src/photoAlbum.js';

module.exports = function(config) {
	// Define the configuration first, because we need to mod it if we're testing in Travis
  let configuration = {
    basePath: '',
    frameworks: [ 'mocha', 'chai' ],
    files: [
      testEntry,
      './node_modules/angular-mocks/angular-mocks.js',
      './test/**/*.js'
    ],
    webpack: webpackConfig,
    exclude: [],
    preprocessors: {
      [testEntry]: [ 'webpack' ],
      './test/**/*.js': [ 'babel' ]
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'Firefox'],
    singleRun: false,
    concurrency: Infinity,


  };

	// Configuration changes on Travis CI
  if (process.env.TRAVIS) {
		configuration.customLaunchers = {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		};
    configuration.browsers = ['Chrome_travis_ci', 'Firefox'];
    configuration.singleRun = true;
  }

	//
  config.set(configuration);
};
