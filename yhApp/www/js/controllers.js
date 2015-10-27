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
//准备数据
$ionicModal.fromTemplateUrl('templates/login.html', {
	scope: $scope
}).then(function(modal) {
	$scope.modal = modal;
});
//$scope.regData={};
//关闭登录界面
$scope.closeLogin = function() {
	if($scope.loginData.logged_in == false){
		$scope.loginData.username="未登录";
	}
	$scope.modal.hide();
};
//打开登录界面
$scope.login = function() {
	if($scope.loginData.logged_in == false){
		$scope.loginData.username="";
		$scope.modal.show();
	}else{
		//已经登录了,先放个退出吧，以后改成别的功能
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
	$scope.closeLogin();
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

})
//主页控制器
.controller('HomePageCtrl',function($scope){
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
function getPhoto(){
	alert("getPhoto()");
	$scope.pics.unshift({ id:$scope.pics.length,title:"安踏拍照",description:"拍的好",date:getNowFormatDate(),img:"img/ionic.png" });
	navigator.camera.getPicture(onSuccess, onFail, {
			quality: 50,
		destinationType: Camera.DestinationType.FILE_URI,
		allowEdit : false,
		encodingType: Camera.EncodingType.JPEG,
		cameraDirection: Camera.Direction.FRONT
	});

	function onSuccess(imageURI) {
	alert("getPhoto onSucess" + imageURI);
		$scope.pics.unshift({ id:$scope.pics.length,title:"安踏拍照",description:"拍的好",date:getNowFormatDate(),img:imageURI });
	}

	function onFail(message) {
		alert('getPhoto Failed because: ' + message);
	}

};

function getNowFormatDate() {
	var date = new Date();
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
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			+ " " + date.getHours() + seperator2 + date.getMinutes()
			+ seperator2 + date.getSeconds();
	return currentdate;
};

function getLocation(){
	alert("getLocation()");
	navigator.geolocation.getCurrentPosition(onSuccess,onFail, {
	enableHighAccuracy: false,
	timeout: 60*1000,
	maximumAge: 1000*60*10
	});

	function onSuccess(position) {
	alert('Latitude: '		 + position.coords.latitude+ 	'\n' +
			'Longitude: '	 + position.coords.longitude + 	'\n' +
			'Altitude: '	 + position.coords.altitude+ 	'\n' +
			'Accuracy: '	 + position.coords.accuracy+ 	'\n' +
			'Altitude Accuracy: ' + position.coords.altitudeAccuracy	+ '\n' +
			'Heading: ' 	 + position.coords.heading + 	'\n' +
			'Speed: ' 		 + position.coords.speed + 		'\n' +
			'Timestamp: ' 	 + position.timestamp + 		'\n');
	// 百度地图API功能
	// var map = new BMap.Map("allmap");
	// // var point = new BMap.Point(116.331398,39.897445);
	// var point = new BMap.Point(position.coords.longitude, position.coords.latitude);
	// var gc = new BMap.Geocoder();
	// gc.getLocation(point, function(rs){
	//		var addComp = rs.addressComponents;
	//		alert(addComp.province + ", " + addComp.city +
	//			", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
	//		 AV.initialize('0lG3kPhexRj622hDQyFbXmb2', 'zadd60s9Cp0bo1DxjcfYUacj');
	// var PhotoLocation = AV.Object.extend('PhotoLocation');
	// var photoLocation = new PhotoLocation();
	// photoLocation.save({
	//	 longitude: position.coords.longitude,
	//	 latitude: position.coords.latitude,
	//	 location: (addComp.province + ", " + addComp.city +
	//			", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber)
	// }, {
	//	 success: function(object) {
	//		 alert('LeanCloud works!');
	//	 }
	// });
	// });

	
	}

	function onFail(message) {
	alert('code: '		+ error.code		+ '\n' +
			'message: ' + error.message + '\n');
	}

};

})

