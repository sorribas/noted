var Backbone = require('backbone');
var LoadingView = require('./views/loading');
var NotebooksView = require('./views/notebooks');
var NotebooksFormView = require('./views/notebooks-form');
var NoteList = require('./views/note-list');
Backbone.$ = jQuery;

var notebooksForm = new NotebooksFormView();
var notebooksView = new NotebooksView();
var noteList = new NoteList();

var App = Backbone.Router.extend({
  routes: {
    '': 'index',
    'notebooks/new': 'notebooksNew',
    'notebooks/:id': 'notebookDetail'
  },

  index: function() {
    notebooksView.render();
  },

  notebooksNew: function() {
    notebooksForm.render();
  },

  notebookDetail: function(id) {
    noteList.render(id);
  }
});

var app = exports.app = new App();
Backbone.history.start({pushState: true});

jQuery(function() {
  $('#app-name').click(function() {
    app.navigate('', {trigger: true});
  });
});
