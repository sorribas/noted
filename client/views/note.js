var handlebars = require('handlebars');
var fs = require('fs');
var Backbone = require('backbone');
var main = require('../main');
var notes = require('../data/notes');
Backbone.$ = jQuery;

var NoteView = Backbone.View.extend({

  events: {
    'focus .note-title': 'focus',
    'blur .note-title': 'blur',
    'focus .note-content': 'focus',
    'blur .note-content': 'blur',
    'click .save-btn': 'save',
    'click .del-btn': 'delete'
  },

  focus: function() {
    this.focused = true;
    this.$el.find('.btns').show();
  },

  blur: function() {
    this.focused = false;
    var self = this;
    setTimeout(function() {
      if (!self.focused) self.$el.find('.btns').hide();
    }, 100);
  },

  save: function() {
    console.log('1');
    this.focused = true;
    this.$el.find('.save-btn').show();
    var self = this;

    this.model.title = this.$el.find('.note-title').val();
    this.model.content = this.$el.find('.note-content').val();

    if (!this.model._id) return notes.create(this.model, function() {
      self.blur();
    });
    notes.update(this.model, function() {
      self.blur();
    });
  },

  delete: function() {
    console.log('2');
    if (this.model._id) {
      notes.del(this.model, function() {
      });
    }

    this.$el.remove();
  },

  initialize: function() {
    this.template = handlebars.compile(fs.readFileSync(__dirname + '/templates/note.hbs', 'utf8'));
  },

  render: function() {
    this.$el.html(this.template(this.model));
    this.$el.find('textarea.note-content').autosize();
  }
});

module.exports = NoteView;
