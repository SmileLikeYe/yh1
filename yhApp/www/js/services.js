angular.module('starter.services', [])
//////////////////////////////////////////////////////////////////////
//存放数据库类
  .provider("AVObjects", function () {
    this.$get = function ($q) {
      return {
        Task: AV.Object.extend("Task"),
        User: AV.Object.extend("_User"),
        Photo: AV.Object.extend("Photo"),
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

      //提供注册
      service.register = function (regData) {
        var deferred = $q.defer();
        AV.User.verifyMobilePhone(regData.vcode).then(function () {
          deferred.resolve("注册成功");
          alert('注册成功！');
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
            deferred.resolve(user._serverData);
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
      },
      getFormatDate: function (date) {
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var strSec = date.getSeconds();
        var strMin = date.getMinutes();
        var strHour = date.getHours();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        if (strHour >= 0 && strHour <= 9) {
          strHour = "0" + strHour;
        }
        if (strMin >= 0 && strMin <= 9) {
          strMin = "0" + strMin;
        }
        if (strSec >= 0 && strSec <= 9) {
          strSec = "0" + strSec;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + strHour + seperator2 + strMin
          + seperator2 + strSec;
        return currentdate;
      }
    }
  })

//////////////////////////////////////////////////////////////////////
//任务数据管理
  .provider('questsFactory', function () {
//service存放factory数据
    var service = {};
    this.$get = function ($q, AVObjects, DateUtil) {
      service.getQuests = function () {
        var deferred = $q.defer();
        var query = new AV.Query(AVObjects.Task);
        var me = new AVObjects.User();
        me.id = window.localStorage['uoid'];
        query.equalTo("participant", me);
        query.find({
          success: function (data) {
            var result = new Array();
            for (var i = 0; i < data.length; i++) {
              var t = data[i]['_serverData'];
              t.id = data[i].id;
              console.log("a quest");
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
      service.getNewQuest = function () {
        var deferred = $q.defer();
        var query = new AV.Query(AVObjects.Task);
        var now = DateUtil.getNowFormatDate();
        var me = new AVObjects.User();
        me.id = window.localStorage['uoid'];
        query.notEqualTo("participant", me);
        query.find({
          success: function (data) {
            for (var i = 0; i < data.length; i++) {
              var t = data[i]['_serverData'];
              t.id = data[i].id;
              var participants = t['participant'];
              var limit = DateUtil.getFormatDate(eval(t['endTime']));
              if(limit>now){
                deferred.resolve(t);
                return;
              }
            }
          },
          error: function (error) {
            console.log("error"+JSON.stringify(error));
            deferred.reject("读取失败");
          }
        });
        return deferred.promise;
      };
      service.getCurrentCreditOfQuest = function (qid) {
        var deferred = $q.defer();
        var query = new AV.Query(AVObjects.Photo);
        var quest = new AVObjects.Task();
        quest.id = qid;
        var me = new AVObjects.User();
        me.id = window.localStorage['uoid'];
        query.equalTo("uploader", me);
        query.equalTo("task", quest);
        query.find({
          success: function (data) {
            var credit = 0;
            for (var i = 0; i < data.length; i++) {
              var t = data[i]['_serverData'];
              credit += t.credit;
            }
            deferred.resolve(credit);
          },
          error: function (error) {
            deferred.reject("读取失败");
          }
        });
        return deferred.promise;
      };
      return service;
    };
  })


//////////////////////////////////////////////////////////////////////
  .factory('Camera', ['$location', 'DateUtil', '$q', function ($location, DateUtil, $q) {

    return {// 返回方法组的对象
      getPhoto: function () {
        var deferred = $q.defer();
        alert("getPhoto()");
        // $scope.pics.unshift({ id:$scope.pics.length,title:"安踏拍照",description:"拍的好",date:getNowFormatDate(),img:"img/ionic.png" });
        navigator.camera.getPicture(onSuccess, onFail, {
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY
          // quality: 50,
          // destinationType: Camera.DestinationType.NATIVE_URI,
          // allowEdit: false,
          // encodingType: Camera.EncodingType.PNG,
          // cameraDirection: Camera.Direction.FRONT
        });
        function onSuccess(imageURI) {
          alert("getPhoto onSucess" + imageURI);
          deferred.resolve(imageURI);
        }
        function onFail(message) {
          alert('getPhoto Failed because: ' + message);
            deferred.reject("拍照失败");
        }
         return deferred.promise;
      },

      getLocation: function () {
        var deferred = $q.defer();
        alert("getLocation()");
        navigator.geolocation.getCurrentPosition(onSuccess, onFail, {
          enableHighAccuracy: false,
          timeout: 60 * 1000,
          maximumAge: 1000 * 60 * 10
        });
        function onSuccess(position) {
          var result = {};
          alert('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');
          result.latitude = position.coords.latitude;
          result.longitude =  position.coords.longitude;
          deferred.resolve(result);
        }
        function onFail(message) {
          alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
          deferred.reject("getLocation() fail!");
        }
        return deferred.promise;
      },// 方法是return的对象中的{， ， ，}

      getLocationDescription: function (latitude, longitude) {
        var deferred = $q.defer();
        //百度地图API功能s
        var map = new BMap.Map("allmap");
        // var point = new BMap.Point(116.331398,39.897445);
        var point = new BMap.Point(longitude, latitude);
        var gc = new BMap.Geocoder();
        gc.getLocation(point, function(rs){
          var addComp = rs.addressComponents;
          var location = addComp.province + ", " + addComp.city +
            ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
          alert(location);
          deferred.resolve(location);
        });
        return deferred.promise;
      }

    }//return对象定义结束
  }])// function [] factory


//////////////////////////////////////////////////////////////////////
//用户数据管理
  .provider('photoProvider', function () {
    var service = {};
    var username = window.localStorage['username'];
    var uoid = window.localStorage['uoid'];
    this.$get = function ($q, AVObjects, Camera) {

      //提供注册
      service.savePhoto = function (regData) {


      };
      service.uploadPhoto = function(tasks) {
        //上传需要的字段
        var credit;
        var imgFile;
        var latitude;
        var longitude;
        var location;
        var status;
        var task;
        var uploader;

        //赋值
        credit = window.localStorage['firstPhotoCrdit'];
        //todo:解决获得照片编码数据和位置问题
        //todo:文件名
        //var base64 = "6K+077yM5L2g5Li65LuA5LmI6KaB56C06Kej5oiR77yf";
        //imgFile = new AV.File("myfile.txt", { base64: base64 });
        imgFile = AV.File.withURL('bg.jpg', 'img/bg.jpg');
        Camera.getLocation().then(function(result1){
          alert('getLocation(): ' + result1);
          latitude = result1.latitude;
          longitude = result1.longitude;
          Camera.getLocationDescription(result1.latitude, result1.longitude).then(function (result2) {
             alert('getLocationDescription():' + result2);
            location = result2;
            status = window.localStorage['photoStatus'];
            //todo:task是个数组，要从于信达那里拿
            task = tasks;
            var me = new AVObjects.User();
            me.id = window.localStorage['uoid'];
            uploader =  me;
            var photo = new AVObjects.Photo();
            //上传
            photo.save({
              credit : parseInt(credit),
              imgFile :imgFile,
              latitude : latitude.toString(),
              longitude : longitude.toString(),
              location : location,
              status : parseInt(status),
              task : task,
              uploader: uploader
            }, {
              success: function(sphoto) {
                // 实例已经成功保存.
                alert('Successfylly ' + sphoto.id);
              },
              error: function(post, error) {
                // 失败了.
                alert('Fail' + error.message);
              }
            });
          });
        });
















        // photo.save({
        //   credit:2,
        //   imgFile:file,
        //   status:1,getLocation
        //   uploader:AV.User.current(),
        //   task:new AVObjects.Task()

        // }, {
        //   success: function(photo) {
        //     // body...
        //     alert('SAVE POST SUCESSFULLY:' + photo.id);
        //   }

        // }, {
        //   error: function(photo, error) {
        //     alert('SAVE PHOTO FAIL: ' + error.message);
        //   }

        // });

      };


      return service;
    };
  })
