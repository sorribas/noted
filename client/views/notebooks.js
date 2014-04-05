var handlebars = require('handlebars');
var fs = require('fs');
var Backbone = require('backbone');
var main = require('../main');
var notebooks = require('../data/notebooks');
Backbone.$ = jQuery;

var NotebooksView = Backbone.View.extend({

  el: '#main-content',

  events: {
    'click #add-notebook-link': 'clickAddNotebook',
    'click .remove-notebook': 'removeNotebook',
    'click .notebook': 'clickNotebook'
  },

  removeNotebook: function(e) {
    e.stopImmediatePropagation();
    var $notebook = jQuery(e.target).parents('.notebook');
    notebooks.del($notebook.attr('notebook-id'), function() {
      $notebook.remove();
    });
  },

  clickNotebook: function(e) {
    var $notebook = jQuery(e.target).parents('.notebook');
    main.app.navigate('notebooks/' + $notebook.attr('notebook-id'), {trigger: true});
  },

  clickAddNotebook: function() {
    main.app.navigate('notebooks/new', {trigger: true});
  },

  initialize: function() {
    this.template = handlebars.compile(fs.readFileSync(__dirname + '/templates/notebooks.hbs', 'utf8'));
  },

  render: function() {
    var self = this;
    notebooks.list(function(res) {
      self.$el.html(self.template({notebooks: res}));
    });
  }
});

module.exports = NotebooksView;
