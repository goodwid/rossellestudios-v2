import angular from 'angular';
import camelcase from 'camelcase';
import path from 'path';

const reqContext = require.context(
	'./', //this directory
	true, //include subdirectories
	/^\.\/(?!index).+?\.js$/ //regex match any .js except this one
);

const services = angular.module('services', []);

reqContext.keys().forEach(key => {
  const name = camelcase(path.basename(key, '.js'));
  services.factory(name,reqContext(key).default );
});

export default services.name;
