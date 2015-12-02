angular.module('starter.services', [])
//////////////////////////////////////////////////////////////////////
//存放数据库类
  .provider("AVObjects", function () {
    this.$get = function ($q) {
      return {
        Task: AV.Object.extend("Task"),
        User: AV.Object.extend("_User"),
        Photo: AV.Object.extend("Photo"),
        CashRequest: AV.Object.extend("CashRequest"),
        DonateRequest: AV.Object.extend("DonateRequest"),
        AuthCode: AV.Object.extend("AuthCode"),
        ValueTable: AV.Object.extend("ValueTable"),
        UserData: AV.Object.extend("UserData")
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
      //创建UserData表
      service.createUserData = function (uoid) {
        var UserData = new AVObjects.UserData();
        var me = new AVObjects.User();
        me.id = uoid;
        UserData.set("user", me);
        UserData.save(null, {
          success: function (myUserData) {
          },
          error: function (myUserData, error) {
            console.log("创建用户数据失败: " + error.message);
          }
        });
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
      },
      getDateDiff: function(startDate,endDate) {
        var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
        var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
        var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
        return  dates;
      },
      getDateSecondDiff: function (startDate,endDate) {
        var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
        var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
        return Math.abs((startTime - endTime))/1000;
      },
      getTodayEndFormatDate: function (date) {
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
        var todayEnd = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " +  "24" + seperator2 + "00" + seperator2 + "00";
        return todayEnd;
      },
      getTodayBeginFormatDate: function (date) {
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
        var todayBegin = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " +  "00" + seperator2 + "00" + seperator2 + "00";
        return todayBegin;
      },
      getThreeMonthsLater: function (date) {
        var seperator1 = "-";
        var seperator2 = ":";
        var startY=date.getFullYear();
        var startM=date.getMonth()+1;
        var startD=date.getDate();

        var mydate=new Date(startY,startM+3,startD);
        var endY=mydate.getFullYear();
        var endM=mydate.getMonth();
        var endD=mydate.getDate();
        var endDate = endY + seperator1 + endM + seperator1 + endD + " " + date.getHours()
          + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        return endDate;
      },
      getPercent: function(num, total) {
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0 ? "0" : (Math.round(num / total * 10000) / 100.00);
      }
    }
  })

//////////////////////////////////////////////////////////////////////
//任务数据管理
  .provider('questsFactory', function () {
//service存放factory数据
    var service = {};
    this.$get = function ($q, AVObjects, DateUtil) {
      service.checkAuthCode = function (authCodeId) {
        var deferred = $q.defer();
        var query = new AV.Query(AVObjects.AuthCode);
        query.include("task");
        query.get(authCodeId, {
          success: function (authCode) {
            var task = authCode.get("task");
            deferred.resolve(task.id);
          },
          error:function(authCode, error) {
            deferred.reject("Not Exsit");
          }
        });
        return deferred.promise;
      };
      service.refreshQuests = function () {
        var deferred = $q.defer();
        var currentQuests = new Array();
        var finishedQuests = new Array();
        finishedQuests = JSON.parse(window.localStorage['finishedQuests'] || '[]');
        currentQuests = JSON.parse(window.localStorage['currentQuests'] || '[]');
        var refreshedCurrentQuests = new Array();
        var j = 0;
        currentQuests.forEach(function(currentQuest) {
          var query = new AV.Query(AVObjects.Task);
          query.get(currentQuest.id, {
            success: function (task) {
              currentQuest.goldRequiredDays = task._serverData.goldRequiredDays;
              currentQuest.limit = task._serverData.limit;
              currentQuest.startTime = DateUtil.getFormatDate(eval(task._serverData.startTime));
              currentQuest.content = task._serverData.content;
              currentQuest.endTime = DateUtil.getFormatDate(eval(task._serverData.endTime));
              currentQuest.participantId = window.localStorage['uoid'];
              currentQuest.photoNum = task._serverData.photoNum;
              currentQuest.title = task._serverData.title;
              currentQuest.priority = task._serverData.priority;
              currentQuest.userNum = task._serverData.userNum;
              currentQuest.goldCount = task._serverData.goldCount;
              //currentQuest.id = task.id;
              //add new propertys 本地的数据不刷新
              //currentQuest.numberOfPassedPhotos = "0";
              //currentQuest.numberOfUploadPhotos = "0";
              //currentQuest.continueDays = "0";
              //currentQuest.goldTaskStatus = false;
              //currentQuest.goldTaskFinishedPercent = 0;
              if (DateUtil.getNowFormatDate() < currentQuest.endTime ) { //判断是否过期
                refreshedCurrentQuests.push(currentQuest);
              }else {
                finishedQuests.push(currentQuest);
              }
              j++;
              if (j == currentQuest.length) {
                window.localStorage['currentQuests'] = JSON.stringify(refreshedCurrentQuests);
                window.localStorage['finishedQuests'] = JSON.stringify(finishedQuests);
              }
              deferred.resolve(task);
            },
            error: function (task, error) {
              alert("refresh currentquests credit fail for:  " + error.message);
              deferred.reject(error);
            }
          });
          j ++;
        });

        return deferred.promise;
      };
      //service.getQuests = function () {
      //  var deferred = $q.defer();
      //  var query = new AV.Query(AVObjects.Task);
      //  var me = new AVObjects.User();
      //  me.id = window.localStorage['uoid'];
      //  query.equalTo("participant", me);
      //  query.find({
      //    success: function (data) {
      //      var result = new Array();
      //      for (var i = 0; i < data.length; i++) {
      //        var t = data[i]['_serverData'];
      //        t.id = data[i].id;
      //        console.log("a quest");
      //        result.push(t);
      //      }
      //      deferred.resolve(result);
      //      return;
      //    },
      //    error: function (error) {
      //      deferred.reject("读取失败");
      //    }
      //  });
      //  return deferred.promise;
      //};
      service.getNewQuest = function () {  //todo:大于100的情况为未处理
        var deferred = $q.defer();
        var query = new AV.Query(AVObjects.Task);
        var now = DateUtil.getNowFormatDate();
        if (window.localStorage['logged_in'] == 'true') {
          var me = new AVObjects.User();
          me.id = window.localStorage['uoid'];
          query.notEqualTo("participant", me);
        }
        query.greaterThan("acceptEndTime", new Date(DateUtil.getNowFormatDate()));
        query.lessThan("startTime",new Date(DateUtil.getNowFormatDate()));
        query.descending("priority");
        query.first({
          success: function (task) {
            var t = task._serverData;
            t.id = task.id;
            t.startTime = DateUtil.getFormatDate(eval(t['startTime']));
            t.endTime = DateUtil.getFormatDate(eval(t['endTime']));
            deferred.resolve(t);
          },
          error: function (error) {
            console.log("error"+JSON.stringify(error));
            deferred.reject("获取最新任务失败");
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
        query.equalTo("status", 1);// 这里注意是不是要转换
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
      service.acceptQuest = function (qid) {
        var deferred = $q.defer();
        var query = new AV.Query(AVObjects.Task);
        // 这个 id 是要修改条目的 objectId，你在生成这个实例并成功保存时可以获取到，请看前面的文档
        query.get(qid, {
          success: function(task) {
            // 成功，回调中可以取得这个 Post 对象的一个实例，然后就可以修改它了
            var me = new AVObjects.User();
            me.id = window.localStorage['uoid'];
            var relation = task.relation('participant')
            relation.add(me);
            task.save().then(function () {
              var currentQuests = new Array();
              currentQuests = JSON.parse(window.localStorage['currentQuests'] || '[]');
              var currentQuest = {};
              currentQuest.goldRequiredDays = task._serverData.goldRequiredDays;
              currentQuest.limit = task._serverData.limit;
              currentQuest.startTime = DateUtil.getFormatDate(eval(task._serverData.startTime));
              currentQuest.content = task._serverData.content;
              currentQuest.endTime = DateUtil.getFormatDate(eval(task._serverData.endTime));
              currentQuest.participantId = window.localStorage['uoid'];
              currentQuest.photoNum = task._serverData.photoNum;
              currentQuest.title = task._serverData.title;
              currentQuest.priority = task._serverData.priority;
              currentQuest.userNum = task._serverData.userNum;
              currentQuest.goldCount = task._serverData.goldCount;
              currentQuest.id = task.id;
              currentQuest.takeTime = DateUtil.getNowFormatDate();
              //add new property
              currentQuest.earnedCredit = 0;
              currentQuest.numberOfPassedPhotos = 0;
              currentQuest.numberOfUploadPhotos = 0;
              currentQuest.continueDays = 0;
              currentQuest.goldTaskStatus = 0;
              currentQuest.goldTaskFinishedPercent = 0;

              currentQuests.push(currentQuest);
              window.localStorage['currentQuests'] = JSON.stringify(currentQuests);
              deferred.resolve(task);
            });
          },
          error: function(object, error) {
            // 失败了.
            console.log(object);
            deferred.reject("保存失败");
          }
        });
        return deferred.promise;
      };


      return service;
    };
  })


//////////////////////////////////////////////////////////////////////
  .factory('Camera', ['DateUtil', '$q', '$cordovaGeolocation', function (DateUtil, $q, $cordovaGeolocation) {

    return {// 返回方法组的对象

      /**
       *
       * @param options
       * @returns {*}
       */
      getPhoto: function (options) {
        var q = $q.defer();
        alert("getPhoto()");
        navigator.camera.getPicture(function (result) {
          // Do any magic you need

          q.resolve(result);
        }, function (err) {
          q.reject(err);
        }, options);

        return q.promise;
      },
      /**
       *
       * @param img_path
       * @returns {*}
       */
      resizeImage: function (img_path) {
        var q = $q.defer();
        window.imageResizer.resizeImage(function (success_resp) {
          console.log('success, img re-size: ' + JSON.stringify(success_resp));
          q.resolve(success_resp);
        }, function (fail_resp) {
          console.log('fail, img re-size: ' + JSON.stringify(fail_resp));
          q.reject(fail_resp);
        }, img_path, 200, 0, {
          imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
          resizeType: ImageResizer.RESIZE_TYPE_MIN_PIXEL,
          pixelDensity: true,
          storeImage: false,
          photoAlbum: false,
          format: 'jpg'
        });

        return q.promise;
      },

      toBase64Image: function (img_path) {
        var q = $q.defer();
        alert("resizeImage()");
        window.imageResizer.resizeImage(function (success_resp) {
          console.log('success, img toBase64Image: ' + JSON.stringify(success_resp));
          q.resolve(success_resp);
        }, function (fail_resp) {
          console.log('fail, img toBase64Image: ' + JSON.stringify(fail_resp));
          q.reject(fail_resp);
        }, img_path, 1, 1, {
          imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
          resizeType: ImageResizer.RESIZE_TYPE_FACTOR,
          format: 'jpg'
        });

        return q.promise;
      },

      getLocation: function (options) {
        var deferred = $q.defer();
        alert("getLocation()");
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
          console.log("$cordovaGeolocation.getCurrentPosition YES");
          var result = {};
          result.latitude = position.coords.latitude;
          result.longitude =  position.coords.longitude;
          alert(result.latitude + "  " + result.longitude);
          deferred.resolve(result);
        }, function(error) {
          console.log(error);
          alert('Get location fail:' + error.message);
          deferred.reject("getLocation() fail!");
        });

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
    this.$get = function ($q, AVObjects, Camera, DateUtil) {

      service.test1 = function () {
        var a = 1;
        var array1 = [1,0,0,1];
        var array2 = [];
        var j = 0;
        array1.forEach(function(a1) {
          if (a1 == 0) {
            service.getPhotoById("5659ea0460b28da566569afc").then(function (photo) {
              var d = photo.id;
              var f = 1;
              j++;
              array2.push(a1);
              if (j == array1.length) {
                var c = i;
              }
            });
          }else {
            array2.push(a1);
            j++;
          }
        });
      };

      service.getPhotoById = function (photoId) {
        var deferred = $q.defer();
        var query = new AV.Query(AVObjects.Photo);
        query.get(photoId, {
          success: function (photo) {
              deferred.resolve(photo);
          },
          error: function (photo, error) {
              deferred.reject(error);
          }
        });
        return deferred.promise;
      };

      //刷新本地保存photo的status
      service.refreshPhotos = function () {
        //只要本地存的photo的status = 0 的需要refresh
        var deferred = $q.defer();
        var pics = new Array();
        var currentQuests = new Array();
        var finishedDaysLog = new Array();
        pics = JSON.parse(window.localStorage['pics'] || '[]');
        currentQuests = JSON.parse(window.localStorage['currentQuests'] || '[]');
        finishedDaysLog = JSON.parse(window.localStorage['finishedDaysLog'] || '[]');
        var refreshedPics = new Array();
        var refreshedCurrentQuests = new Array();

        var j = 0;
        //refresh pics
        pics.forEach(function(pic){
          if (parseInt(pic.status) == 0) {
            //var photo = new AVObjects.Photo();
            var photo = service.getPhotoById(pic.id).then(function (photo) {
              pic.status = photo._serverData.status;//更新皂片状态, 包括没通过的2     [pics update]
              if(parseInt(photo._serverData.status) == 1) { //如果是通过验证，接下来
                //更新积分状态
                pic.credit = photo._serverData.credit;  // [pics update]
                //照片拍摄当天已经完成任务 如2015-11-24 24：00:00:00
                var isExsited = false;
                var thisDateT = DateUtil.getFormatDate(eval(photo.createdAt))
                thisDateT = thisDateT.substr(0, 10) + "T" + thisDateT.substr(11, 8);
                var createdAt = new Date(thisDateT);
                var endPhotoDate = DateUtil.getTodayEndFormatDate(createdAt);
                //refresh finishedDaysLog
                for (var j=0; j<finishedDaysLog.length; j++) {
                  if (finishedDaysLog[j] == endPhotoDate)
                    isExsited = true;
                }
                if (isExsited == false) {
                  finishedDaysLog.push(endPhotoDate); // eg:2015-11-25 24:00:00 拍照当天的24:00:00 方便计算  [finishiedDayLog add]
                }
                //refresh currentQuests
                for (var i=0; i<currentQuests.length; i++) { //遍历当前任务，找到对应任务，
                  if (currentQuests[i].id == pic.taskId) {
                    currentQuests[i].earnedCredit  = parseInt(currentQuests[i].earnedCredit) + parseInt(pic.credit);
                    currentQuests[i].numberOfPassedPhotos = parseInt(currentQuests[i].numberOfPassedPhotos) + 1;
                    if (parseInt(pic.credit) == parseInt(window.localStorage['firstPhotoCredit']) && parseInt(currentQuests[i].goldTaskStatus) == 0 ) { //这里如果是4 就表示不是连拍的第二张 ， 并且衣笔任务没有完成
                      currentQuests[i].continueDays = parseInt(currentQuests[i].continueDays) + 1; //总共拍了多少
                      currentQuests[i].goldTaskFinishedPercent = DateUtil.getPercent(currentQuests[i].continueDays, currentQuests[i].goldRequiredDays);  // [pics update]
                      if (parseInt(currentQuests[i].continueDays) >= parseInt(currentQuests[i].goldRequiredDays)) { //完成天数大于等于10天 判断是否完成衣笔任务
                        currentQuests[i].goldTaskStatus = 1;  //金币任务完成  [pics update]
                      }
                    }
                  }
                  refreshedCurrentQuests.push(currentQuests[i]);
                }//for end.
              }
              refreshedPics.push(pic); // this is exe after callback for status = 0
              j ++;
              if ( j==pics.length) {
                window.localStorage['pics'] = JSON.stringify(refreshedPics);
                window.localStorage['currentQuests'] = JSON.stringify(currentQuests);
                window.localStorage['finishedDaysLog'] = JSON.stringify(finishedDaysLog);
                deferred.resolve(refreshedCurrentQuests);
              }
            });
          }else {
            refreshedPics.push(pic); // this is exe before callback for status != 0
            j++;
          }

        });



        return deferred.promise;
      };

      //上传图片 （存图片在本地）
      service.uploadPhoto = function(choosedTask) {
        var deferred = $q.defer();
        var picOptions = {
          destinationType: navigator.camera.DestinationType.FILE_URI,
          quality: 75,
          targetWidth: 200,
          targetHeight: 250,
          allowEdit: false,
          saveToPhotoAlbum: true
        };
        //todo:图片压缩 http://docs.qiniu.com/api/v6/image-process.html
        Camera.getPhoto(picOptions).then(function (imageURI) {
          alert("Camera.getPhoto() YES " + imageURI);
          var imageURI = imageURI;
          Camera.toBase64Image(imageURI).then(function (result) {
            alert("Camera.toBase64Image() YES");
            var image64Data = result.imageData;
            alert(image64Data.length + '/n' + image64Data);
            var geoOptions = {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 0
            };
            Camera.getLocation(geoOptions).then(function (geoResult) {
              alert("Camera.getLocation() YES");
              var latitude = geoResult.latitude;
              var longitude = geoResult.longitude;
              Camera.getLocationDescription(latitude, longitude).then(function (desResult) {
                alert('Camera.getLocationDescription() YES ' + desResult);
                var credit = window.localStorage['firstPhotoCredit'];
                var status = 0;
                AV.Cloud.run('savePhoto', {
                  fileName: (DateUtil.getNowFormatDate() + '_' + window.localStorage['username'] + ".png"),
                  image64Data: image64Data,
                  credit: parseInt(credit),
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                  location: desResult,
                  status: parseInt(status),
                  taskId: choosedTask.id,
                  uploaderId: window.localStorage['uoid']

                }, {
                  success: function (photoId) {
                    alert("AV.Cloud.run('savePhoto') YES: " + photoId);
                    //刷新 numberOfUploadPhotos
                    var currentQuests = new Array();
                    currentQuests = JSON.parse(window.localStorage['currentQuests'] || '[]');
                    var refreshedCurrentQuests = new Array();
                    for (var i=0; i<currentQuests.length; i++) { //遍历当前任务，找到对应任务，
                      if (currentQuests[i].id == choosedTask.id) {
                        currentQuests[i].numberOfUploadPhotos = parseInt(currentQuests[i].numberOfUploadPhotos) + 1;
                      }
                      refreshedCurrentQuests.push(currentQuests[i]);
                    }//for end.
                    window.localStorage['currentQuests'] = JSON.stringify(refreshedCurrentQuests);

                    //存入本地
                    var pic = {
                      credit: credit,
                      imageURI: imageURI,
                      latitude: latitude,
                      longitude: longitude,
                      location: location,
                      status: status,
                      taskId: choosedTask.id,
                      uploaderId: window.localStorage['uoid'],
                      id: photoId,
                      createdAt: DateUtil.getNowFormatDate()
                    };
                    var pics = new Array();
                    pics = JSON.parse(window.localStorage['pics'] || '[]');
                    pics.unshift(pic);
                    window.localStorage['pics'] = JSON.stringify(pics);
                    deferred.resolve(pic);
                  },
                  error: function (error) {
                    alert("AV.Cloud.run('savePhoto') NO: " + error.message);
                    deferred.reject(error.message);
                  }
                });
              }, function (error) {
                alert("Camera.getLocation() NO: " + error.messge);
                console.log(error);
              });

            }, function (error) {
               alert("Camera.getLocation NO: " + error.messge);
               console.log(error);
            });
          }, function (error) {
            alert("Camera.toBase64Imgage NO" + error.message);
            console.log(error);
          });
        });
        return deferred.promise;
      };

      return service;
    };
  })


//用户数据管理
  .provider('creditProvider', function () {
    var service = {};
    var username = window.localStorage['username'];
    var uoid = window.localStorage['uoid'];
    this.$get = function ($q, AVObjects) {
      //刷新积分
      service.refreshMe = function () {
        var deferred = $q.defer();
        AVObjects.User.logIn(window.localStorage['username'], window.localStorage['password'], {
          success: function(me) {
            deferred.resolve(me._serverData)
          },error: function (error) {
            alert(error.message);
            deferred.reject(error.message);
          }
        });
        return deferred.promise;
      };
      //发送积分兑换请求
      service.uploadCashRequest = function (cashMoney) {
        var deferred = $q.defer();
        var cashRequest = new AVObjects.CashRequest();
        cashRequest.set("isHandled", false);
        cashRequest.set("cashMoney", cashMoney);
        var me = new AVObjects.User();
        me.id = window.localStorage['uoid'];
        cashRequest.set("requester", me);
        cashRequest.save(null, {
          success: function (myCashRequest) {
            deferred.resolve(myCashRequest);
          },
          error: function (myCashRequest, error) {
            alert("发送兑换请求失败: " + error.message);
            deferred.reject(error.message);
          }
        });
        return deferred.promise;
      };
      service.getGolds = function () {
        var golds = 0;
        var goldsLog = new Array();
        goldsLog = JSON.parse(window.localStorage['goldsLog'] || '[]');
        for (var i=0; i<goldsLog.length; i++) {
          golds = parseInt(goldsLog[i].goldCount) + parseInt(golds);
        }
        return golds;

      };

      return service;
    };
  })

  .provider('goldProvider', function () {
    var service = {};
    this.$get = function ($q, AVObjects, DateUtil) {
      ///* 刷新进行中的任务的衣笔任务是不是连续 （现在不需要了）
      // * s:myGold更新， goldLogs 更新，为0 则舍掉
      // * f:
      // */
      //service.checkQuestIsContinued = function () {
      //  var deferred = $q.defer();
      //  var pics = new Array();
      //  pics = JSON.parse(window.localStorage['pics'] || '[]');
      //  var currentQuests = new Array();
      //  currentQuests = JSON.parse(window.localStorage['pics'] || '[]');
      //  var refreshedCurrentQuests = new Array();
      //  var past = new Array();
      //  currentQuests.forEach(function(currentQuest) {
      //    if (currentQuest.isContinued == true) { //金币任务仍在继续
      //      var count = 0;
      //      pics.forEach(function (pic) { //遍历每个图片 统计该任务完成的天数
      //        var isNew = true;
      //        if (pic.taskId == currentQuest.id && (parseInt(pic.status) == 0 || parseInt(pic.status) == 1 )) {
      //          for (i = 0; i < past.length; i++) {
      //            if (past[i] == pic.createdAt) {
      //              isNew = false;
      //            }
      //            if (isNew) { //表示同一天的没有统计过 是新的
      //              count++;
      //              past.push(pic.createdAt);
      //            }
      //          }
      //        }
      //      });
      //      var todate = new Date();
      //      var realCount =  DateUtil.getDateDiff(currentQuest.takeTime, DateUtil.getTodayEndFormatDate(date)); // 2..333取 3   20前2 3  20点 必须等于三\
      //      var realCount = Math.ceil(realCount);
      //
      //      if ( parseInt(todate.getHours()) <= 20 ) {
      //        if (realCount - count <=1 ) {
      //        }
      //      }else {
      //        currentQuest.isContinued = false;
      //      }
      //    }else {
      //      if (realCount = count){
      //      }else {
      //        currentQuest.isContinued = false;
      //      }
      //    }
      //    refreshedCurrentQuests.push(currentQuest);
      //    deferred.resolve(currentQuest);
      //  });
      //  window.localStorage['currentQuests'] = JSON.stringify(refreshedCurrentQuests);
      //  return deferred.promise;
      //};


      /* 计算今日赚得的总积分
       * s: 今日赚得总积分
       * f:
       */
      service.getTodayEarnedCredit = function () {
        var pics = new Array();
        pics = JSON.parse(window.localStorage['pics'] || '[]');
        var todayEarnedCredit = 0;
        for (var i=0; i < pics.length; i++) {
          //今天的
          if (pics[i].createdAt.substring(0,10) == DateUtil.getNowFormatDate().substring(0,10)){
            //已经通过的
            if (parseInt(pics[i].status) == 1 ) {
              todayEarnedCredit = todayEarnedCredit + parseInt(pics[i].credit);
            }
          }
        }
        return todayEarnedCredit;
      };
      /* 发送赠送衣币请求
      * s:myGold更新， goldLogs 更新，为0 则舍掉
      * f:
       */
      service.uploadDonateRequest = function (donateParams) {
        var deferred = $q.defer();
        var donateRequest = new AVObjects.DonateRequest();
        donateRequest.set("donateGold", donateParams.goldToDonate);
        donateRequest.set("receiver", donateParams.accountToDonate);
        donateRequest.set("goldOverDate", donateParams.goldLogOverDate);
        donateRequest.set("status", 0);
        var me = new AVObjects.User();
        me.id = window.localStorage['uoid'];
        donateRequest.set("donater", me);
        donateRequest.save(null, {
          success: function (myDonateRequest) {
            //refresh myGold
            var myGold = window.localStorage['myGold'];
            myGold = parseInt(myGold) - parseInt(donateParams.goldToDonate);
            window.localStorage['myGold'] = myGold;
            //refresh goldLogs
            var goldLogs = new Array();
            var refreshedGoldLogs = new Array();
            goldLogs = JSON.parse(window.localStorage['goldLogs'] || '[]');
            goldLogs.forEach(function (goldLog) {
              if (goldLog.id == donateParams.goldLogId) {
                goldLog.goldCount = parseInt(goldLog.goldCount) - parseInt(donateParams.goldToDonate);
              }
              if (parseInt(goldLog.goldCount) > 0)
                refreshedGoldLogs.push(goldLog);
            });
            window.localStorage['goldLogs'] = JSON.stringify(refreshedGoldLogs);
            deferred.resolve(myDonateRequest);
          },
          error: function (myDonateRequest, error) {
            alert("赠送衣笔失败: " + error.message);
            deferred.reject(error.message);
          }
        });
        return deferred.promise;
      };
      /* 接收赠送衣币请求或者过期没有接收的请求
       * s:myGold更新， goldLogs 更新，为0 则舍掉
       * f:
       */
      service.refreshDonateRequest = function () {
        var deferred = $q.defer();
        var query = new AV.Query(AVObjects.DonateRequest);
        query.equalTo('receiver', window.localStorage['username']);
        query.equalTo('status',0); //0:未领取 1:已经领取
        var goldLogs = new Array();
        goldLogs = JSON.parse(window.localStorage['goldLogs'] || '[]');
        var myGold = new Array();
        myGold = window.localStorage['myGold'];

        var j = 0;
        query.find({
          success: function (results) {
            results.forEach(function (result) {
              var goldLog = {id:goldLogs.length, goldCount:result.get('donateGold'), overDate:result.get('goldOverDate')};
              goldLogs.pus(goldLog);
              myGold = parseInt(myGold) + result.get('donateGold');
              j++;
              if (j == results.length) {
                window.localStorage['goldLogs'] = JSON.stringify(goldLogs);
                window.localStorage['myGold'] = myGold;
                deferred.resolve(results);
              }
            });
          },
          error: function (results,error) {
            alert("取东西出错");
            deferred.reject(error);
          }
        });
        return deferred.promise;
      };

      return service;
    };
  })


  .provider('utilProvider', function () {
    var service = {};
    this.$get = function ($q, AVObjects, DateUtil) {

      service.getValueTale = function () {
        var deferred = $q.defer();
        var query = new AV.Query(AVObjects.ValueTable);
        query.find({
          success: function (results) {
            deferred.resolve(results);
          },
          error: function (results, error) {
            deferred.reject(error);
          }
        });
        return deferred.promise;
      };

      return service;
    }
  })

  .provider('addressProvider', function () {
    var service = {};
    this.$get = function ($q, AVObjects) {

      //增
      service.addAddress = function (data) {
        var deferred = $q.defer();
        var addressList = JSON.parse(window.localStorage['addressList'] || '[]');
        var query = new AV.Query(AVObjects.UserData);
        var me = new AVObjects.User();
        me.id = window.localStorage['uoid'];
        query.equalTo("user", me);
        query.first({
          success: function (result) {
            var newAddress = {id:addressList.length, name:data.name, phone:data.phone, address:data.address};
            result.addUnique('addressList',newAddress); //服务器
            result.save(null, {
              success: function (re) {
                alert("新地址成功保存");
                addressList.push(newAddress);
                window.localStorage['addressList'] = JSON.stringify(addressList); //本地
                deferred.resolve(re);
              },
              error: function (re,error) {
                alert("新地址成功保存失败");
                deferred.reject(error);
              }
            });
          },
          error: function (result, error) {
            deferred.reject(error);
          }
        });
        return deferred.promise;
      };
      //改
      service.updateAddress = function (data) {
        var deferred = $q.defer();
        var addressList = new Array();
        var addressList = JSON.parse(window.localStorage['addressList'] || '[]');
        var refreshedAddressList = new Array();
        var query = new AV.Query(AVObjects.UserData);
        var me = new AVObjects.User();
        me.id = window.localStorage['uoid'];
        query.equalTo("user", me);
        query.first({
          success: function (result) {
            for (var i=0; i< addressList.length; i++) {
              if (addressList[i].id == data.id) {
                addressList[i].name = data.name;
                addressList[i].phone = data.phone;
                addressList[i].address = data.address;
              }
              refreshedAddressList.push(addressList[i]);
            }
            result.set('addressList',refreshedAddressList); //服务器
            result.save(null, {
              success: function (re) {
                alert("地址修改成功保存");
                window.localStorage['addressList'] = JSON.stringify(refreshedAddressList); //本地
                deferred.resolve(re);
              },
              error: function (re,error) {
                alert("地址修改保存失败");
                deferred.reject(error);
              }
            });
          },
          error: function (result, error) {
            deferred.reject(error);
          }
        });
        return deferred.promise;
      };

      return service;
    }
  })

  .provider('feedbackProvider', function () {
    var service = {};
    this.$get = function ($q, AVObjects, DateUtil) {
      //增
      service.addFeedback = function (data) {
        var deferred = $q.defer();
        var feedbackList = JSON.parse(window.localStorage['feedbackList'] || '[]');
        var query = new AV.Query(AVObjects.UserData);
        var me = new AVObjects.User();
        me.id = window.localStorage['uoid'];
        query.equalTo("user", me);
        query.first({
          success: function (result) {
            var newFeedback = {id:feedbackList.length, content:data.content, date:DateUtil.getNowFormatDate()};
            result.addUnique('feedbackList',newFeedback); //服务器
            result.save(null, {
              success: function (re) {
                alert("已经收到您的反馈！我们会尽快处理");
                feedbackList.push(newFeedback);
                window.localStorage['feedbackList'] = JSON.stringify(feedbackList); //本地
                deferred.resolve(re);
              },
              error: function (re,error) {
                alert("您的反馈因为网络原因提交失败");
                deferred.reject(error);
              }
            });
          },
          error: function (result, error) {
            deferred.reject(error);
          }
        });
        return deferred.promise;
      };

      return service;
    }
  })

//.factory('Data', function(){
//    var data =
//    {
//      FirstName: ''
//    };
//
//    return {
//      getFirstName: function () {
//        return data.FirstName;
//      },
//      setFirstName: function (firstName) {
//        data.FirstName = firstName;
//      }
//    };
//  })
