var fs = require('fs');
var Backbone = require('backbone');
var handlebars = require('handlebars');
var main = require('../main');
var notebooks = require('../data/notebooks');
Backbone.$ = jQuery;

var NotebooksFormView = Backbone.View.extend({
  el: '#modal',
  events: {
    'click #save-notebook-button': 'clickAddButton',
    'close': 'close'
  },

  close: function() {
    window.history.back();
  },

  clickAddButton: function() {
    var self = this;
    notebooks.create({name: this.$el.find('input').val()}, function() {
      self.$el.foundation('reveal', 'close');
      main.app.navigate('', {trigger: true});
    });
  },

  initialize: function() {
    this.template = handlebars.compile(fs.readFileSync(__dirname + '/templates/notebooks-form.hbs', 'utf8'));
  },
  render: function() {
    this.$el.html(this.template());
    this.$el.foundation('reveal', 'open');
  }
});

module.exports = NotebooksFormView;
