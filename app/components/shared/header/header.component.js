'use strict'

headerModule.component('headerComponent', {
    templateUrl: '../../../components/shared/header/header.html',
    controller: ['$scope', '$location', 'authService', function HeaderController($scope, $location, authService) {
        $scope.currentUser;
        $scope.userAction = false;

        this.$onInit = function() {
            getCurrentUser();
            handleUserBtnClick();
        };


        function getCurrentUser() {
            $scope.currentUser = JSON.parse(window.localStorage.getItem('cafeteria_auth'));
        }

        function handleUserBtnClick() {
            document.body.onclick = function(e) {
                $('.user-actions').removeClass('active');
            }
        }

        $scope.onUserButtonClick = function($event) {
            $event.stopPropagation();
            $scope.userAction = !$scope.userAction;
        }

        $scope.onLogOut = function() {
            if (confirm('Are you sure to log out ?')) {
                authService.logout()
                .then(function(res) {
                    if (res.data) {
                        window.localStorage.removeItem('cafeteria_auth');
                        $location.path('/login');
                    }
                    else alert('Log out failed !!');
                });
            } else return;
        }
        
    }]
})