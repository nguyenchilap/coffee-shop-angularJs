'use strict'

dialogEditModule.component('editDialog', {
    templateUrl: '../../../components/shared/edit-dialog/edit-dialog.html',
    bindings: {
        modalInstance: "<",
        resolve: "<"
    },
    controller: [
      '$scope',
      'dialogEditService',
    function DialogEditController($scope, dialogEditService) {
      const $ctrl = this;
      $scope.imageSrc;
      $scope.imageFile;
      $scope.modalData;

      $ctrl.$onInit = function() {
        $scope.modalData = $ctrl.resolve.modalData;

        let inputImage;
        if($scope.modalData.modalInput) $scope.modalData.modalInput.find(function(inputForm) {return inputForm.inputType === 'image'});
        if(inputImage) {
            $scope.imageSrc = inputImage.inputValue;
        }
      }

      //Show image
      $scope.fileChanged = function(element) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $scope.imageSrc = e.target.result;
            $scope.imageFile = element.files[0];
            $scope.$apply()
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
            case 'edit-store':
                entity.storeImage = await $ctrl.uploadFileToUrl('stores');
            break;
            //for employee
            case 'edit-employee':
                entity.employeeImage = await $ctrl.uploadFileToUrl('employees');
            break;
            //for category
            case 'edit-category':
                entity.categoryImage = await $ctrl.uploadFileToUrl('categories');
            break;
          }
        }
        
        if ($scope.modalData.modalId == 'edit-category') {
          entity.beverageList = [
            { beverageSize: 1, beveragePrice: Number.parseInt(entity.sizeS), categoryId: Number.parseInt(entity.categoryId) },
            { beverageSize: 2, beveragePrice: Number.parseInt(entity.sizeM), categoryId: Number.parseInt(entity.categoryId) },
            { beverageSize: 3, beveragePrice: Number.parseInt(entity.sizeL), categoryId: Number.parseInt(entity.categoryId) }
          ]
        } 

        return entity;
      }

      //Submit modal
      $scope.editSubmitted = async function(){

        let entity = {};
        $('#edit-form').serializeArray().forEach(function(input) {
            entity[input.name] = input.value;
        });

        if (confirm('Are you sure to edit with these informations ?')) {

          entity = await modifyData(entity);

          //call api 
          dialogEditService.edit(entity)
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