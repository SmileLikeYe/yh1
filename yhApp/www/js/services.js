angular.module('starter.services', [])
//////////////////////////////////////////////////////////////////////
//存放数据库类
  .provider("AVObjects", function () {
    this.$get = function ($q) {
      return {
        Task: AV.Object.extend("Task"),
        User: AV.Object.extend("_User"),

      };
    };
  })

//////////////////////////////////////////////////////////////////////
//用户数据管理
  .provider('userProvider', function () {
    var service = {};
    var username = window.localStorage['username'];
    var uoid = window.localStorage['uoid'];
    this.$get = function ($q, AVObjects) {
      service.getUser = function () {
        var query = new AV.Query(AVObjects.Task);
        query.find({
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (error) {
            deferred.reject("读取失败");
          }
        });
        var deferred = $q.defer();
        return deferred.promise;
      };
      //提供注册
      service.register = function (regData) {
        var deferred = $q.defer();
        AV.User.verifyMobilePhone(regData.vcode).then(function () {
          deferred.resolve(regData);
        }, function (err) {
          alert("验证码错误" + JSON.stringify(err));
          deferred.reject("验证码错误");
        });
        return deferred.promise;
      };
      //提供登录
      service.login = function (loginData) {
        var deferred = $q.defer();
        AV.User.logIn(loginData.username, loginData.password, {
          success: function (user) {
            window.localStorage['uoid'] = user.id;
            deferred.resolve(user);
          },
          error: function (user, error) {
            alert("Error: " + error.code + " " + error.message + "|" + JSON.stringify(user));
            deferred.reject("失败");
          }
        });
        return deferred.promise;
      };
      return service;
    };
  })

//////////////////////////////////////////////////////////////////////
  .factory("DateUtil", function () {
    return {
      getNowFormatDate: function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + date.getHours() + seperator2 + date.getMinutes()
          + seperator2 + date.getSeconds();
        return currentdate;
      }
    }
  })

//////////////////////////////////////////////////////////////////////
//任务数据管理
  .provider('questsFactory', function () {
//service存放factory数据
    var service = {};
    this.$get = function ($q, AVObjects) {
      service.getTask = function () {
        var deferred = $q.defer();
        var query = new AV.Query(AVObjects.Task);
        query.find({
          success: function (data) {
            var result = new Array();
            for (var i = 0; i < data.length; i++) {
              var t = data[i]['_serverData'];
              //t['endTime'] = t['endTime'].toString();
              result.push(t);
            }
            deferred.resolve(result);
          },
          error: function (error) {
            deferred.reject("读取失败");
          }
        });
        return deferred.promise;
      };
      service.getCurrentQuests = function () {
        var deferred = $q.defer();
        var query = new AV.Query(AVObjects.Task);
        var me = new AVObjects.User();
        me.id = window.localStorage['uoid'];
        query.equalTo("participant",me);
        query.find({
          success: function (data) {
            var result = new Array();
            for (var i = 0; i < data.length; i++) {
              var t = data[i]['_serverData'];
              result.push(t);
            }
            deferred.resolve(result);
          },
          error: function (error) {
            deferred.reject("读取失败");
          }
        });
        return deferred.promise;
      };
      service.getFinishedQuests = function () {
        var finishedQuests = [
          {
            name: "耐克拍照",
            endtime: "2014-12-30",
            info: "完成十张照片",
            totalCredit: 20,
            currentCredit: 17,
            done: 100 * 17 / 20,
            left: 100 - 100 * 17 / 20
          },
          {
            name: "耐克拍照",
            endtime: "2014-12-30",
            info: "完成十张照片",
            totalCredit: 20,
            currentCredit: 17,
            done: 100 * 17 / 20,
            left: 100 - 100 * 17 / 20
          },
        ];
        return finishedQuests;
      };

      return service;
    };
  })


//////////////////////////////////////////////////////////////////////
  .factory('Camera', ['$location', 'Pictures', 'DateUtil', function ($location, Pictures, DateUtil) {

    return {// 返回方法组的对象
      getPhoto: function () {
        alert("getPhoto()");
        // $scope.pics.unshift({ id:$scope.pics.length,title:"安踏拍照",description:"拍的好",date:getNowFormatDate(),img:"img/ionic.png" });
        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          cameraDirection: Camera.Direction.FRONT
        });

        function onSuccess(imageURI) {
          alert("getPhoto onSucess" + imageURI);
          Pictures.insert({
            id: Pictures.length,
            title: "安踏拍照",
            description: "拍的好",
            date: DateUtil.getNowFormatDate(),
            img: imageURI
          });
        }

        function onFail(message) {
          alert('getPhoto Failed because: ' + message);
        }
      },
      getLocation: function () {
        alert("getLocation()");
        navigator.geolocation.getCurrentPosition(onSuccess, onFail, {
          enableHighAccuracy: false,
          timeout: 60 * 1000,
          maximumAge: 1000 * 60 * 10
        });

        function onSuccess(position) {
          alert('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');
          // 百度地图API功能
          // var map = new BMap.Map("allmap");
          // // var point = new BMap.Point(116.331398,39.897445);
          // var point = new BMap.Point(position.coords.longitude, position.coords.latitude);
          // var gc = new BMap.Geocoder();
          // gc.getLocation(point, function(rs){
          //		var addComp = rs.addressComponents;
          //		alert(addComp.province + ", " + addComp.city +
          //			", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
          //		 AV.initialize('0lG3kPhexRj622hDQyFbXmb2', 'zadd60s9Cp0bo1DxjcfYUacj');
          // var PhotoLocation = AV.Object.extend('PhotoLocation');
          // var photoLocation = new PhotoLocation();
          // photoLocation.save({
          //	 longitude: position.coords.longitude,
          //	 latitude: position.coords.latitude,
          //	 location: (addComp.province + ", " + addComp.city +
          //			", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber)
          // }, {
          //	 success: function(object) {
          //		 alert('LeanCloud works!');
          //	 }
          // });
          // });


        }

        function onFail(message) {
          alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        }
      }// 方法是return的对象中的{， ， ，}

    }//return对象定义结束
  }])// function [] factory


  .factory("DateUtil", function () {
    return {
      getNowFormatDate: function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + date.getHours() + seperator2 + date.getMinutes()
          + seperator2 + date.getSeconds();
        return currentdate;
      }
    }
  })
/**
 * A simple example service that returns some data.
 */
  .factory('Pictures', function () {
    // Might use a resource here that returns a JSON array

    var pics = [
      {id: 0, title: "安踏拍照", description: "11111111111111111", date: "2015年10月20日", img: "img/ionic.png"},
      {id: 1, title: "安踏拍照", description: "11111111111111111", date: "2015年10月20日", img: "img/thumb.jpg"},
      {id: 2, title: "安踏拍照", description: "11111111111111111", date: "2015年10月20日", img: "img/ionic.png"},
    ];

    return {
      all: function () {
        return pics;
      },
      get: function (friendId) {
        // Simple index lookup
        return pics[friendId];
      },
      insert: function (pic) {
        pics.unshift(pic);
      },
      length: function () {
        return pics.length;
      }
    }
  });
