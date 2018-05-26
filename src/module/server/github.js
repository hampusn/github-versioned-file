/**
 * Contains github api methods.
 */
define(function (require) {
  'use strict';

  var _             = require('underscore');
  var jsonRequester = require('JsonRequester');
  var appData       = require('appData');
  var apiBase       = 'https://api.github.com';

  var username = appData.get('username') || '';
  var token    = appData.get('token') || '';

  var defaults = {
    username: username,
    password: token,
    preemptiveAuthentication: (username && token)
  };

  function injectArgs (str, args) {
    for (var k in args) {
      if (args.hasOwnProperty(k)) {
        str = str.replace(':' + k, args[k]);
      }
    }
    return str;
  }

  function createEndpoint (endpoint, method) {
    return function (args, opts) {
      opts = _.extend({}, defaults, opts);
      return jsonRequester[method](apiBase + injectArgs(endpoint, args), opts);
    };
  }

  return {
    "getTags":     createEndpoint('/repos/:owner/:repo/tags', 'get'),
    "getContents": createEndpoint('/repos/:owner/:repo/contents/:path?ref=:ref', 'get')
  };
});
