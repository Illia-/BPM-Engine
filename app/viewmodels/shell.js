define(['plugins/router'], function(router){

	var viewModel = kendo.observable({
		isVisible: true,
		onSelect: function(e) {
			var text = $(e.item).children(".k-link").text();
			kendoConsole.log("event :: select(" + text + ")");
		},
		router: router,
		activate: activate
	});

	return viewModel;

	function activate(){

		// If the route has the authorize flag and the user is not logged in => navigate to login view
		router.guardRoute = function (instance, instruction) {
			if (instruction.config.authorize) {
				if (appsecurity.user().IsAuthenticated && appsecurity.isUserInRole(instruction.config.authorize)) {
					return true
				} else {
					return "/account/login?redirectto=" + instruction.fragment;
				}
			}
			return true;
		}
		router.map([
			{ route: 'login',        moduleId: 'viewmodels/login',  title: 'Login',       nav: 1 },
			//for user
			{ route: 'admin/panel',  moduleId: 'admin/panel',       title: 'Work space',  nav: false,  authorize: ["user"] }
		]).buildNavigationModel();

		//dynamically generating our navigation structure based on the router's navigationModel array
		return router.activate();
	}


});
