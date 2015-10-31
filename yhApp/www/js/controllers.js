angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, userProvider) {
//！——全局变量和本地存储的数据
    $scope.loginData = {username: '未登录', logged_in: false};
    if (window.localStorage['username'] != '未登录' && window.localStorage['username'] != '') {
        $scope.loginData.username = window.localStorage['username'];
        $scope.loginData.logged_in = window.localStorage['logged_in'];
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
    $scope.closeQuestNotification = function () {
        $scope.questNotificationModal.hide();
    };
    $scope.showQuestNotification = function () {
        //TODO:获取任务数据
        $scope.newQuest = {name: "拍什么拍", endtime: "2014-12-30", info: "完成十张照片", totalCredit: 20};
        $scope.questNotificationModal.show();
    };
    $scope.goPurchase = function () {
        $scope.closeQuestNotification();
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
                //已经登录了,先放个退出吧，可以改成别的功能
                $scope.doLogout();
                $scope.loginData = {username: '未登录', logged_in: false};
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
            $scope.user.set('username',$scope.regData.username);
            $scope.user.set('password',$scope.regData.password);
            $scope.user.signUp(null, {
                success: function(user) {
                    // 注册成功，可以使用了.
                },
                error: function(user, error) {
                    // 失败了
                    alert("Error: " +JSON.stringify(err));
                }
            });
            AV.User.requestMobilePhoneVerify($scope.regData.username).then(function () {
                alert("验证码已发送至" + $scope.regData.username);
            }, function (err) {
                alert("发送失败"+JSON.stringify(err));
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

    $scope.doRegister = function () {
        //TODO 在此检查注册信息
        $scope.regData.hint = $scope.checkRegData($scope.regData);
        if ($scope.regData.hint == '') {
            userProvider.register($scope.regData).then(function () {
                $scope.loginData = $scope.regData;
                $scope.closeRegister();
                console.log('Doing reg', $scope.regData);
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
        userProvider.login($scope.loginData).then(function () {
                //放入本地存储
                $scope.loginData.logged_in = true;
                window.localStorage['logged_in'] = true;
                window.localStorage['username'] = $scope.loginData.username;
                console.log('Doing login', $scope.loginData);
                alert("欢迎回来，" + $scope.loginData.username);
                $scope.closeLogin();
            }
        );
    };
    $scope.doLogout = function () {
        //改变本地存储
        $scope.loginData.logged_in = false;
        window.localStorage['logged_in'] = false;
        window.localStorage['username'] = '未登录';
        alert("已退出登录");
    };
//管理个人资料
    $scope.editInfo = function () {
        window.location.href = "#/app/modifyinfo";
    };
    $scope.returnInfo = function () {
        window.location.href = "#/app/userinfo";
    };
    $scope.submitEdit = function () {
        window.location.href = "#/app/userinfo";
    };
    $scope.editPassword = function () {
        window.location.href = "#/app/modifyPwd";
    };

})

//图片管理-控制器
.controller('piclistCtrl', function ($scope, $location) {
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
.controller('questCtrl', function ($scope, $http, $timeout, questsFactory) {
    $scope.currentQuest = questsFactory.getCurrentQuest();
    questsFactory.getTask().then(function (data) {
            $scope.task = JSON.stringify(data);
            $scope.finishedQuests = data;
            //$scope.finishedQuests = questsFactory.getFinishedQuests();
        }
    );
})


//主页控制器

.controller('HomePageCtrl',function($scope,$http,Camera,$ionicLoading,$timeout){
$scope.pics = [
	{ id: 0,title:"安踏拍照",description:"11111111111111111",date:"2015年10月20日",img:"img/ionic.png" },
	{ id: 1,title:"安踏拍照",description:"11111111111111111",date:"2015年10月20日",img:"img/thumb.jpg" },
	{ id: 2,title:"安踏拍照",description:"11111111111111111",date:"2015年10月20日",img:"img/ionic.png" },
 ];
$scope.moreTasks = function() {
	window.location.href="#/app/quest";
};
$scope.creditDetails = function() {
	window.location.href="#/app/creditpage";
};
$scope.goToPic = function() {
	window.location.href="#/app/picmanage";
};
$scope.doRefresh = function() {
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
$scope.takePhoto = function(){
	getPhoto();
	getLocation();
};
//提醒积分已经放入用户的账户中
$scope.creditIn = function() {
  //放积分
  $ionicLoading.show({
    template: '10积分已放入您的账户！'
  });
  $timeout(function() {
    // $ionicLoading.hide(); //由于某种原因3秒后关闭弹出
  }, 1500);
  $scope.packageHide = true;
};
$scope.test = function() {
	// localstoragetest.saveUser();
	localStorageService.set("password", "ccccc");
	alert(localStorageService.get("username"));
	alert(localStorageService.get("password"));

};

$scope.test1 = function() {
	alert(localStorageService.get("password"));

	// 	// 该语句应该只声明一次
	AV.initialize('kTlCF8Aiq0rADHoFB1knF7US', 'x4CsV8ctJ0TUaDB67uDHSofS');
	var Post = AV.Object.extend("Post");

	// 创建该类的一个实例
	var post = new Post();
	post.save({
		content: "每个 JavaScript 程序员必备的 8 个开发工具",
  		pubUser: "LeanCloud官方客服",
  		pubTimestamp: 1435541999
	}, {
		success: function(post) {
			// 成功保存之后，执行其他逻辑.
    		alert('New object created with objectId: ' + post.id);
		},
		error: function(psot, error) {
			// 失败之后执行其他逻辑
   			// error 是 AV.Error 的实例，包含有错误码和描述信息.
    		alert('Failed to create new object, with error message: ' + error.message);
		}
	});

	
};

$scope.hu1 = function() {
	alert("hu2: " + hu2());
};

function hu2() {
	AV.initialize('kTlCF8Aiq0rADHoFB1knF7US', 'x4CsV8ctJ0TUaDB67uDHSofS');
	var Post = AV.Object.extend("Post");
	var post = new Post();
};

})
