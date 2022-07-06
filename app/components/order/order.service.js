orderModule.service('orderService', function($http) {

    const apiUrl = 'http://localhost:8080/api/v1/order';

    //get all order
    this.getAllOrders = function() {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'GET',
            url: apiUrl + '/all',
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //create order
    this.createOrder = function(order) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            },
            data: order
        });
    }

    //get one order
    this.getOrderById = function(id) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'GET',
            url: apiUrl + '/' + id,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //delete order
    this.deleteOrderById = function(id) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'DELETE',
            url: apiUrl + '/' + id,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //delete order
    this.deleteOrders = function(ids) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'DELETE',
            url: apiUrl + '/all?ids=' + ids.toString(),
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //add beverages to order
    this.addBeveragesToOrder = function(orderBeverages) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'POST',
            url: apiUrl + '/add-beverage-to-order',
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            },
            data: orderBeverages
        });
    }
})