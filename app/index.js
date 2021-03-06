/**
 * artoo.js Yeoman generator
 * ==========================
 *
 * A simple generator to scaffold artoo.js projects.
 */
var yeoman = require('yeoman-generator');

// Possible cases:
// 1) a dead simple bookmarklet with only one files.
// 2) a more complex bookmaklet with several files.
// 3) a ui bookmarklet.

// Extending base
module.exports = yeoman.generators.Base.extend({

  // Questions
  askFor: function() {
    var done = this.async();

    // Registering questions
    var prompts = [
      {
        name: 'bookmarkName',
        message: 'What will be the name of your bookmarklet?'
      },
      {
        name: 'bookmarkDescription',
        message: 'How would you describe your bookmarklet?',
        default: 'An artoo.js bookmarklet.'
      },
      {
        name: 'bookmarkType',
        message: 'What kind of bookmarklet do you need to build?',
        type: 'list',
        choices: [
          {
            name: 'A simple bookmarklet needing a single .js file',
            value: 'simple'
          },
          {
            name: 'A complex bookmarklet needing several files',
            value: 'complex'
          },
          {
            name: 'A bookmarklet injecting its custom UI',
            value: 'ui'
          }
        ]
      },
      {
        name: 'https',
        message: 'Will you need HTTPS support?',
        type: 'confirm',
        default: false
      }
    ];

    // Asking user
    this.prompt(prompts, function(answers) {
      var encode = function(str) {return str && str.replace(/\"/g, '\\"');};

      // Collecting answers
      this.bookmarkName = encode(answers.bookmarkName);
      this.bookmarkDescription = answers.bookmarkDescription;
      this.bookmarkType = answers.bookmarkType;
      this.https = answers.https;

      // Next
      done();
    }.bind(this));
  },

  // Scaffolding
  app: function() {

    // Common files
    this.template('README.md', 'README.md', this);
    this.template('package.json', 'package.json', this);
    this.copy('gitignore', '.gitignore');
    this.copy('npmignore', '.npmignore');

    // Specific files
    this.types[this.bookmarkType].call(this);
  },

  types: {
    simple: function() {

      // Lone file
      this.copy('index.js', this.bookmarkName + '.js');
      this.template('simple_gulpfile.js', 'gulpfile.js', this);
    },

    complex: function() {

      // Several files
      this.mkdir('src');
      this.copy('file1.js', 'src/first.js');
      this.copy('file2.js', 'src/second.js');
      this.template('complex_gulpfile.js', 'gulpfile.js', this);
    },

    ui: function() {

      // UI files
      this.mkdir('src');
      this.mkdir('templates');
      this.mkdir('stylesheets');
      this.copy('ui.js', 'src/ui.js');
      this.copy('bookmark.css', 'stylesheets/bookmark.css');
      this.copy('bookmark.tpl', 'templates/bookmark.tpl');
      this.template('ui_gulpfile.js', 'gulpfile.js', this);
    }
  },

  // Dependencies
  install: function() {

    // On end
    this.on('end', function() {
      if (!this.options['skip-install'])
        this.installDependencies({
          bower: false,
          skipMessage: this.options['skip-install-message'],
          skipInstall: this.options['skip-install']
        });
    });
  }
});
