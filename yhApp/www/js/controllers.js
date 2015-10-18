angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

// Form data for the login modal
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

.controller('PlaylistCtrl', function($scope, $stateParams) {
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
