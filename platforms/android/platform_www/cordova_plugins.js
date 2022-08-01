cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-firebase-analytics.FirebaseAnalytics",
      "file": "plugins/cordova-plugin-firebase-analytics/www/FirebaseAnalytics.js",
      "pluginId": "cordova-plugin-firebase-analytics",
      "merges": [
        "cordova.plugins.firebase.analytics"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-support-android-plugin": "1.0.2",
    "cordova-plugin-firebase-analytics": "6.0.1",
    "cordova-plugin-firebase-inappmessaging": "5.0.0"
  };
});