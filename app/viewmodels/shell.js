define(['plugins/router', 'services/appSecurity', 'viewmodels/login', 'services/bpmEngine'],
  function(router, appSecurity, login, engine) {

    var viewModel = {
      isVisible       : true,
      router          : router,
      activate        : activate,
      appSecurity     : appSecurity,
      wrongPermissions: ko.observable(false),
      login           : login,
      orchestrate : function(){
       engine.orchestrate()
      }
    };

    return viewModel;

    function activate() {
      //configure routing
      router.makeRelative({ moduleId: '' });

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
          { route: 'user/createCard', moduleId: 'viewmodels/user/createCard', title: 'Создание карточки', nav: 2, authorize: ["user"]},
          { route: 'user/waitingTasks', moduleId: 'viewmodels/user/waitingTasks', title: 'Входящие задания', nav: 3, authorize: ["user"]},
          //for admin
          { route: 'admin/panel', moduleId: 'admin/panel', title: 'Work space', nav: false},

          { route: 'start', moduleId: 'viewmodels/start', title: 'testStart', nav: false}
        ])
        .buildNavigationModel()
        .mapUnknownRoutes("viewmodels/notFound", "not-found");

      //dynamically generating our navigation structure based on the router's navigationModel array
      return router.activate();
    }

  });
