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
    'close': 'close',
    'keyup input[name="name"]': 'keyup'
  },

  keyup: function(e) {
    if(e.keyCode == 13) {
      this.clickAddButton();
    }
  },

  close: function() {
    window.history.back();
  },

  clickAddButton: function() {
    var self = this;
    notebooks.create({name: this.$el.find('input').val()}, function() {
      self.$el.foundation('reveal', 'close');
      setTimeout(function() {
        main.app.navigate('', {trigger: true});
      }, 0);
    });
  },

  initialize: function() {
    this.template = handlebars.compile(fs.readFileSync(__dirname + '/templates/notebooks-form.hbs', 'utf8'));
  },
  render: function() {
    this.$el.html(this.template());
    this.$el.foundation('reveal', 'open');
    var self = this;
    setTimeout(function() {
      self.$el.find('input').focus();
    }, 200);
  }
});

module.exports = NotebooksFormView;
