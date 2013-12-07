requirejs.config({
  paths  : {
    'text'       : '../scripts/require/text',
    'durandal'   : '../scripts/durandal',
    'plugins'    : '../scripts/durandal/plugins',
    'transitions': '../scripts/durandal/transitions'
  },
  urlArgs: 'v=' + Math.random() //prevent cache
});

define('jquery', function() {
  return jQuery;
});

define('knockout', function() {
  return ko;
});

define('Couch', function() {
  return Couch;
});

define(['durandal/app', 'durandal/system', 'durandal/viewLocator', 'durandal/binder', 'couchDB', 'services/appSecurity'],
  function(app, system, viewLocator, binder, db, appSecurity) {
    //enable debug
    system.debug(true);

    //The title of our application.
    app.title = 'BPM Engine';

    //Configures one or more plugins to be loaded and installed into the application.
    app.configurePlugins({
      router: true

    });
    //plug Q's promise mechanism into Durandal

    system.defer = function(action) {
      var deferred = Q.defer();
      action.call(deferred, deferred);
      var promise = deferred.promise;
      deferred.promise = function() {
        return promise;
      };
      return deferred;
    };

    //The promise resolves when the DOM is ready and the framework is prepared for configuration
    app.start().then(function() {
      //initialize couchDb connection with session permission
      db.initialize().then(function() {
        appSecurity.isAuthenticated().then(function(sessionData) {
          appSecurity.user(sessionData.userCtx);

          /**
           * set up our viewLocator with basic conventions
           *
           * modulesPath : (String optional)
           *               A string to match in the path and replace with the viewsPath.
           *               If not specified, the match is 'viewmodels'.
           * viewsPath : (String optional)
           *             The replacement for the modulesPath. If not specified, the replacement is 'views'.
           * areasPath : (String optional)
           *              Partial views are mapped to the "views" folder if not specified. Use this parameter to change their location.
           */
          viewLocator.useConvention();

          //Doing this will allow Knockout to distinguish its bindings as data-bind and KendoUI to distinguish its bindings as data-kendo-bind.
          kendo.ns = "kendo-";
          //This bit of code automatically applies KendoUI bindings any time Durandal's binder is called
          binder.binding = function(obj, view) {
            kendo.bind(view, obj.viewModel || obj);
          };
          //Finally, can use 'data-bind' for normal bindings in your views and 'data-kendo-bind' for KendoUI controls

          /**
           * Sets the root module/view for the application.
           * This is what actually causes the DOM to be composed with our application
           *
           * root : String
           *    The root view or module.
           * transition : String optional
           *    The transition to use from the previous root (or splash screen) into the new root.
           * applicationHost : String optional
           *    The application host element or id. By default the id 'applicationHost' will be used.
           */
          app.setRoot('viewmodels/shell', 'entrance');
        });
      });
    });

  });