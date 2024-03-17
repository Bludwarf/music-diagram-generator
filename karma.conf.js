// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    browsers: ['Chrome'],
    files: [
      {pattern: 'src/assets/als/*.als', included: false, watched: false, served: true},
      {pattern: 'src/assets/als/*.als.xml', included: false, watched: false, served: true},
    ],
  });
};
