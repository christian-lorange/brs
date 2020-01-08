document.addEventListener('deviceready', function () {
  // Enable to debug issues.
  // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal
    .startInit("6c2ec23d-7273-4da4-b347-6cfa5acd4f9a")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();
}, false);