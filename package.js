Package.describe({
  name: 'herteby:grapher-vue',
  version: '1.2.1',
  summary: 'Integrates Vue and Grapher in an easy-to-use way',
  git: 'https://github.com/Herteby/grapher-vue',
  documentation: 'README.md'
});

Package.onUse(function(api) {
	api.use([
		'ecmascript@0.8.1',
		'cultofcoders:grapher@1.2.8_1'
	]);
	api.mainModule('grapher-vue.js');
});

Npm.depends({
	"vue-meteor-tracker": "1.2.3",
	"lodash": "4.17.4",
})
