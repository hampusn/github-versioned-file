define(function(require) {
  'use strict';

  var _         = require('underscore');
  var Component = require('Component');
  var template  = require('/template/main');

  return Component.extend({
    template: template,

    filterState: function(state) {
      return _.extend({}, {tags: state.tags, content: state.content, ref: state.ref});
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
