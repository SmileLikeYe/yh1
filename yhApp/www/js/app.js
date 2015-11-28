// Ionic Starter App
// App module
var yhapp = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $ionicLoading, $http) {
  AV.initialize('0lG3kPhexRj622hDQyFbXmb2', 'zadd60s9Cp0bo1DxjcfYUacj');
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
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      //alert("navigator.geolocation works well");
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
      //cache:false, // change to true and it works again
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
        controller: 'creditCtrl'
      }
    }
  })

  .state('app.photodetail',{
      url: '/photo',
      views: {
        'menuContent':{
          templateUrl: 'templates/picdetail.html',
          controller: 'picdetailCtrl'
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

    })

  .state('app.userinfo',{
      url: '/userinfo',
      views: {
        'menuContent': {
          templateUrl: 'templates/userinfoPage.html',
          controller: 'userInfoCtrl'
        }
      }
    })

  .state('app.modifyinfo',{
      url: '/modifyinfo',
      views: {
        'menuContent': {
          templateUrl: 'templates/modifyInfo.html',
          controller: 'modInfoCtrl'
        }
      }
    })

  .state('app.modifypwd',{
      url: '/modifyPwd',
      views: {
        'menuContent': {
          templateUrl: 'templates/modifyPassword.html',
          controller: 'modPwdCtrl'
        }
      }
    })

    .state('app.takePhotoRule',{
      url: '/takePhotoRule',
      views: {
        'menuContent': {
          templateUrl: 'templates/takePhotoRule.html',
          controller: ''
        }
      }
    })

  .state('app.feedback',{
      url: '/feedback',
      views: {
        'menuContent': {
          templateUrl: 'templates/feedback.html',
          controller: ''
        }
      }
    });

  // 默认页面
  $urlRouterProvider.otherwise('/app/homepage');
})


//全局变量
.value('loginData',{username:'未登录'});
