var handlebars = require('handlebars');
var fs = require('fs');
var Backbone = require('backbone');
var afterAll = require('after-all');
var main = require('../main');
var notes = require('../data/notes');
var notebooks = require('../data/notebooks');
var NoteView = require('./note');
Backbone.$ = jQuery;

var NoteList = Backbone.View.extend({

  el: '#main-content',

  events: {
    'click #add-note-link': 'add'
  },

  initialize: function() {
    this.template = handlebars.compile(fs.readFileSync(__dirname + '/templates/note-list.hbs', 'utf8'));
  },

  add: function() {
    var noteView = new NoteView({model: {title: '', content: '', notebook_id: this.notebookId}});
    this.$el.find('.note-list').prepend(noteView.$el);
    noteView.render();
  },

  render: function(notebookId) {
    this.notebookId = notebookId;
    var self = this;
    var notebookResp;
    var notesResp;

    var done = function() {
      self.$el.html(self.template());

      notesResp.forEach(function(note) {
        var noteView = new NoteView({model: note});
        self.$el.find('.note-list').append(noteView.$el);
        noteView.render();
      });

      self.$el.find('.notebook-title').html(notebookResp.name);
    };
    var next = afterAll(done);

    notebooks.view(notebookId, next(function(notebook) {
      notebookResp = notebook;
    }));

    notes.list(notebookId, next(function(notes) {
      notesResp = notes;
    }));
  }
});

module.exports = NoteList;
