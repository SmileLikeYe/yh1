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
$scope.pics = [
    { id: 0,title:"安踏拍照",description:"11111111111111111",date:"2015年10月20日",img:"img/ios7-png/idea-vector.png" },
    { id: 1,title:"安踏拍照",description:"11111111111111111",date:"2015年10月20日",img:"img/thumb.jpg" },
    { id: 2,title:"安踏拍照",description:"11111111111111111",date:"2015年10月20日",img:"img/ionic.png" },
 ];
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




.controller('HomePageCtrl',function($scope, $ionicLoading, $ionicPopup, $timeout){
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
$scope.click = function(){
	$scope.pics.unshift({ id:$scope.pics.length,title:"安踏拍照",description:"拍的好",date:getNowFormatDate(),img:"img/ionic.png" });
};
$scope.getPhoto= function(){
	navigator.camera.getPicture(onSuccess, onFail, {
		quality: 50,
    	destinationType: Camera.DestinationType.FILE_URI
    });

	function onSuccess(imageURI) {
    	var image = document.getElementById('myImage');
    	image.src = imageURI;
    	addPhoto(imageURI);

	}

	function onFail(message) {
    	alert('Failed because: ' + message);
	}

};
$scope.getPosition= function(){

  
  var TestObject = AV.Object.extend('TestObject');
  var testObject = new TestObject();
  testObject.save({
    foo: 'bar',
    username: 'ddd'
  }, {
    success: function(object) {
      alert('LeanCloud works!');
    }
  });

  navigator.geolocation.getCurrentPosition(onSuccess,onFail, {
    enableHighAccuracy: false,
    timeout: 60*1000,
    maximumAge: 1000*60*10
  });

  function onSuccess(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    // var point = new BMap.Point(116.331398,39.897445);
    var point = new BMap.Point(position.coords.longitude, position.coords.latitude);
    var gc = new BMap.Geocoder();
    gc.getLocation(point, function(rs){
       var addComp = rs.addressComponents;
       // var location = addComp.province + ", " + addComp.city +
       //  ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
       // alert(location);
       alert(addComp.province + ", " + addComp.city +
         ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
       $scope.myLocation = location;
    });
  }

  function onFail(message) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  }

};

$scope.showLoading = function() {

   $ionicLoading.show({
        
  content: 'fd',

  // The animation to use
  animation: 'fade-in',

  // Will a dark overlay or backdrop cover the entire view
  showBackdrop: true,

  // The maximum width of the loading indicator
  // Text will be wrapped if longer than maxWidth
  maxWidth: 200,

  // The delay in showing the indicator
  showDelay: 100
      })

};
$scope.hideLoading = function(){
    $ionicLoading.hide();
};
// Triggered on a button click, or some other target
$scope.showPopup = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl: 'templates/login.html',
    title: 'Enter Wi-Fi Password',
    subTitle: 'Please use normal things',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.wifi) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.wifi;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });
  $timeout(function() {
     myPopup.close(); //close the popup after 3 seconds for some reason
  }, 3000);
 };

 // A confirm dialog
 $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Consume Ice Cream',
     template: 'Are you sure you want to eat this ice cream?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
 };

 // An alert dialog
 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Don\'t eat that!',
     template: 'It might taste good'
   });
   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };

});


