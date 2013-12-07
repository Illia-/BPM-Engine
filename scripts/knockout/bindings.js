ko.bindingHandlers.element = {
  init: function(element, valueAccessor) {
    var value = valueAccessor();
    value(element);
  }
};