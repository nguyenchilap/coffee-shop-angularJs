'use strict'

profileModule.component('profile', {
    templateUrl: '../../components/profile/profile.html',
    controller: function ProfileController($scope, $location, employeeService) {

        const $ctrl = this;
        $scope.imageSrc;
        $scope.imageFile;
        $scope.currentUser;

        $ctrl.$onInit = function() {
            getCurrentUser();
        }

        function getCurrentUser() {
            const currentUserId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).employeeId;
            employeeService.getEmployeeById(currentUserId)
            .then(function succeed(res) {
                $scope.currentUser = res.data.resObject;
                $scope.imageSrc = $scope.currentUser.employeeImage;
            }, function failed(res) {
                alert('Cannot get user information: ' + res.data.message);
            })
            .catch(function(e) {
                alert('Something went wrong !! Status code:' + e.status);
            });
        }

        $scope.onImageIconBtnClick = function() {
            $('#btn-choose-image').click();
        }

        $scope.onGenderSelected = function(element) {
            $scope.currentUser.employeeGender = Number(element.value);
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

        //Submit form
        $scope.editProfileSubmitted = async function() {
            if ($scope.imageFile) {
                $scope.currentUser.employeeImage = await $ctrl.uploadFileToUrl('employees');;
            }
    
            //call api
            employeeService.updateEmployee($scope.currentUser)
            .then(function succeed(res) {
                if (confirm(res.data.message)) getCurrentUser();
            }, function failed(res) {
                alert('Error: ' + res.data.message);
            })
            .catch(function(e) {
                alert('Something went wrong !! Status code:' + e.status);
            });
      
        }

    }
});