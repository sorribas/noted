var Backbone = require('backbone');
Backbone.$ = jQuery;

var LoadingView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },

  render : function() {
    this.$el.html('<img src="/public/img/load.gif" />');
  }
});

module.exports = LoadingView;
