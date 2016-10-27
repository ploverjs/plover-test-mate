'use strict';


const assert = require('assert');
const pathUtil = require('path');
const fs = require('fs');
const plover = require('plover');
const request = require('supertest');

const htmlEqual = require('./util').htmlEqual;

const AGENT = Symbol('agent');


class TestApp extends plover.Application {
  constructor(options) {
    options = options || {};
    const root = options.applicationRoot || __dirname;
    const settings = Object.assign({}, options);
    settings.applicationRoot = root;
    settings.configRoot = pathUtil.join(root, 'config');

    const configPath = pathUtil.join(root, 'config/app.js');
    if (fs.existsSync(configPath)) {
      Object.assign(settings, require(configPath));
    }

    super(settings);

    this.expectRoot = options.expectRoot;
  }


  use(plugin) {
    if (typeof plugin === 'string') {
      const info = require(pathUtil.join(plugin, 'package.json'));
      plugin = require(pathUtil.join(plugin, info.plover.plugin));
    }
    const type = typeof plugin;
    assert(type === 'function',
        `plugin should be typeof function, but now is: ${type}`);

    plugin(this);
  }


  get agent() {
    return this[AGENT] ||
      (this[AGENT] = request.agent(this.callback()));
  }


  get(url) {
    return this.agent.get(url);
  }


  fixture(name) {
    const path = pathUtil.join(this.expectRoot, name);
    return fs.readFileSync(path, 'utf-8');
  }


  test(url, fixture) {
    const html = this.fixture(fixture);
    return this.get(url)
      .expect(htmlEqual(html));
  }


  it(url, fixture) {
    it(`GET ${url} -> ${fixture}`, () => {
      return this.test(url, fixture);
    });
  }
}


module.exports = function(options) {
  return new TestApp(options);
};
