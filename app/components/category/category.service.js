categoryModule.service('categoryService', function($http) {

    const apiUrl = 'http://localhost:8080/api/v1/category';

    //get all category
    this.getAllCategories = function() {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'GET',
            url: apiUrl + '/all',
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //get one category
    this.getCategoryById = function(id) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'GET',
            url: apiUrl + '/' + id,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //delete category
    this.deleteCategoryById = function(id) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'DELETE',
            url: apiUrl + '/' + id,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //delete categories
    this.deleteCategories = function(ids) {
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
})