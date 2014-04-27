var handlebars = require('handlebars');
var fs = require('fs');
var Backbone = require('backbone');
var main = require('../main');
var notes = require('../data/notes');
Backbone.$ = jQuery;

var NoteView = Backbone.View.extend({

  events: {
    'click .remove-note': 'delete',
    'mouseover .whitebox': 'mouseover',
    'mouseleave .whitebox': 'mouseleave'
  },

  mouseover: function() {
    this.$el.find('.remove-note').show();
  },

  mouseleave: function() {
    this.$el.find('.remove-note').hide();
  },

  loading: function() {
    this.$el.find('.loader').show();
  },

  loaded: function() {
    var self = this;
    self.$el.find('.loader').hide();
    self.$el.find('.note-saved').show();
    setTimeout(function() {
      self.$el.find('.note-saved').hide();
    }, 1000);
  },

  save: function() {
    this.loading();
    this.model.title = this.$el.find('.note-title').val();
    this.model.content = this.$el.find('.note-content').val();

    var self = this;
    if (!this.model._id) return notes.create(this.model, function(note) {
      self.model._id = note._id;
      self.loaded();
    });
    notes.update(this.model, function() {
      self.loaded();
    });
  },

  delete: function() {
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
    var self = this;

    var typingHandler = {
      stop: function() {
        self.save()
      },
      delay: 500
    };
    this.$el.find('.note-title').typing(typingHandler);
    this.$el.find('.note-content').typing(typingHandler);
  }
});

module.exports = NoteView;
