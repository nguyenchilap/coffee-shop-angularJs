employeeModule.service('employeeService', function($http) {

    const apiUrl = 'http://localhost:8080/api/v1/employee';

    //get all employee
    this.getAllEmployees = function() {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'GET',
            url: apiUrl + '/all',
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //get one employee
    this.getEmployeeById = function(id) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'GET',
            url: apiUrl + '/' + id,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //delete employee
    this.deleteEmployeeById = function(id) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'DELETE',
            url: apiUrl + '/' + id,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //delete employees
    this.deleteEmployees = function(ids) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'DELETE',
            url: apiUrl + '/all',
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            },
            data: ids
        });
    }

    //update employee
    this.updateEmployee = function(employee) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'PUT',
            url: apiUrl,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            },
            data: employee
        });
    }

})