(function() {
  'use strict';

  const router         = require('router');
  const appData        = require('appData');
  const logUtil        = require('LogUtil');
  const endecUtil      = require('EndecUtil');
  const github         = require('/module/server/github');
  const MarkdownIt     = require('/module/server/markdown-it');

  const owner           = appData.get('owner');
  const repo            = appData.get('repo');
  const path            = appData.get('path');
  const parseAsMarkdown = appData.get('parseAsMarkdown');

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

    if (parseAsMarkdown) {
      const md = new MarkdownIt();
      content = md.render(content);
    }

    res.render('/', {
      tags: tags,
      ref: ref,
      content: content
    });
  });
}());
