Package.describe({
  name: 'herteby:grapher-vue',
  version: '0.1.4',
  summary: 'Integrates Vue and Grapher in an easy-to-use way',
  git: 'https://github.com/Herteby/grapher-vue',
  documentation: 'README.md'
});

Package.onUse(function(api) {
	api.use('ecmascript@0.6.1');
	api.mainModule('grapher-vue.js');
});