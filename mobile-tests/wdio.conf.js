require('dotenv').config();

exports.config = {
  runner: 'local',

  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  specs: ['./test/**/*.js'],

  maxInstances: 1,
  logLevel: 'info',
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  framework: 'mocha',
  reporters: ['spec'],

  services: [
    ['browserstack', {
      app: process.env.BROWSERSTACK_APP_ID
    }]
  ],

  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'bstack:options': {
      deviceName: 'Samsung Galaxy S22',
      platformVersion: '12.0',
      projectName: 'mobile-tests',
      buildName: 'android build',
      sessionName: 'login test'
    }
  }],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  }
};
