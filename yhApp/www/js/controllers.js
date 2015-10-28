angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $timeout) {
//
$scope.loginData = {username:'未登录',logged_in:false};
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
//准备数据
$ionicModal.fromTemplateUrl('templates/login.html', {
	scope: $scope
}).then(function(modal) {
	$scope.modal = modal;
});
//$scope.regData={};
//关闭登录界面
$scope.closeLogin = function() {
	window.location.href = "#/app/homepage";
};
//打开登录界面
$scope.login = function() {
  // window.location.href = "#/app/login";
	// if($scope.loginData.logged_in == false){
	// 	$scope.loginData.username="未登录";
	// }
	// $scope.modal.hide();
  if($scope.loginData.logged_in == false){
    $scope.loginData.username="";
    $scope.closeRegister();
    $scope.modal.show();
  }else{
    //已经登录了,先放个退出吧，以后改成别的功能
    window.location.href="";
    $scope.loginData = {username:'未登录',logged_in:false};
  }
};
//创建注册页面
$ionicModal.fromTemplateUrl('templates/register.html', {
	scope: $scope
}).then(function(modal) {
	$scope.regModal = modal;
});
//关闭注册页面
$scope.closeRegister = function() {
	$scope.regModal.hide();
};
//打开注册页面
	$scope.toRegister = function(){
		console.log('should go to register page');
		$scope.closeLogin();
		$scope.regModal.show();
	};
//注册
	$scope.checkRegData = function(regData){
		if(regData.password == '123456'){
			return "密码过于简单！";
		} else {
			return "";
		}
	};
	$scope.doRegister = function(){
		//TODO 在此检查注册信息
		$scope.regData.hint = $scope.checkRegData($scope.regData);
		if($scope.regData.hint == ''){
			console.log('should finish register and do log in');
			alert('should finish register and do log in');
			$scope.loginData = $scope.regData;
			$scope.closeRegister();
			$scope.doLogin();
		}
	$timeout(function() {
		$scope.regData.hint="";
	}, 2000);
	};
//进行登录
$scope.doLogin = function() {
//	$rootScope.loginData = $scope.regData;
	$scope.loginData.logged_in = true;
	console.log('Doing login', $scope.loginData);
	$timeout(function() {
	  $scope.closeLogin();
	}, 1000);
};

//发送验证码
$scope.sendVCode = function() {
	console.log('should send VCode');

};
    $scope.btnShow = true;

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
$scope.takePhoto = function() {
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

	// // 创建该类的一个实例
	// var post = new Post();
	// post.save({
	// 	content: "每个 JavaScript 程序员必备的 8 个开发工具",
 //  		pubUser: "LeanCloud官方客服",
 //  		pubTimestamp: 1435541999
	// }, {
	// 	success: function(post) {
	// 		// 成功保存之后，执行其他逻辑.
 //    		alert('New object created with objectId: ' + post.id);
	// 	},
	// 	error: function(psot, error) {
	// 		// 失败之后执行其他逻辑
 //   			// error 是 AV.Error 的实例，包含有错误码和描述信息.
 //    		alert('Failed to create new object, with error message: ' + error.message);
	// 	}
	// });

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
