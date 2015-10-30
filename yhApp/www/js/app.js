// Ionic Starter App
// App module
<<<<<<< HEAD
var yhapp = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','LocalStorageModule'])


.run(function($ionicPlatform,$ionicLoading) {

  // AV.initialize('kTlCF8Aiq0rADHoFB1knF7US', 'x4CsV8ctJ0TUaDB67uDHSofS');
=======
var yhapp = angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform,$ionicLoading) {
  AV.initialize('0lG3kPhexRj622hDQyFbXmb2', 'zadd60s9Cp0bo1DxjcfYUacj');
>>>>>>> origin/quest
  $ionicPlatform.ready(function() {
    // 移除键盘附加栏
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

.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('myApp')
    .setStorageType('localStorage')
    .setNotify(true, true);

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
          controller: 'questCtrl'
      }
    }
  })

  .state('app.picmanage', {
      url: '/picmanage',
      views: {
        'menuContent': {
          templateUrl: 'templates/picmanagepage.html',
          controller: 'piclistCtrl'
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
    })

  .state('app.purchase',{
      url: '/purchase',
      views: {
        'menuContent': {
          templateUrl: 'templates/purchase.html',
          controller: ''
        }
      }
    });

  // 默认页面
  $urlRouterProvider.otherwise('/app/homepage');
})




//全局变量
.value('loginData',{username:'未登录'});