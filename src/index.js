(function() {
  'use strict';

  var router         = require('router');
  var appData        = require('appData');
  var github         = require('/module/server/github');
  var logUtil        = require('LogUtil');
  var endecUtil      = require('EndecUtil');

  var owner           = appData.get('owner');
  var repo            = appData.get('repo');
  var path            = appData.get('path');
  var parseAsMarkdown = appData.get('parseAsMarkdown');

  router.get('/', function(req, res) {
    var tags    = [];
    var ref     = req.params.ref;
    var content = '';

    github.getTags({'owner': owner, 'repo': repo}).done(function (result, statusCode) {
      tags = result.map(function (t) {
        return t.name;
      });

      logUtil.debug(JSON.stringify(tags));
    }).fail(function (message, status) {
      logUtil.warn(message);
    });

    // Default to first found tag (which should be the latest).
    ref = ref || tags[0];

    github.getContents({'owner': owner, 'repo': repo, 'path': path, 'ref': ref}).done(function (result, statusCode) {
      if (result.type === 'file') {
        content = result.encoding === 'base64' ? endecUtil.base64decode(result.content) : result.content;
      }

      logUtil.debug(JSON.stringify(result));      
    }).fail(function (message, status) {
      logUtil.warn(message);
    });

    res.render('/', {
      tags: tags,
      ref: ref,
      content: content,
      parseAsMarkdown: parseAsMarkdown
    });
  });
}());
