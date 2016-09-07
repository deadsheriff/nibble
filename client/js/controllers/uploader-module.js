angular.module('app.controller', ['angularFileUpload', 'ngResource'])
  .controller('TestController', function ($scope, FileUploader,$resource) {
    'use strict';
    var uploader = $scope.uploader = new FileUploader({
      scope: $scope,                          // to automatically update the html. Default: $rootScope
      url: '/api/containers/Reviewers/upload',
      formData: [
        { id: $scope.currentUser.id }
      ]
    });
uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
            
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

    uploader.onAfterAddingFile = function(item) {

      console.info('After adding a file', item);
      
    };
    // --------------------
    uploader.onAfterAddingAll = function(items) {
      console.info('After adding all files', items);
    };
    // --------------------
    uploader.onWhenAddingFileFailed = function(item, filter, options) {
      console.info('When adding a file failed', item);

    };
    // --------------------
    uploader.onBeforeUploadItem = function(item) {
      console.info('Before upload', item);

    };
    // --------------------
    uploader.onProgressItem = function(item, progress) {
      console.info('Progress: ' + progress, item);
    };
    // --------------------
    uploader.onProgressAll = function(progress) {
      console.info('Total progress: ' + progress);
    };
    // --------------------
    uploader.onSuccessItem = function(item, response, status, headers) {
      $scope.currentUser.image = '../storage/Reviewers/'+response.result.files.file[0].name;
      var newName = '../storage/Reviewers/'+response.result.files.file[0].name;
      var urlBase = "/api";
      var UserUpdate = $resource(
        urlBase + '/Reviewers/:id',{id:'@id'},
        {"upsert": { url: urlBase + "/Reviewers/:id", method: "PUT"}}
      );
      UserUpdate.upsert({image: newName}, $scope.currentUser);
      $scope.$broadcast('uploadCompleted', item);
    };
    // --------------------
    uploader.onErrorItem = function(item, response, status, headers) {
      console.info('Error', response, status, headers);
    };
    // --------------------
    uploader.onCancelItem = function(item, response, status, headers) {
      console.info('Cancel', response, status);
    };
    // --------------------
    uploader.onCompleteItem = function(item, response, status, headers) {
      console.info('Complete', response, status, headers);
    };
    // --------------------
    uploader.onCompleteAll = function() {
      console.info('Complete all');
    };
    // --------------------

  }
).controller('FilesController', function ($scope, $http) {
    $scope.load = function () {
      $http.get('/api/containers/Reviewers/files').success(function (data) {
        console.log(data);

      });
    };

    $scope.delete = function (index, id) {
      $http.delete('/api/containers/Reviewers/files/' + encodeURIComponent(id)).success(function (data, status, headers) {
        $scope.files.splice(index, 1);
      });
    };

    $scope.$on('uploadCompleted', function(event) {
      console.log('uploadCompleted event received');
      $scope.load();
      var $img = $("#image");
      $img.attr("src", $img.attr("src").split("?")[0] + "?" + Math.random());
    });


  });