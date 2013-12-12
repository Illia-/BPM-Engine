define(function() {
  return {
    formatDate: formatDate,
    formatTime: formatTime,
    formatDateTime: formatDateTime
  };

  function formatDate(date) {
    var newDate = new Date(date);
    return  newDate.getDate() + '.' + newDate.getMonth() + '.' + newDate.getFullYear();
  }

  function formatTime(date) {
    var newDate = new Date(date);
    return  newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
  }

  function formatDateTime(date) {
    var newDate = new Date(date);
    return  newDate.getDate() + '.' + newDate.getMonth() + '.' + newDate.getFullYear() + ' ' + newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
  }
});
