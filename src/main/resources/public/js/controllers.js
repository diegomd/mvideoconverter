'use strict';

var STATE_INITIAL = "fa-circle text-muted";
var STATE_LOADING = "fa-spinner fa-spin";
var STATE_DONE = "fa-check-circle text-success";
var STATE_ERROR = "fa-times-circle text-danger";

var controllers = angular.module('controllers', []);

controllers.controller('UploadController',['$scope', '$http', function($scope, $http) {
    
	$scope.fileName = "";
	$scope.fileType = "";
	$scope.fileSize = "";
	$scope.fileDate = "";
	
	$scope.step1class = STATE_INITIAL;
	$scope.step2class = STATE_INITIAL;
	$scope.step3class = STATE_INITIAL;
	$scope.step4class = STATE_INITIAL;
	
	$scope.$watch('file', function(newf, oldf) {
		if (newf) {
			$scope.fileName = newf.name;
			$scope.fileType = newf.type;
			$scope.fileSize = Math.round(newf.size / 1024 ) + 'kb';
			$scope.fileDate = newf.lastModifiedDate;
		}
	});

    $scope.upload = function() {
    	if ($scope.file) {
    		$scope.step1class = STATE_LOADING;
    		$http.post('/api/presigned', {name: $scope.file.name, type: $scope.file.type })
	      		.success($scope.step1success)
				.error($scope.step1error);
    	}
    	else {
    		toastr.error('Please select a file to upload');
    	}
    };

    $scope.step1success = function(resp) {
		$scope.step1class = STATE_DONE;
		$scope.step2class = STATE_LOADING;

		console.info(resp);

		$http.put(resp.url, $scope.file, {headers: {'Content-Type': $scope.file.type}})
			.success($scope.step2success)
			.error($scope.step1error);
	};

	$scope.step1error = function(resp) {
		$scope.step1class = STATE_ERROR;
		console.error(resp);
		toastr.error("An Error Occurred Attaching Your File");
	};

	$scope.step2success = function(resp) {
		$scope.step2class = STATE_DONE;
		$scope.step3class = STATE_LOADING;
		
		console.info(resp);

		$http.post('/api/conversion', {name: $scope.file.name})
			.success($scope.step3success)
			.error($scope.step3error);
	};

	$scope.step2error = function(resp) {
		$scope.step2class = STATE_ERROR;
		console.error(resp);
		toastr.error("An Error Occurred Attaching Your File");
	};

	$scope.step3success = function (resp) {
		$scope.step3class = STATE_DONE;
		$scope.step4class = STATE_LOADING;

		console.info(resp);

		toastr.success('Temporary done', 'Done');
	};

	$scope.step3error = function (resp) {
		$scope.step3class = STATE_ERROR;
		console.error(resp);
		toastr.error("An Error Occurred Attaching Your File");
	};

}]);
