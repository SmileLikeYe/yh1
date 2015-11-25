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
      return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00 + "%");
      }
    }
  })

//////////////////////////////////////////////////////////////////////
//任务数据管理
  .provider('questsFactory', function () {
//service存放factory数据
    var service = {};
    this.$get = function ($q, AVObjects, DateUtil) {
      service.refreshQuests = function () {
        var deferred = $q.defer();
        var currentQuests = new Array();
        currentQuests = JSON.parse(window.localStorage['currentQuests'] || '[]');
        var refreshedCurrentQuests = new Array();
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
              //currentQuest.isContinued = true;
              //currentQuest.goldTaskStatus = false;
              //currentQuest.goldTaskFinishedPercent = 0;


              deferred.resolve(task);
            },
            error: function (task, error) {
              alert("refresh currentquests credit fail for:  " + error.message);
              deferred.reject(error);
            }
          });
          refreshedCurrentQuests.push(currentQuest);
          window.localStorage['currentQuests'] = JSON.stringify(refreshedCurrentQuests);
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
        var me = new AVObjects.User();
        me.id = window.localStorage['uoid'];
        query.notEqualTo("participant", me);
        query.greaterThan("endTime", new Date(DateUtil.getNowFormatDate()));
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
              currentQuest.numberOfPassedPhotos = 0;
              currentQuest.numberOfUploadPhotos = 0;
              currentQuest.continueDays = 0;
              currentQuest.isContinued = true;
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
  .factory('Camera', ['$location', 'DateUtil', '$q', function ($location, DateUtil, $q) {

    return {// 返回方法组的对象
      getPhoto: function () {
        var deferred = $q.defer();
        alert("getPhoto()");
        // $scope.pics.unshift({ id:$scope.pics.length,title:"安踏拍照",description:"拍的好",date:getNowFormatDate(),img:"img/ionic.png" });
        navigator.camera.getPicture(onSuccess, onFail, {
          sourceType: Camera.PictureSourceType.CAMERA,
           quality: 50,
           destinationType: Camera.DestinationType.DATA_URL,
           allowEdit: false,
           encodingType: Camera.EncodingType.PNG,
           cameraDirection: Camera.Direction.FRONT
        });
        function onSuccess(image64Data) {
          alert("getPhoto onSucess" + image64Data);
          deferred.resolve(image64Data);
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
    this.$get = function ($q, AVObjects, Camera, DateUtil) {

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

        pics.forEach(function(pic) { //遍历皂片
          if (pic.status == 0) {
            var photo = new AVObjects.Photo();
            var query = new AV.Query(AVObjects.Photo);
            query.get(pic.id, {
              success: function (photo) {
                pic.status = photo._serverData.status;//更新皂片状态, 包括没通过的2     [pics update]
                if(photo._serverData.status == 1) { //如果是通过验证，接下来
                  //更新积分状态
                  pic.credit = photo._serverData.credit;  // [pics update]
                  //照片拍摄当天已经完成任务 如2015-11-24 24：00:00:00
                  var isExsited = false;
                  var endPhotoDate = DateUtil.getTodayEndFormatDate(DateUtil.getFormatDate(eval(photo._serverData.createdAt)));
                  for (var j=0; j<finishedDaysLog.length; j++) {
                    if (finishedDaysLog[j] == endPhotoDate)
                        isExsited = true;
                  }
                  if (isExsited == false) {
                    finishedDaysLog.push(endPhotoDate); // eg:2015-11-25 24:00:00 拍照当天的24:00:00 方便计算  [finishiedDayLog add]
                  }
                  //
                  for (var i=0; i<currentQuests.length; i++) { //遍历当前任务，找到对应任务，
                    if (currentQuests[i].id == photo.id) {
                      currentQuests[i].numberOfPassedPhoto = parseInt(currentQuests[i].numberOfPassedPhoto) + 1;
                      if (pic.credit = window.localStorage['firstPhotoCrdit'] && parseInt(currentQuests[i].goldTaskStatus) == 0 ) { //这里如果是4 就表示不是连拍的第二张 ， 并且衣笔任务没有完成
                        currentQuests[i].continueDays = parseInt(currentQuests[i].continueDays) + 1; //总共拍了多少
                        currentQuests[i].goldTaskFinishedPercent = DateUtil.getPercent(currentQuests[i].continueDays, currentQuests[i].goldRequiredDays);  // [pics update]
                        if (parseInt(continueDays) >= parseInt(currentQuests[i].goldRequiredDays)) { //判断是否完成衣笔任务
                          currentQuests[i].goldTaskStatus = 1;  // [pics update]
                        }
                      }
                    }
                    refreshedCurrentQuests.push(currentQuests[i]);
                  }//for end.
                }
                deferred.resolve(photo);
              },
              error: function (photo, error) {
                alert("refresh photo credit fail for:  " + error.message);
              }
            });
          }// forEach end
          refreshedPics.push(pic);
        });

        window.localStorage['pics'] = JSON.stringify(refreshedPics);
        window.localStorage['currentQuests'] = JSON.stringify(currentQuests);
        window.localStorage['finishedDaysLog'] = JSON.stringify(finishedDaysLog);
        return deferred.promise;
      };

      //上传图片 （存图片在本地）
      service.uploadPhoto = function(choosedTask) {
        var deferred = $q.defer();
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
        //todo:解决获得照片编码数据和位置问题: 从服务器拿吧
        //todo:文件名
        //todo:图片压缩 http://docs.qiniu.com/api/v6/image-process.html
        Camera.getPhoto().then(function (image64Data) {
          imgFile = new AV.File(DateUtil.getNowFormatDate() + window.localStorage['username'] + ".png", {base64: image64Data});
          //保存
          imgFile.save().then(function () {
            Camera.getLocation().then(function (result1) {
              alert('getLocation(): ' + result1);
              latitude = result1.latitude;
              longitude = result1.longitude;
              Camera.getLocationDescription(result1.latitude, result1.longitude).then(function (result2) {
                alert('getLocationDescription():' + result2);
                location = result2;
                status = window.localStorage['photoStatus'];
                //todo:task是个数组，要从于信达那里拿
                task = choosedTask;
                var me = new AVObjects.User();
                me.id = window.localStorage['uoid'];
                uploader = me;
                var photo = new AVObjects.Photo();
                //上传
                photo.save({
                  credit: parseInt(credit),
                  imgFile: imgFile,
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                  location: location,
                  status: parseInt(status),
                  task: task,
                  uploader: uploader
                }, {
                  success: function (sphoto) {
                    // 实例已经成功保存.
                    alert('Successfylly ' + sphoto.id);
                    //存入本地和同步
                    var pic = {
                      credit: credit,
                      imgBase64: image64Data,
                      latitude: latitude,
                      longitude: longitude,
                      location: location,
                      status: status,
                      taskId: task.id,
                      uploaderId: uploader.id,
                      id: sphoto.id,
                      createdAt: DateUtil.getNowFormatDate()
                    };
                    deferred.resolve(pic);
                  },
                  error: function (post, error) {
                    // 失败了.
                    alert('Fail' + error.message);
                    deferred.reject("fail to upload photo");
                  }
                });
              });
            });
          }, function (error) {
            // The file either could not be read, or could not be saved to AV.
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
      service.refreshCredit = function () {
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
        var golds;
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
      //刷新
      service.checkQuestIsContinued = function () {
        var deferred = $q.defer();
        var pics = new Array();
        pics = JSON.parse(window.localStorage['pics'] || '[]');
        var currentQuests = new Array();
        currentQuests = JSON.parse(window.localStorage['pics'] || '[]');
        var refreshedCurrentQuests = new Array();
        var past = new Array();
        currentQuests.forEach(function(currentQuest) {
          if (currentQuest.isContinued = true) {
            var count = 0;
            pics.forEach(function (pic) { //遍历每个图片 统计改任务完成的天数
              var isNew = true;
              if (pic.taskId == currentQuest.id && (parseInt(pic.status) == 0 || parseInt(pic.status) == 1 )) {
                for (i = 0; i < past.length; i++) {
                  if (past[i] == pic.createdAt) {
                    isNew = false;
                  }
                  if (isNew) { //表示同一天的没有统计过 是新的
                    count++;
                    past.push(pic.createdAt);
                  }
                }
              }
            });
            var date = new Date();
            var realCount =  DateUtil.getDateDiff(currentQuest.takeTime, DateUtil.getTodayEndFormatDate(date)); // 2..333取 3   20前2 3  20点 必须等于三\
            var realCount = Math.ceil(realCount);

            if ( parseInt(date.getHours()) <= 20 ) {
              if (realCount - count <=1 ) {
              }
            }else {
              currentQuest.isContinued = false;
            }
          }else {
            if (realCount = count){
            }else {
              currentQuest.isContinued = false;
            }
          }
          refreshedCurrentQuests.push(currentQuest);
          deferred.resolve(currentQuest);
        });
        window.localStorage['currentQuests'] = JSON.stringify(refreshedCurrentQuests);
        return deferred.promise;
      };

      return service;
    };
  })

.factory('Data', function(){
    var data =
    {
      FirstName: ''
    };

    return {
      getFirstName: function () {
        return data.FirstName;
      },
      setFirstName: function (firstName) {
        data.FirstName = firstName;
      }
    };
  })
