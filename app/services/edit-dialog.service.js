dialogEditModule.service('dialogEditService', function($http) {

    //edit entity
    this.edit = function(entity) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        let typeEntity;

        if (entity.storeId) typeEntity = 'store';
        else if (entity.employeeId) typeEntity = 'employee';
        else if (entity.categoryId) typeEntity = 'category';
        else if (entity.voucherCode) typeEntity = 'voucher';

        return $http({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/' + typeEntity,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            },
            data: entity
        });
    }

})