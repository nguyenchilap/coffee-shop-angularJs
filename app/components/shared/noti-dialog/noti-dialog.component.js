'use strict'

dialogNotiModule.component('notiDialog', {
    templateUrl: '../../../components/shared/noti-dialog/noti-dialog.html',
    bindings: {
        modalInstance: "<",
        resolve: "<"
    },
    controller: [
      '$scope',
    function DialogCreateController($scope) {
      const $ctrl = this;

      $scope.modalData;

      $ctrl.$onInit = function() {
        console.log($scope.modalData);
        $scope.modalData = $ctrl.resolve.modalData;
      }

    }]
});