loginModule.service('authService', function($http, $location, $window) {

    const apiUrl = 'http://localhost:8080/api/v1';

    this.login = function(employee) {
        return $http({
            method: 'POST',
            url: apiUrl + '/login',
            data: {
                employeeLoginName: employee.employeeLoginName,
                employeePassword: employee.employeePassword
            }
        });
    }

    this.logout = function() {
        const currentUser = JSON.parse(window.localStorage.getItem('cafeteria_auth'));
        return $http({
            method: 'POST',
            url: apiUrl + '/logout',
            headers: {
                'Authorization' : 'Bearer ' + currentUser.jwt
            },
            data: {
                jwt: currentUser.jwt
            }
        });
    }

    this.isLoggedIn = function() {
        if (!window.localStorage.getItem('cafeteria_auth')) {
            $location.path('/login');
            return false;
        }
        return true;
    }

    this.isLoggedInAndPermitted = function() {
        if (!window.localStorage.getItem('cafeteria_auth')) {
            $location.path('/login');
            return false;
        } else {
            const currentUser = JSON.parse(window.localStorage.getItem('cafeteria_auth'));
            if (currentUser.employeeRole == 2) {
                $window.history.back();
                return false;
            } 
            return true;
        }
    }

})