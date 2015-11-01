angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, userProvider, questsFactory) {
//！——全局变量和本地存储的数据
    $scope.loginData = {username: '未登录', logged_in: false, nickName: "未登录"};
    var currentuser = AV.User.current();
    if (window.localStorage['username'] != '未登录' && window.localStorage['username'] != '') {
      $scope.loginData.username = window.localStorage['username'];
      $scope.loginData.logged_in = window.localStorage['logged_in'];
      $scope.loginData.password = window.localStorage['password'];
      $scope.loginData.nickName = window.localStorage['nickName'];
    }

    $scope.regData = {};
//创建积分兑换窗口
    $ionicModal.fromTemplateUrl('templates/cashNotification.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.cashNotificationModal = modal;
      //TODO:服务器获取当前积分
      $scope.payData = {username: "", creditsToRedeem: 100,};
    });
    $scope.redeemCredits = function () {
      //TODO:向服务器发送兑换请求
      alert("兑换积分");
      $scope.cashNotificationModal.hide();
    };
    $scope.closeCashNotification = function () {
      $scope.cashNotificationModal.hide();
    };
    $scope.showCashNotification = function () {
      $scope.cashNotificationModal.show();
    };

//创建任务弹窗
    $ionicModal.fromTemplateUrl('templates/questNotification.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.questNotificationModal = modal;
    });
    $scope.showQuestNotification = function () {
      if (window.localStorage['logged_in'] && !$scope.loginData.full) {
        questsFactory.getNewQuest().then(function (q) {
          $scope.newQuest = q;
          console.log("applying" + q);
          if ($scope.newQuest) {//抢到任务
            questsFactory.apply(q.id);
            $scope.questNotificationModal.show();
          } else {
            alert('现在没有任务了，明天再来看看吧！');
          }
        });
      } else if ($scope.loginData.full) {
        alert("你的任务列表已经满了！请先完成任务");
      } else {
        alert("请先登录！");

      }
    };
    $scope.closeQuestNotification = function () {
      questsFactory.cancelApply($scope.newQuest.id);
      $scope.questNotificationModal.hide();
    };
    $scope.goPurchase = function () {
      $scope.questNotificationModal.hide();
      window.location.href = '#/app/purchase';
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

    $scope.selected = false;
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
      $scope.TIMEOUT = 60;
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
            alert("varifying Error: " + JSON.stringify(err));
          }
        });
        AV.User.requestMobilePhoneVerify($scope.regData.username).then(function () {
          alert("验证码已发送至" + $scope.regData.username);
        }, function (err) {
          alert("发送失败" + JSON.stringify(err));
        });

      };
      //关闭注册页面
      $scope.closeRegister = function () {
        $scope.regModal.hide();
      };
      //注册
      $scope.checkRegData = function (regData) {
        return "";
      };
    });
//打开注册页面
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
          window.localStorage['nickName'] = data.nickName;
          $scope.loginData.nickName = data.nickName;
          alert("欢迎回来，" + $scope.loginData.nickName);
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
      window.location.href = '#/app/homepage';
      AV.User.logOut();
    };
//管理个人资料
    $scope.toUserInfo = function () {
      window.location.href = "#/app/userinfo";
    };

  })

//图片管理-控制器
  .controller('piclistCtrl', function ($scope) {
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;
    $scope.showInfo = function ($scope) {
      window.location.href = "#/app/picinfo";
      console.log(window.location.href);
    };
    $scope.gotoAlbum = function () {
      window.location.href = "#/app/picmanage";
    };

  })

//任务管理-控制器
  .controller('questCtrl', function ($scope, $http, $timeout, questsFactory, DateUtil) {
    questsFactory.getQuests().then(function (data) {
        $scope.currentQuests = new Array();
        $scope.finishedQuests = new Array();
        var now = DateUtil.getNowFormatDate();
        data.forEach(
          function (q) {
            var limit = DateUtil.getFormatDate(eval(q['endTime']));
            if (now < limit) {//未超时
              q.endTime = limit.replace(/T/g, " ").replace(/"/g, "").substring(0, 19);
              questsFactory.getCurrentCreditOfQuest(q.id).then(
                function (credit) {
                  q.currentCredit = credit;
                  q.done = 100 * q.currentCredit / q.creditTotal;
                  q.left = 100 - q.done;
                }
              );
              $scope.currentQuests.push(q);
            } else {//已超时
              console.log("1 finished");
              q.endTime = limit.replace(/T/g, " ").replace(/"/g, "").substring(0, 19);
              $scope.finishedQuests.push(q);
            }
          }
        );
      }
    );
  })


//主页控制器

  .controller('HomePageCtrl', function ($scope, $http, Camera, $ionicLoading, $timeout, questsFactory, DateUtil) {
    $scope.hpQuest = {title: "还没有任务，赶快开始赚钱吧！"};
    if (window.localStorage['logged_in']) {
      questsFactory.getQuests().then(function (data) {
        $scope.hpQuests = [];
        var now = JSON.stringify(new Date()).replace(/[":A-Z.-]/g, "");
        data.forEach(
          function (q) {
            var tt = DateUtil.getFormatDate(eval(q['endTime']));
            var limit = tt.replace(/[":A-Z.-]/g, "");
            if (now < limit) {//未超时
              q.endTime = tt.replace(/T/g, " ").replace(/"/g, "").substring(0, 10);
              questsFactory.getCurrentCreditOfQuest(q.id).then(
                function (credit) {
                  q.currentCredit = credit;
                  q.done = 100 * q.currentCredit / q.creditTotal;
                  q.left = 100 - q.done;
                }
              );
              $scope.hpQuests.push(q);
            }
            if (typeof($scope.loginData) == 'undefined') {
              $scope.loginData = {};
            }
            $scope.loginData.quests = $scope.hpQuests;
            if ($scope.hpQuests.length >= 2) {
              $scope.loginData.full = true;
            }
          }
        );
        $scope.hpQuest = $scope.hpQuests[0];
      });
    }
    $scope.pics = [
      {id: 0, title: "安踏拍照", description: "11111111111111111", date: "2015年10月20日", img: "img/ionic.png"},
      {id: 1, title: "安踏拍照", description: "11111111111111111", date: "2015年10月20日", img: "img/thumb.jpg"},
      {id: 2, title: "安踏拍照", description: "11111111111111111", date: "2015年10月20日", img: "img/ionic.png"},
    ];
    $scope.moreTasks = function () {
      window.location.href = "#/app/quest";
    };
    $scope.creditDetails = function () {
      window.location.href = "#/app/creditpage";
    };
    $scope.goToPic = function () {
      window.location.href = "#/app/picmanage";
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
    $scope.takePhoto = function () {
      getPhoto();
      getLocation();
    };
//提醒积分已经放入用户的账户中
    $scope.creditIn = function () {
      //放积分
      $ionicLoading.show({
        template: '10积分已放入您的账户！'
      });
      $timeout(function () {
        // $ionicLoading.hide(); //由于某种原因3秒后关闭弹出
      }, 1500);
      $scope.packageHide = true;
    };


  })

  .controller('userInfoCtrl', function ($scope, userProvider) {
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

  .controller('modPwdCtrl', function ($scope, userProvider, AVObjects) {
    $scope.mp = {};
    $scope.modPwd = function () {
      if ($scope.mp.newPwd != $scope.mp.confirmPwd) {
        alert("两次输入密码不一致");
        return;
      }
      var me = new AVObjects.User();
      me.id = window.localStorage['uoid'];
      userProvider.login({
        username: $scope.loginData.username,
        password: $scope.mp.oldPwd
      }).then(function (data) {
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
          }).then(function () {
            window.localStorage['password'] = $scope.mp.newPwd;
            console.log('修改密码成功');
            $scope.mp = {};
            window.location.href = "#/app/userinfo";
          });
        }
      );
    };
  })
  .controller('modInfoCtrl', function ($scope, userProvider, AVObjects) {
    $scope.userinfo = $scope.loginData;
    $scope.submitEdit = function () {
      window.location.href = "#/app/userinfo";
      var me = new AVObjects.User();
      me.id = window.localStorage['uoid'];
      userProvider.login({
        username: $scope.loginData.username,
        password: window.localStorage['password']
      }).then(function (data) {
          me.set('nickName', $scope.userinfo.nickName);
          me.set('alipayAccount', $scope.userinfo.alipayAccount);
          me.save().then(function () {
            window.localStorage['nickName'] = $scope.userinfo.nickName;
            $scope.loginData.nickName = $scope.userinfo.nickName;
          });

        }
      );
    };

  })
