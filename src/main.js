define(function(require) {
  'use strict';

  var _         = require('underscore');
  var Component = require('Component');
  var template  = require('/template/main');

  return Component.extend({
    template: template,

    onRendered: function() {
      if (this.state.parseAsMarkdown === true) {
        var contentHolder = this.$('.github-versioned-file__content-holder');
        var md            = markdownit();
        var result        = md.render(contentHolder.text());
        
        contentHolder.html(result);
      }      
    },

    filterState: function(state) {
      return _.extend({}, {tags: state.tags, content: state.content, ref: state.ref, parseAsMarkdown: state.parseAsMarkdown});
    },
    templateFunctions: function () {
      return {
        selected: function (tag, ref) {
          return tag === ref ? ' selected="selected" ' : '';
        }
      };
    }
   });
});
