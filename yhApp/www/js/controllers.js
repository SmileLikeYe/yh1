angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $timeout) {

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
      console.log('selected');
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
$scope.selected = false;
//准备数据
$scope.loginData = {};
$scope.regData={};
$ionicModal.fromTemplateUrl('templates/login.html', {
	scope: $scope
}).then(function(modal) {
	$scope.modal = modal;
});
//关闭登录界面
$scope.closeLogin = function() {
	$scope.modal.hide();
};
//打开登录界面
$scope.login = function() {
	$scope.modal.show();
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
	$scope.doRegister = function(){
		//TODO 在此检查注册信息

			$scope.regData.hint="";
		if(1){
			$scope.regData.hint="尚未实现";
		}else{
			console.log('should finish register and do log in');
			$scope.closeRegister();
			$scope.doLogin();
		}
	};
//进行登录
$scope.doLogin = function() {
	console.log('Doing login', $scope.loginData);
	$timeout(function() {
	  $scope.closeLogin();
	}, 1000);
};

//发送验证码
$scope.sendVCode = function() {
	console.log('should send VCode');

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
  $scope.pics = [
    { id: 0,title:"安踏拍照",description:"11111111111111111",date:"2015年10月20日",img:"img/ios7-png/idea-vector.png" },
    { id: 1,title:"安踏拍照",description:"11111111111111111",date:"2015年10月20日",img:"img/thumb.jpg" },
    { id: 2,title:"安踏拍照",description:"11111111111111111",date:"2015年10月20日",img:"img/ionic.png" },
  ];

})


.controller('HomePageCtrl',function($scope){
$scope.playlists = [
	{ title: 'Reggae', id: 1 },
	{ title: 'Chill', id: 2 },
];
$scope.moreTasks = function() {
  window.location.href="#/app/quest";
};
$scope.creditDetails = function(){
  window.location.href="#/app/creditpage";
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
$scope.click = function(){};
$scope.getPhoto= function(){
	console.log("sdfds");
	navigator.camera.getPicture(onSuccess, onFail, {
		quality: 50,
    	destinationType: Camera.DestinationType.FILE_URI
    });

	function onSuccess(imageURI) {
    	var image = document.getElementById('myImage');
    	image.src = imageURI;
	}

	function onFail(message) {
    	alert('Failed because: ' + message);
	}

};
})
