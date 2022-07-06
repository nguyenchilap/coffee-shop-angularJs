'use strict'

dialogCreateModule.component('createDialog', {
    templateUrl: '../../../components/shared/create-dialog/create-dialog.html',
    bindings: {
        modalInstance: "<",
        resolve: "<"
    },
    controller: [
      '$scope',
      'dialogCreateService',
    function DialogCreateController($scope, dialogCreateService) {
      const $ctrl = this;
      $scope.imageSrc;
      $scope.imageFile;
      $scope.modalData;

      $ctrl.$onInit = function() {
        $scope.modalData = $ctrl.resolve.modalData;

        //defined img url
        if ($scope.modalData) {
          if ($scope.modalData.modalId.includes('store'))
            $scope.imageSrc = '/assets/image/default-store.jpg';
          if ($scope.modalData.modalId.includes('employee'))
            $scope.imageSrc = '/assets/image/default-employee.jpg';
          if ($scope.modalData.modalId.includes('category'))
            $scope.imageSrc = '/assets/image/default-category.jpg';
        }
      }

      //Show image
      $scope.fileChanged = function(element) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $scope.imageSrc = e.target.result;
            $scope.imageFile = element.files[0];
            $scope.$apply();
        }
        reader.readAsDataURL(element.files[0]);
      }

      //Upload Image
      $ctrl.uploadFileToUrl = function(folderName){
        const file = $scope.imageFile;
        if (file) {
          const ref = firebase.storage().ref();
          const fileName = folderName + '/' + file.name + '-' + Date.now();
  
          const metaData = {
              'Content-Type' : file.type,
          }
  
          const task = ref.child(fileName).put(file, metaData);
  
          return task
          .then(function(snapshot) {
              return snapshot.ref.getDownloadURL();
          })
          .then(function(url) {
              return url;
          });
        }
      }

      //Modify data before request api
      async function modifyData(entity) {
        if ($scope.imageFile) {
          switch ($scope.modalData.modalId) {
            //for store
            case 'create-store':
                entity.storeImage = await $ctrl.uploadFileToUrl('stores');
            break;
            //for employee
            case 'create-employee':
                entity.employeeImage = await $ctrl.uploadFileToUrl('employees');
            break;
            //for category
            case 'create-category':
                entity.categoryImage = await $ctrl.uploadFileToUrl('categories');
            break;
          }
        }
        
        if ($scope.modalData.modalId == 'create-category') {
          entity.beverageList = [
            { beverageSize: 1, beveragePrice: entity.sizeS },
            { beverageSize: 2, beveragePrice: entity.sizeM },
            { beverageSize: 3, beveragePrice: entity.sizeL }
          ]
        } 

        return entity;
      }

      //Submit modal
      $scope.createSubmitted = async function(){

        $('.noti-warning').css('display', 'none');

        let checkInputValid = true;
        let entity = {};

        //validate form
        $('#create-form').serializeArray().forEach(function(input) {
          if (!input.value) {
              $('.noti-warning#' + input.name).css('display', 'block');
              checkInputValid = false;
          } 
          entity[input.name] = input.value;
        });

        if (!checkInputValid) return; 

        if (confirm('Are you sure to create with these informations ?')) {
          
          entity = await modifyData(entity);

          //call api create
          dialogCreateService.create(entity)
          .then(function succeed(res) {
            if (confirm(res.data.message)) {
              $ctrl.modalInstance.close($ctrl.modalData);
              location.reload();
            };
          }, function failed(res) {
            alert('Error: ' + res.data.message);
          })
          .catch(function(e) {
            alert('Something went wrong !! Status code:' + e.status);
          });
        }

      };


      //Handle modal behavior
      $ctrl.handleClose = function() {
        $ctrl.modalInstance.close(this.modalData);
      };

      $ctrl.handleDismiss = function() {
        $ctrl.modalInstance.dismiss("cancel");
      };
    }]
});