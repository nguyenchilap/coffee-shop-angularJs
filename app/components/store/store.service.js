storeModule.service('storeService', function($http) {

    const apiUrl = 'http://localhost:8080/api/v1/store';

    //get all store
    this.getAllStores = function() {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'GET',
            url: apiUrl + '/all',
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //get one store
    this.getStoreById = function(id) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'GET',
            url: apiUrl + '/' + id,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //delete store
    this.deleteStoreById = function(id) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'DELETE',
            url: apiUrl + '/' + id,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //delete stores
    this.deleteStores= function(ids) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'DELETE',
            url: apiUrl + '/all?ids=' + ids.toString(),
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }
})