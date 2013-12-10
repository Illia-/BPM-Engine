define(['plugins/router', 'services/appSecurity', 'viewmodels/login', 'services/bpmEngine'],
  function(router, appSecurity, login, engine) {

    var viewModel = {
      isVisible       : true,
      router          : router,
      activate        : activate,
      appSecurity     : appSecurity,
      wrongPermissions: ko.observable(false),
      login           : login
    };

    viewModel.accessRoutes = ko.computed(function() {
      return ko.utils.arrayFilter(router.navigationModel(), function(route) {
        return appSecurity.isUserInRole(route.authorize);
      });
    });

    return viewModel;

    function activate() {
      //configure routing
      router.makeRelative({ moduleId: '' });

      //orchestrate
      var interval = setInterval(function(){
          if(appSecurity.user().name){
            engine.orchestrate();
          }
      }, 30000);


      // If the route has the authorize flag and the user is not logged in => navigate to login view
      router.guardRoute = function(instance, instruction) {
        if(instruction.config.authorize) {
          if(!appSecurity.user().name) {
            return "#login";
          }
          if(!appSecurity.isUserInRole(instruction.config.authorize)) {

            return "#login?redirectto=" + instruction.fragment;
          }
          return true
        }

        return true;
      }
      router.map([
          // for all
          { route: '', moduleId: 'viewmodels/aboutProject', title: 'BPM engine', nav: false},
          { route: 'login', moduleId: 'viewmodels/login', title: 'Login', nav: false},
          //for user
          { route: 'user/info', moduleId: 'viewmodels/user/info', title: 'Главная', nav: 1, authorize: ["user"]},
          { route: 'user/createCard', moduleId: 'viewmodels/user/createCard', title: 'Запуск сценария', nav: 2, authorize: ["user"]},
          { route: 'user/waitingTasks', moduleId: 'viewmodels/user/waitingTasks', title: 'Входящие задания', nav: 3, authorize: ["user"]},
          { route: 'user/myWorkflows', moduleId: 'viewmodels/user/myWorkflows', title: 'Мои сценарии', nav: 4, authorize: ["user"]},
          //for admin
          { route: 'templatesList', moduleId: 'viewmodels/admin/templatesList', title: 'Список шаблонов', nav: 2, authorize: ["admin", "_admin"]},
          { route: 'editor/:id', moduleId: 'viewmodels/admin/editor', title: 'Редактор шаблонов', nav: false, authorize: ["admin", "_admin"]},
          //development
          { route: 'development', moduleId: 'viewmodels/development', title: 'Development', nav: 10, authorize: ["user", "admin"]}
        ])
        .buildNavigationModel()
        .mapUnknownRoutes("viewmodels/notFound", "not-found");

      //dynamically generating our navigation structure based on the router's navigationModel array
      return router.activate();
    }

  });
