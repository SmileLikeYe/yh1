// Ionic Starter App
// App module
var yhapp = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $ionicLoading, $http, $ionicHistory, $ionicPopup) {
  AV.initialize('0lG3kPhexRj622hDQyFbXmb2', 'zadd60s9Cp0bo1DxjcfYUacj');
  $ionicPlatform.ready(function() {
    $ionicPlatform.registerBackButtonAction(function (e) {
      e.preventDefault();
      function showConfirm() {
        var confirmPopup = $ionicPopup.confirm({
          title: '<strong>退出应用?</strong>',
          template: '你确定要退出应用吗?',
          okText: '退出',
          cancelText: '取消'
        });
        confirmPopup.then(function (res) {
          if (res) {
            ionic.Platform.exitApp();
          }
          else {
            // Don't close
          }
        });
      }
      if (window.location.hash == '/homepage' ) {
        console.log(window.location.hash);
        showConfirm();
      } else if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        showConfirm();
      }
      return false;
    }, 101);
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
          controller: 'addressCtrl'
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
      url: '/photo/:selectTask',
      views: {
        'menuContent':{
          templateUrl: 'templates/picdetail.html',
          controller: 'picdetailCtrl',
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
          controller: 'feedbackCtrl'
        }
      }
    });

  // 默认页面
  $urlRouterProvider.otherwise('/app/homepage');
})


//全局变量
.value('loginData',{username:'未登录'});
