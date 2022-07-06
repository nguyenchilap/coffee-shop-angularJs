'use strict'

loginModule.component('login', {
    templateUrl: '../../components/login/login.html',
    controller: function LoginController($scope, $location, $route, authService) {
        $scope.employee = {
            employeeLoginName: '',
            employeePassword: ''
        }

        $scope.login = function() {
            authService.login($scope.employee)
            .then(function(res) {
                window.localStorage.setItem("cafeteria_auth", JSON.stringify(res.data));
                $location.path('/store');
            })
            .catch(function(){
                $scope.invalidLogin = true;
            });
        }
    }
});