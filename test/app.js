'use strict';


const pathUtil = require('path');

const plover = require('../lib/app');


describe('app', () => {
  const app = plover({
    applicationRoot: pathUtil.join(__dirname, 'fixtures/app'),
    expectRoot: pathUtil.join(__dirname, 'fixtures/expect')
  });

  app.use('plover-arttemplate');

  app.it('/', 'index.html');
});

