angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $timeout, $http) {
//
$scope.loginData = {username:'未登录',logged_in:false};
if(window.localStorage['username'] != '未登录'&& window.localStorage['username'] != ''){
	$scope.loginData.username = window.localStorage['username'];
	$scope.loginData.logged_in = window.localStorage['logged_in'];
}

$scope.regData={};
	$ionicModal.fromTemplateUrl('templates/cashNotification.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.cashNotificationModal = modal;
	});
	$scope.closeCashNotification = function() {
		$scope.cashNotificationModal.hide();
	};
	$scope.showCashNotification = function() {
		$scope.cashNotificationModal.show();
	};

//创建任务弹窗
$ionicModal.fromTemplateUrl('templates/questNotification.html', {
	scope: $scope
	}).then(function(modal) {
	$scope.questNotificationModal = modal;
	});
	$scope.closeQuestNotification = function() {
	$scope.questNotificationModal.hide();
	};
	$scope.showQuestNotification = function() {
		//获取任务数据
		$scope.newQuest = {name:"拍什么拍",endtime:"2014-12-30",info:"完成十张照片",totalCredit:20};
		$scope.questNotificationModal.show();
	};
	$scope.goPurchase = function() {
		$scope.closeQuestNotification();
		window.location.href='#/app/purchase';
	};

//创建序列号弹窗
$ionicModal.fromTemplateUrl('templates/serialNumber.html',{
	scope: $scope
	}).then(function(modal) {
	$scope.serialNumberModal = modal;
	});
	$scope.closeSerialNumber = function() {
	$scope.serialNumberModal.hide();
	};
	$scope.showSerialNumber = function() {
	$scope.serialNumberModal.show();
	};
	$scope.submitNumber = function() {
	$scope.serialNumberModal.hide();
	};

//创建不可兑换积分说明弹窗
$ionicModal.fromTemplateUrl('templates/unavailcredit.html',{
	scope: $scope
}).then(function(modal){
	$scope.unavailCreditModal = modal;
});
	$scope.closeUnavailCredit = function() {
	$scope.unavailCreditModal.hide();
	};
	$scope.showUnavailCredit = function() {
	$scope.unavailCreditModal.show();
	};

//创建新手规则说明弹窗
$ionicModal.fromTemplateUrl('templates/rule.html',{
	scope: $scope
}).then(function(modal){
	$scope.ruleModal = modal;
});
	$scope.closeRule = function() {
	$scope.ruleModal.hide();
	};
	$scope.showRule = function() {
	$scope.ruleModal.show();
	};

//创建编辑地址弹窗
$ionicModal.fromTemplateUrl('templates/addressmodify.html',{
	scope: $scope
}).then(function(modal){
	$scope.addressModifyModal = modal;
});
	$scope.closeAddressModify = function() {
	$scope.addressModifyModal.hide();
	};
	$scope.showAddressModify = function() {
	$scope.addressModifyModal.show();
	};
	$scope.submitAddressModify = function() {
	//$scope.addressModifyModal.hide();
	};
	$scope.setDefault = function() {
	$scope.showAddPopup();
	console.log('confirm show');
	};

//创建新建地址弹窗
$ionicModal.fromTemplateUrl('templates/addressadd.html',{
	scope: $scope
}).then(function(modal){
	$scope.addressAddModal = modal;
});
	$scope.closeAddressAdd = function() {
	$scope.addressAddModal.hide();
	};
	$scope.showAddressAdd = function() {
	$scope.addressAddModal.show();
	};
	$scope.submitAddressAdd = function() {
	$scope.addressAddModal.hide();
	};

//选择任务小弹窗
$scope.showTaskPopup = function() {
	var pop = $ionicPopup.show({
	templateUrl: 'templates/selectTask.html',
	title: '请选择任务',
	scope: $scope
	});
	$scope.closeTaskPopup = function() {
		pop.close();
	};
};

$scope.showAddPopup = function() {
	var confirmPopup = $ionicPopup.confirm({
	title: '确认修改',
	template: '确定要修改收货地址吗？',
	scope: $scope
	});
	 confirmPopup.then(function(res) {
	 $scope.confirmPopup = res;
	 console.log(res);
	 if(res) {
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
}).then(function(modal) {
	$scope.modal = modal;
	//关闭登录界面
	$scope.closeLogin = function() {
		if($scope.loginData.logged_in == false){
			$scope.loginData.username="未登录";
		}
		$scope.modal.hide();
	};
	//打开登录界面
	$scope.showLogin = function() {
		if($scope.loginData.logged_in == false){
			$scope.modal.show();
		}else{
			//已经登录了,先放个退出吧，以后改成别的功能
			$scope.doLogout();
			$scope.loginData = {username:'未登录',logged_in:false};
		}
	};
});
//创建注册页面
$ionicModal.fromTemplateUrl('templates/register.html', {
	scope: $scope
}).then(function(modal) {
	$scope.regModal = modal;//发送验证码
	$scope.sendVCode = function() {
		console.log('should send VCode');
	};
	//关闭注册页面
	$scope.closeRegister = function() {
		$scope.regModal.hide();
	};
	//注册
	$scope.checkRegData = function(regData){
		if(regData.password == '123456'){
			return "密码过于简单！";
		} else {
			return "";
		}
	};
});
//打开注册页面
	$scope.toRegister = function(){
		console.log('should go to register page');
		$scope.closeLogin();
		$scope.regModal.show();
	};

	$scope.doRegister = function(){
		//TODO 在此检查注册信息
		$scope.regData.hint = $scope.checkRegData($scope.regData);
		if($scope.regData.hint == ''){
			console.log('should finish register and do log in');
			alert('should finish register and do log in');
			$scope.loginData = $scope.regData;
			$scope.closeRegister();
			console.log('Doing reg', $scope.regData);
			$scope.doLogin();
		}
	$timeout(function() {
		$scope.regData.hint="";
	}, 2000);
	};

//进行登录
$scope.doLogin = function() {
	if($scope.loginData.username1 != '' && $scope.loginData.username == '未登录'){//使用另一个变量username1避免侧边栏显示空白
		$scope.loginData.username = $scope.loginData.username1;
	};
	$scope.loginData.logged_in = true;
	window.localStorage['logged_in'] = true;
	window.localStorage['username'] = $scope.loginData.username;
	console.log('Doing login', $scope.loginData);
	$scope.closeLogin();
};
$scope.doLogout = function() {
	$scope.loginData.logged_in = false;
	window.localStorage['logged_in'] = false;
	window.localStorage['username'] = '未登录';
};
//管理个人资料
$scope.editInfo = function() {
  window.location.href="#/app/modifyinfo";
};
$scope.returnInfo = function() {
  window.location.href="#/app/userinfo";
};
$scope.submitEdit = function() {
  window.location.href="#/app/userinfo";
};
$scope.editPassword = function() {
  window.location.href="#/app/modifyPwd";
};

})

//图片管理-控制器
.controller('piclistCtrl', function($scope,$location) {
 $scope.shouldShowDelete = false;
 $scope.shouldShowReorder = false;
 $scope.listCanSwipe = true;
 $scope.showInfo = function($scope){
	window.location.href="#/app/picinfo";
	console.log(window.location.href);
};
 $scope.gotoAlbum = function() {
	 window.location.href="#/app/picmanage";
 };

})

//任务管理-控制器
.controller('questCtrl', function($scope, $http, $timeout) {
//假设此处取到了数据$http.get
$scope.currentQuest = {name:"耐克拍照",endtime:"2015-12-30",info:"完成十张照片",totalCredit:20,currentCredit:19};
$scope.finishedQuests = [
	{name:"耐克拍照",endtime:"2014-12-30",info:"完成十张照片",totalCredit:20,currentCredit:17,done:100*17/20,left:100-100*17/20},
	{name:"安踏拍照",endtime:"2014-12-31",info:"完成七张照片",totalCredit:21,currentCredit:14,done:100*14/21,left:100-100*14/21},
];
//对数据进行处理，加上done和left两条，用来显示进度条
$scope.progress = {
	done:100*$scope.currentQuest.currentCredit/$scope.currentQuest.totalCredit,
	left:100 - 100*$scope.currentQuest.currentCredit/$scope.currentQuest.totalCredit
};

$scope.currentQuest.getProgress = function(current,total){
	return 100*current/total;
};
$scope.currentQuest.getProgressLeft = function(current,total){
	return 100 - 100*current/total;
};
})


//主页控制器
.controller('HomePageCtrl',function($scope, Camera, Pictures,$ionicLoading,$timeout){//定义本个ctrl的局部数据和方法, 主体是个函数

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
	Camera.getPhoto();
	Camera.getLocation();
};
//提醒积分已经放入用户的账户中
$scope.creditIn = function() {
  //放积分
  $ionicLoading.show({
    template: '10积分已放入您的账户！'
  });
  $timeout(function() {
    $ionicLoading.hide(); //由于某种原因3秒后关闭弹出
  }, 1500);
  $scope.packageHide = true;
};
$scope.test = function() {
	// 	// 该语句应该只声明一次
	var Post = AV.Object.extend("Post");
	var deleteObjects = {};
	var query = new AV.Query(Post);
	query.get("5630947d00b0023cde9cb5dc", {
		success: function(post) {
			// post.set('content', '每个 JavaScript 程序员必备的 8 个开发工具: http://buzzorange.com/techorange/2015/03/03/9-javascript-ide-editor/');
   //    		post.save();
   			deleteObjects.add(post)
		},
		error: function(post, error) {
			alert("fail");
		}
	});
	query.get("5630947060b20259f8d5a2f6", {
		success: function(post) {
			// post.set('content', '每个 JavaScript 程序员必备的 8 个开发工具: http://buzzorange.com/techorange/2015/03/03/9-javascript-ide-editor/');
   //    		post.save();
   			deleteObjects.add(post)
		},
		error: function(post, error) {
			alert("fail");
		}
	});
	AV.Object.destroyAll(deleteObjects);
};

})

.controller('loginCtrl',function($scope){
  })