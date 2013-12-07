define([],
  function(){
    var viewModel = kendo.observable({
      createCard: createCard,
      name: ko.observable(),
      text: ko.observable(),
      onSelect: function(e) {
        var message = $.map(e.files, function(file) { return file.name; }).join(", ");
        kendoConsole.log("event :: select (" + message + ")");
      }
    });

    return viewModel;

    function createCard(){

    }

  });