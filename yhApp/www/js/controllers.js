angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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
	$scope.click = function(){
		
	};
	
});

