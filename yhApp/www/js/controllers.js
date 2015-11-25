angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, userProvider, questsFactory, creditProvider, photoProvider, DateUtil) {

    /**************************************************************************************
     * AppCtrl
     * $scope   window.localStorage 的变量
     *************************************************************************************/

    //todo: 这里要把登陆的数据移到loginCtrl里面去，可问题是如果加了regCtrl捏，其实reg的数据应该是独立的。
    // $scope.#parent = loginCtrl.$scope
    $scope.loginCtrlScope = "loginCtrl";
    $scope.loginData = {username: '未登录', logged_in: false, nickName: "未登录"};
    $scope.regData = {};
    $scope.TIMEOUT = 60;
    $scope.packageHide = true;
    $scope.creditToCash = 10;


    // 本地
    window.localStorage['firstPhotoCrdit'] = 4;
    window.localStorage['secondePhotoCrdit'] = 6;
    window.localStorage['photoStatus'] = 0;

    if (window.localStorage['username'] != '未登录' && window.localStorage['username'] != '') {
      //这里是因为登陆时做了初始化
      $scope.loginData.username = window.localStorage['username'];
      $scope.loginData.logged_in = window.localStorage['logged_in'];
      $scope.loginData.password = window.localStorage['password'];
      $scope.loginData.nickName = window.localStorage['nickName'];
      $scope.loginData.alipayAccount = window.localStorage['alipayAccount'];
      //第一次登陆，本地没有做初始化
      if (window.localStorage['totalCreditToCash'] == 'undefined')
        window.localStorage['totalCreditToCash'] = 0;
      $scope.totalCreditToCash = window.localStorage['totalCreditToCash'];
      if (window.localStorage['globalTaskLocalInfo'] == 'undefined' )
        window.localStorage['globalTaskLocalInfo'] = JSON.stringify({currentLevel:1, lastLevelFinishedDate: "2000-11-11 11:11:11", finishedDays:0, notFinishedDays:0}); //单身狗永远未完成 '.'
      //$scope.globalTaskLocalInfo = window.localStorage['globalTaskLocalInfo'];
      if (window.localStorage['finishedDaysLog'] == 'undefined')
        window.localStorage['finishedDaysLog'] = '[]';

      //refresh my quests
      $scope.hpQuests = [];
      $scope.hpQuest =  {title:"还没有任务，赶快开始赚钱吧！"};
      $scope.currentQuests = new Array();
      $scope.finishedQuests = new Array();
      $scope.currentQuests = JSON.parse(window.localStorage['currentQuests'] || '[]'); //init in case net work is bad
      $scope.finishedQuests = JSON.parse(window.localStorage['finishedQuests'] || '[]');

      questsFactory.refreshQuests().then(function (data) {
        $scope.currentQuests = JSON.parse(window.localStorage['currentQuests'] || '[]');
      });
      //questsFactory.getQuests().then(function (data) { //获得所有我参与的Quests
      //  if (typeof (data) != 'undefined')
      //  {
      //    $scope.currentQuests.length = 0; //有网有返回值，所以清空，准备更新
      //    $scope.finishedQuests.length = 0;
      //    var now = DateUtil.getFormatDate(new Date()).replace(/[":A-Z.-]/g, "");
      //    data.forEach(
      //      function (q) {
      //        var tt = DateUtil.getFormatDate(eval(q['endTime']));
      //        var limit = tt.replace(/[":A-Z.-]/g, "");
      //        q.numberOfPassedPhotos = q.numberOfPassedPhotos;
      //        if (now < limit) {//未超时
      //          q.endTime = tt.replace(/T/g, " ").replace(/"/g, "").substring(0, 10);
      //          questsFactory.getCurrentCreditOfQuest(q.id).then(
      //            function (credit) {
      //              q.currentCredit = credit;
      //              q.done = 100 * q.currentCredit / q.creditTotal;
      //              q.left = 100 - q.done;
      //            }
      //          );
      //          $scope.hpQuests.push(q);
      //          $scope.currentQuests.push(q);
      //        }
      //        else
      //        {
      //          q.endTime = limit.replace(/T/g, " ").replace(/"/g, "").substring(0, 19);
      //          $scope.finishedQuests.push(q);
      //        }
      //      }
      //    );
      //    $scope.hpQuest = $scope.hpQuests[0];
      //    window.localStorage['currentQuests'] = JSON.stringify($scope.currentQuests);
      //    window.localStorage['finishedQuests'] = JSON.stringify($scope.finishedQuests);
      //  }
      //
      //});

      //refresh the my credit  这里先赋值是怕网络出问题
      if (window.localStorage['myCredit'] == "undefined")
        window.localStorage['myCredit'] = 0;
      $scope.myCredit = window.localStorage['myCredit']; //init in case net work is bad
      //$scope.myCredit = window.localStorage['myCredit']; //init in case net work is bad
      if (window.localStorage['totalCreditToCash'] == "undefined")
        window.localStorage['totalCreditToCash'] = 0;
      $scope.totalCreditToCash = window.localStorage['totalCreditToCash']; //init in case net work is bad
      creditProvider.refreshCredit().then( function(me) {
        if (typeof(me) != 'undefined'){ //bad result
              $scope.myCredit = me.credit - me.totalCreditToCash;
              window.localStorage['myCredit'] = me.credit - me.totalCreditToCash;
              $scope.totalCreditToCash = me.totalCreditToCash;
              window.localStorage['totalCreditToCash'] = me.totalCreditToCash;
        }
      });

      //refresh my photos.status
      $scope.pics = JSON.parse(window.localStorage['pics'] || '[]');
      photoProvider.refreshPhotos().then(function (result) {
        //todo: 这里不管有没有正确result都会执行的话，前面的赋值显得毫无意义: update:如果请求不成功，不会执行下面
        if (typeof(result) != 'undefined') { //bad result
          $scope.pics = JSON.parse(window.localStorage['pics'] || '[]');
        }
      });
    }

    //refresh globalTaskLocalInfo 每天20：00后更新
    $scope.pics = new Array();
    //refresh my golabalTaskInfo
    var finishedDaysLog = new Array();
    var globalTaskLocalInfo = new Array();
    finishedDaysLog = JSON.parse(window.localStorage['finishedDaysLog'] || '[]');
    globalTaskLocalInfo = JSON.parse(window.localStorage['globalTaskLocalInfo'] || '[]');
    if (parseInt(globalTaskLocalInfo.currentLevel) == 1) {
      var finishiedDaysCount = 0;
      for (var i=0; i<finishedDaysLog.length; i++) {
        var today = new Date();
        var days = DateUtil.getDateDiff(finishedDaysLog[i], DateUtil.getTodayEndFormatDate((today)));
        if (days < 12  && days >= 0 ) { //0 1 2 ... 11
          finishiedDaysCount++;
        }
      } // for end
      if (finishiedDaysCount >= 10) {
        //完成了任务1
        globalTaskLocalInfo.currentLevel = 2;
        globalTaskLocalInfo.lastLevelFinishedDate = DateUtil.getTodayEndFormatDate((today));
        globalTaskLocalInfo.finishedDays = 0;
        globalTaskLocalInfo.notFinishedDays = 0;
        $scope.packageHide = false;
      }else {//这这一级没有失败这一说，就没没到10 就每天不断计算而已
        globalTaskLocalInfo.finishedDays = finishiedDaysCount ;
      }
    }else {
      var today = new Date();
      var passedDays = DateUtil.getDateDiff(globalTaskLocalInfo.lastLevelFinishedDate, DateUtil.getTodayEndFormatDate((today))); //第一级任务结束，到今天过了多少天
      var finishiedDaysCount = 0;
      for (var i=0; i<finishedDaysLog.length; i++) {
        var days = DateUtil.getDateDiff(globalTaskLocalInfo.lastLevelFinishedDate, finishedDaysLog[i]);
        if (days < 12 && days >= 0 ) { //0 1 2 ... 11
          finishiedDaysCount++;
        }
      } // for end
      if (passedDays > 12) {
        if (finishiedDaysCount >= 10) {
          //完成了任务1
          globalTaskLocalInfo.lastLevelFinishedDate = DateUtil.getTodayEndFormatDate((today));
          globalTaskLocalInfo.finishedDays = 0;
          globalTaskLocalInfo.notFinishedDays = 0;
          if (parseInt(globalTaskLocalInfo.currentLevel) == 2)
            globalTaskLocalInfo.currentLevel = 3;
          if (parseInt(globalTaskLocalInfo.currentLevel) == 3)
            globalTaskLocalInfo.currentLevel = 1;

        }else {
          //任务失败
          globalTaskLocalInfo.currentLevel = 1;
          globalTaskLocalInfo.lastLevelFinishedDate = "1111-11-11 11:11:11";
          globalTaskLocalInfo.finishedDays = 0;
          globalTaskLocalInfo.notFinishedDays = 0;
        }
      }else if(passedDays == 12) {
          if (today.getHours <= 20) {
            if (finishiedDaysCount >= 10) {
              //完成了任务1
              globalTaskLocalInfo.lastLevelFinishedDate = DateUtil.getTodayEndFormatDate((today));
              globalTaskLocalInfo.finishedDays = 0;
              globalTaskLocalInfo.notFinishedDays = 0;
              if (parseInt(globalTaskLocalInfo.currentLevel) == 2)
                globalTaskLocalInfo.currentLevel = 3;
              if (parseInt(globalTaskLocalInfo.currentLevel) == 3)
                globalTaskLocalInfo.currentLevel = 1;

            }else {
              //刷新
              globalTaskLocalInfo.finishedDays = finishiedDaysCount;
              globalTaskLocalInfo.notFinishedDays = 12 -finishiedDaysCount;
            }
          }else { // 20点后
            if (finishiedDaysCount >= 10) {
              //完成了任务1
              globalTaskLocalInfo.lastLevelFinishedDate = DateUtil.getTodayEndFormatDate((today));
              globalTaskLocalInfo.finishedDays = 0;
              globalTaskLocalInfo.notFinishedDays = 0;
              if (parseInt(globalTaskLocalInfo.currentLevel) == 2)
                globalTaskLocalInfo.currentLevel = 3;
              if (parseInt(globalTaskLocalInfo.currentLevel) == 3)
                globalTaskLocalInfo.currentLevel = 1;

            }else {
              //任务失败
              globalTaskLocalInfo.currentLevel = 1;
              globalTaskLocalInfo.lastLevelFinishedDate = "1111-11-11 11:11:11";
              globalTaskLocalInfo.finishedDays = 0;
              globalTaskLocalInfo.notFinishedDays = 0;
            }
          }
      } else {//不到12天 只是刷新
        globalTaskLocalInfo.finishedDays = finishiedDaysCount;
        globalTaskLocalInfo.notFinishedDays = 12 - finishiedDaysCount;
      }
    }
    window.localStorage['globalTaskLocalInfo'] = JSON.stringify(globalTaskLocalInfo);
    $scope.globalTaskLocalInfo = globalTaskLocalInfo;
    /**************************************************************************************
     * AppCtrl
     * Modals情景弹框
     *************************************************************************************/

    //创建任务弹窗
    $ionicModal.fromTemplateUrl('templates/questNotification.html', {
      scope: $scope //这里是继承的是AppCtrl的$scope
    }).then(function (modal) {
      $scope.questNotificationModal = modal;
    });
    $scope.closeQuestNotification = function () {
      $scope.questNotificationModal.hide();
    };
    $scope.showQuestNotification = function () {
      //$scope.currentQuests.push($scope.newQuest);
      //window.localStorage['currentQuests'] = $scope.currentQuests;
      questsFactory.getNewQuest().then(function(q){
        $scope.newQuest = q;
        if($scope.newQuest){//抢到任务
          $scope.questNotificationModal.show();
        }else{
          alert('现在没有任务了，明天再来看看吧！');
        }
      });
    };
    $scope.goPurchase = function () {
      $scope.closeQuestNotification();
      window.location.href = '#/app/purchase';
    };
    $scope.acceptQuest = function() {
      questsFactory.acceptQuest($scope.newQuest.id).then(function () {
        $scope.currentQuests = JSON.parse(window.localStorage['currentQuests'] || '[]');
        $scope.closeQuestNotification();
      });

    };

//创建序列号弹窗
    $ionicModal.fromTemplateUrl('templates/serialNumber.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.serialNumberModal = modal;
    });
    $scope.closeSerialNumber = function () {
      $scope.serialNumberModal.hide();
    };
    $scope.showSerialNumber = function () {
      $scope.serialNumberModal.show();
    };
    $scope.submitNumber = function () {
      $scope.serialNumberModal.hide();
    };

//创建不可兑换积分说明弹窗
    $ionicModal.fromTemplateUrl('templates/unavailcredit.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.unavailCreditModal = modal;
      $scope.closeUnavailCredit = function () {
        $scope.unavailCreditModal.hide();
      };
      $scope.showUnavailCredit = function () {
        $scope.unavailCreditModal.show();
      };
    });

//创建新手规则说明弹窗
    $ionicModal.fromTemplateUrl('templates/rule.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.ruleModal = modal;
      $scope.closeRule = function () {
        $scope.ruleModal.hide();
      };
      $scope.showRule = function () {
        $scope.ruleModal.show();
      };
    });

//创建编辑地址弹窗
    $ionicModal.fromTemplateUrl('templates/addressmodify.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.addressModifyModal = modal;
      $scope.closeAddressModify = function () {
        $scope.addressModifyModal.hide();
      };
      $scope.showAddressModify = function () {
        $scope.addressModifyModal.show();
      };
      $scope.submitAddressModify = function () {
        //$scope.addressModifyModal.hide();
      };
      $scope.setDefault = function () {
        $scope.showAddPopup();
        console.log('confirm show');
      };
    });

//创建新建地址弹窗
    $ionicModal.fromTemplateUrl('templates/addressadd.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.addressAddModal = modal;
      $scope.closeAddressAdd = function () {
        $scope.addressAddModal.hide();
      };
      $scope.showAddressAdd = function () {
        $scope.addressAddModal.show();
      };
      $scope.submitAddressAdd = function () {
        $scope.addressAddModal.hide();
      };
    });

//选择任务小弹窗
    $scope.showTaskPopup = function () {
      var pop = $ionicPopup.show({
        templateUrl: 'templates/selectTask.html',
        title: '请选择任务',
        scope: $scope
      });
      $scope.closeTaskPopup = function () {
        pop.close();
      };
    };

    $scope.showAddPopup = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: '确认修改',
        template: '确定要修改收货地址吗？',
        scope: $scope
      });
      confirmPopup.then(function (res) {
        $scope.confirmPopup = res;
        console.log(res);
        if (res) {
          console.log('yes');
        }
        else {
          console.log('no');
        }
      });
    };

//准备登录界面
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
      //关闭登录界面
      $scope.closeLogin = function () {
        if ($scope.loginData.logged_in == false) {
          $scope.loginData.username = "未登录";
        }
        $scope.modal.hide();
      };
      //打开登录界面
      $scope.showLogin = function () {
        if ($scope.loginData.logged_in == false) {
          $scope.regModal.hide();
          $scope.modal.show();
        } else {
          $scope.toUserInfo();
        }
      };
    });
//创建注册页面
    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.regModal = modal;
      $scope.btndisabled = false;
      $scope.btnlabel = "获取验证码";
      //$scope.TIMEOUT = 60;
      $scope.wait = $scope.TIMEOUT;
      $scope.timing = function () {
        if ($scope.wait == 0) {
          $scope.btndisabled = false;
          $scope.btnlabel = "获取验证码";
          $scope.wait = $scope.TIMEOUT;
        } else {
          $scope.btnlabel = "重新发送(" + $scope.wait + ")";
          $scope.wait--;
          $timeout(function () {
              $scope.timing();
            },
            1000)
        }
      }

      //关闭注册页面
      $scope.closeRegister = function () {
        $scope.regModal.hide();
      };
      //注册
      $scope.checkRegData = function (regData) {
        return "";
      };
    });
////打开注册页面
    $scope.toRegister = function () {
      $scope.closeLogin();
      $scope.regModal.show();
    };
    $scope.toQuest = function () {
      console.log($scope.loginData.logged_in);
      if ($scope.loginData.logged_in) {
        window.location.href = "#/app/quest";
      } else {
        alert('请先登录');
      }
    };

    $scope.doRegister = function () {
      //TODO 在此检查注册信息
      $scope.regData.hint = $scope.checkRegData($scope.regData);
      if ($scope.regData.hint == '') {
        userProvider.register($scope.regData).then(function (retv) {
          $scope.loginData = $scope.regData;
          $scope.closeRegister();
          console.log('Doing reg', retv);
          $scope.doLogin();
        });
      }
      $timeout(function () {
        $scope.regData.hint = "";
      }, 2000);
    };

//进行登录
    $scope.doLogin = function () {
      //使用另一个变量username1避免侧边栏显示空白
      $scope.regData = {};
      if ($scope.loginData.username1 != '' && $scope.loginData.username == '未登录') {
        $scope.loginData.username = $scope.loginData.username1;
      }
      userProvider.login($scope.loginData).then(function (data) {
          //放入本地存储
          $scope.loginData.logged_in = true;
          window.localStorage['logged_in'] = true;
          window.localStorage['username'] = $scope.loginData.username;
          window.localStorage['password'] = $scope.loginData.password;
          //没有自定义nickName
          if (data.nickName == undefined) {
            window.localStorage['nickName'] = $scope.loginData.username;
            $scope.loginData.nickName = $scope.loginData.username;
          }else {
            window.localStorage['nickName'] = data.nickName;
            $scope.loginData.nickName = data.nickName;
          }
          //没有自定义支付宝账号
          if (data.alipayAccount == undefined) {
            window.localStorage['alipayAccount'] = "";
            $scope.loginData.alipayAccount =  "";
          }else{
            window.localStorage['alipayAccount'] = data.alipayAccount;
            $scope.loginData.alipayAccount =  data.alipayAccount;
          }

          alert("欢迎回来，" + $scope.loginData.nickName);
          //todo: refresh
          $scope.closeLogin();
        }
      );
    };
    $scope.doLogout = function () {
      //改变本地存储
      window.localStorage['logged_in'] = false;
      window.localStorage['username'] = '未登录';
      window.localStorage['uoid'] = '';
      $scope.loginData = {username: '未登录', logged_in: false, nickName: "未登录"};
      alert("已退出登录");
      //$location.path('#/app/homepage');
      $scope.currentQuests = new Array();
      $scope.finishedQuests = new Array();
      $scope.myCredit = 0;
      window.location.href = '#/app/homepage';
      AV.User.logOut();


    };
//管理个人资料
    $scope.toUserInfo = function () {
      window.location.href = "#/app/userinfo";
    };

    //创建积分兑换窗口
    $ionicModal.fromTemplateUrl('templates/cashNotification.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.cashNotificationModal = modal;
      //TODO:服务器获取当前积分
    });
    $scope.closeCashNotification = function () {
      $scope.cashNotificationModal.hide();
    };
    $scope.showCashNotification = function () {
      //if
      //loginData.alipayAccount = window.localStorage['apliapyAccount'];
      if ($scope.myCredit < 10) {
        alert("您的积分不到5， 赶快去接任务，拍照吧！");
      }else {
        if ($scope.loginData.alipayAccount == "" ) {
          alert("快进入个人资料里填写自己的支付宝账号吧！");
        }else {
          $scope.cashNotificationModal.show();
        }
      }
    };

    /**************************************************************************************
     * AppCtrl函数
     *
     *************************************************************************************/
      //发送验证码,实质是把用户数据注册到数据库，并发送验证码。
    $scope.sendVCode = function () {
      $scope.btndisabled = true;
      $scope.wait = $scope.TIMEOUT;
      $scope.timing();
      $scope.user = new AV.User();
      $scope.user.setMobilePhoneNumber($scope.regData.username);
      $scope.user.set('username', $scope.regData.username);
      $scope.user.set('salt', $scope.regData.username);
      $scope.user.set('password', $scope.regData.password);
      $scope.user.signUp(null, {
        success: function (user) {
          alert("验证码已发送！");
        },
        error: function (user, error) {
          // 失败了
          alert("Error: " + JSON.stringify(err));
        }
      });
      AV.User.requestMobilePhoneVerify($scope.regData.username).then(function () {
        alert("验证码已发送至" + $scope.regData.username);
      }, function (err) {
        alert("发送失败" + JSON.stringify(err));
      });

    };
    //发送兑换请求  credit - 减少
    $scope.sendCashRequest = function () {
      //TODO:向服务器发送兑换请求
      creditProvider.uploadCashRequest($scope.creditToCash).then(function (result) {
        alert("已经提交兑换申请，24小时内到账！");
        $scope.myCredit = (parseInt($scope.myCredit) - parseInt($scope.creditToCash)).toString();
        window.localStorage['myCredit'] = $scope.myCredit;
        $scope.totalCreditToCash = (parseInt($scope.totalCreditToCash ) + parseInt($scope.creditToCash)).toString();
        window.localStorage['totalCreditToCash'] = $scope.creditToCash;
        $scope.cashNotificationModal.hide();
      });
    };
  //点击拍照选择任务后
    $scope.takePhoto = function (taskId) {
      var Task = AV.Object.extend("Task");
      var query = new AV.Query(Task);
      query.get(taskId, {
        success: function(task) {
          // 成功获得实例
          photoProvider.uploadPhoto(task).then(
            function(pic){
              $scope.pics = JSON.parse(window.localStorage['pics'] || '[]');
              $scope.pics.unshift(pic);
              window.localStorage['pics'] = JSON.stringify($scope.pics);
              $scope.closeTaskPopup();
            }, function(error) {
              alert("error:" + error.message);
            });

        },
        error: function(error) {
          // 失败了.
        }
      });
    };


  })//AppCtrl 结束



//2 图片管理-控制器
  .controller('piclistCtrl', function ($scope, $state, $ionicHistory) {
    $ionicHistory.currentHistoryId();
    //todo:这里用来干什么
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;
    $scope.showInfo = function ($scope) {
      window.location.href = "#/app/picinfo";
      console.log(window.location.href);
    };
    //$scope.gotoAlbum = function () {
    //  //window.location.href = "#/app/picmanage";
    //  //$state.go('app.picmanage');
    //  //$ionicHistory.currentHistoryId();
    //
    //};

  })

//2 图片管理-控制器
  .controller('picdetailCtrl', function ($scope, $state, $ionicHistory,$ionicViewService) {
    $ionicHistory.currentHistoryId();
    $scope.gotoAlbum = function () {
      //window.location.href = "#/app/picmanage";
      $state.go('app.picmanage');
      $ionicHistory.currentHistoryId();


    };
    //$ionicViewService.nextViewOptions({
    //  disableBack: true
    //});

//// Go back to home
//    $location.path('/');


  })


//3 任务管理-控制器
  .controller('questCtrl', function ($scope, questsFactory, DateUtil) {

    $scope.showGoldTaskBonus = function (questId) {
      var currentQuests = new Array();
      currentQuests = JSON.parse(window.localStorage['currentQuests'] || '[]');
      var refreshedCurrentQuests = new Array();
      for (var i=0; i<currentQuests.length; i ++) {
        if(currentQuests[i].id == questId) {
          if (parseInt(currentQuests[i].goldTaskStatus) == 1) {
            alert("恭喜你获得" + currentQuests[i].goldCount + "衣笔！赶快去积分管理查看吧！");
            currentQuests[i].goldTaskStatus = 2; //领取衣笔奖励后 改变衣笔任务状态
            var goldsLog = new Array();
            var goldsLog = JSON.parse(window.localStorage['goldsLog'] || '[]');
            var gold = {goldCount:currentQuests[i].goldCount, overDate:DateUtil.getThreeMonthsLater(new Date())};
            goldsLog.push(gold);
            window.localStorage['goldsLog'] = JSON.stringify(goldsLog);
          } else if (parseInt(currentQuests[i].goldTaskStatus) == 2) {
            alert("你已经领取过奖励了哦~");
          }
          refreshedCurrentQuests.push(currentQuests[i]);
        }
      }
      window.localStorage['currentQuests'] = JSON.stringify(refreshedCurrentQuests);
    };

  })
//4 主页控制器
  .controller('HomePageCtrl', function ($scope, $http, $ionicLoading, $timeout, Camera, questsFactory, DateUtil, AVObjects, creditProvider, photoProvider) {

    if(window.localStorage['logged_in']){

    }
    $scope.moreTasks = function () {
      window.location.href = "#/app/quest";
    };
    $scope.creditDetails = function () {
      window.location.href = "#/app/creditpage";
    };
    $scope.goToPic = function () {
      window.location.href = "#/app/picmanage";
    };
    $scope.goToRule = function () {
      window.location.href = "#/app/takePhotoRule";
    };
    $scope.doRefresh = function () {
      /*$http.get('/new-items')
       .success(function(newItems) {
       $scope.items = newItems;
       })
       .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
       });*/
      $scope.$broadcast('scroll.refreshComplete');
    };


//提醒积分已经放入用户的账户中
    $scope.creditIn = function () {
      //放积分
      var bonus;
      if ($scope.globalTaskLocalInfo.currentLevel == 1)
           bonus = 10;
      else if ($scope.globalTaskLocalInfo.currentLevel == 2)
                bonus = 20;
      else if ($scope.globalTaskLocalInfo.currentLevel == 2)
                bonus = 30;

      $ionicLoading.show({
        template: bonus +'积分已放入您的账户！'
      });
      $timeout(function () {
         $ionicLoading.hide(); //由于某种原因3秒后关闭弹出
      }, 1500);
      $scope.packageHide = true;
    };
    $scope.test = function() {

      //var device = $cordovaDevice.getDevice();
      //var d = goldProvider.getDevice();

      ////调用云函数，云函数接受JSON参数， 返回任务数据类型
      //AV.Cloud.run('hello', {request:"43"}, {
      //  success: function(result) {
      //    // result is 'Hello world!'
      //    alert(result);
      //  },
      //  error: function(error) {
      //    alert(error.message);
      //  }
      //});
    };
})

  //5
  .controller('userInfoCtrl', function ($scope, userProvider) {
    $scope.userInfoCtrl = "userInfoCtrl";
    $scope.logout = function () {
      console.log("退出");//TODO 换成某种手机上能显示的东西
      $scope.doLogout();
    };
    $scope.toEditPwd = function () {
      window.location.href = "#/app/modifyPwd";
    };
    $scope.editInfo = function () {
      window.location.href = "#/app/modifyinfo";
    };
  })
  //6
  .controller('modPwdCtrl', function ($scope, userProvider, AVObjects) {
    $scope.mp = {};
    $scope.modPwd = function () {
      if($scope.mp.newPwd != $scope.mp.confirmPwd){
        alert("两次输入密码不一致");
        return;
      }
      var me = new AVObjects.User();
      me.id = window.localStorage['uoid'];
      userProvider.login({
        username:$scope.loginData.username,
        password:$scope.mp.oldPwd
      }).then(function(data){
          $scope.loginData.logged_in = true;
          window.localStorage['logged_in'] = true;
          window.localStorage['username'] = $scope.loginData.username;
          window.localStorage['nickName'] = data.nickName;
          $scope.loginData.nickName = data.nickName;
          me.updatePassword($scope.mp.oldPwd, $scope.mp.newPwd, {
            sucess: function () {
            },
            error: function (user, err) {
              console.log(JSON.stringify(err));
            }
          }).then(function(){
            window.localStorage['password'] = $scope.mp.newPwd;
            console.log('修改密码成功');
            $scope.mp = {};
            window.location.href = "#/app/userinfo";
          });
        }
      );
    };
  })
  //7
  .controller('modInfoCtrl', function ($scope, userProvider, AVObjects) {
    $scope.userinfo = $scope.loginData;
    $scope.submitEdit = function () {
      window.location.href = "#/app/userinfo";
      var me = new AVObjects.User();
      me.id = window.localStorage['uoid'];
      userProvider.login({
        username:$scope.loginData.username,
        password:window.localStorage['password']
      }).then(function(data){
          me.set('nickName',$scope.userinfo.nickName);
          me.set('alipayAccount',$scope.userinfo.alipayAccount);
          me.save().then(function(){
            window.localStorage['nickName'] = $scope.userinfo.nickName;
            $scope.loginData.nickName = $scope.userinfo.nickName;
            window.localStorage['alipayAccount'] = $scope.userinfo.alipayAccount;
            $scope.loginData.alipayAccount = $scope.userinfo.alipayAccount;
          }, function (error) {
            alert(error.message);
          });
        }
      );
    };
  })
  //8
  .controller('loginCtrl', function ($scope, userProvider, AVObjects) {
    $scope.loginCtrl = "loginCtrl";
  })
  //9
  .controller('creditCtrl', function ($scope, AVObjects, creditProvider) {
    $scope.goldsLog = JSON.parse(window.localStorage['goldsLog'] || '[]');
    $scope.golds = creditProvider.getGolds();
  })




