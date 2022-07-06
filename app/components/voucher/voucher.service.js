voucherModule.service('voucherService', function($http) {

    const apiUrl = 'http://localhost:8080/api/v1/voucher';

    //get all voucher
    this.getAllVouchers = function() {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'GET',
            url: apiUrl + '/all',
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //get one voucher
    this.getVoucherById = function(id) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'GET',
            url: apiUrl + '/' + id,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //delete voucher
    this.deleteVoucherById = function(id) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'DELETE',
            url: apiUrl + '/' + id,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            }
        });
    }

    //delete vouchers
    this.deleteVouchers = function(ids) {
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

    //get voucher for specific order
    this.getBestVoucherForOrder = function(order) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        return $http({
            method: 'POST',
            url: apiUrl + '/get-best-voucher',
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            },
            data: order
        });
    }
})