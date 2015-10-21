// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.questpage', {
    url: '/quest',
    views: {
      'menuContent': {
        templateUrl: 'templates/questpage.html',
          controller: ''//TODO:Write controllers
      }
    }
  })

  .state('app.picmanage', {
      url: '/picmanage',
      views: {
        'menuContent': {
          templateUrl: 'templates/picmanagepage.html',
          controller: 'piclistCtrl'//TODO:Write controllers
        }
      }
    })
    .state('app.homepage', {
      url: '/homepage',
      views: {
        'menuContent': {
          templateUrl: 'templates/homepage.html',
          controller: 'HomePageCtrl'
        }
      }
    })
    .state('app.address', {
      url: '/address',
      views: {
        'menuContent': {
          templateUrl: 'templates/addresspage.html',
          controller: ''//TODO:Write controllers
        }
      }
    })
    .state('app.picinfo', {
      url: '/picinfo',
      views: {
        'menuContent': {
          templateUrl: 'templates/picinfo.html',
          controller: 'picinfoCtrl'
        }
      }
    })
  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })

  .state('app.credit', {
    url: '/creditpage',
    views: {
      'menuContent': {
        templateUrl: 'templates/creditpage.html',
        controller: ''
      }
    }
  })

  .state('app.photodetail',{
      url: '/photo',
      views: {
        'menuContent':{
          templateUrl: 'templates/picdetail.html',
          controller: 'piclistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/homepage');
});
