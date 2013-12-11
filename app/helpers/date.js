define(function() {
  return {
    formatDate: formatDate
  };

  function formatDate(date) {
    var newDate = new Date(date);
    return  newDate.getDate() + '.' + newDate.getMonth() + '.' + newDate.getFullYear() + ' ' + newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
  }
});
