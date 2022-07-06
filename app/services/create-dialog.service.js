dialogCreateModule.service('dialogCreateService', function($http) {

    //create entity
    this.create = function(entity) {
        const tokenId = JSON.parse(window.localStorage.getItem('cafeteria_auth')).jwt;
        let typeEntity;

        if (entity.storeImage) typeEntity = 'store';
        else if (entity.employeeImage) typeEntity = 'employee';
        else if (entity.categoryImage) typeEntity = 'category';
        else if (entity.voucherCode) typeEntity = 'voucher';

        return $http({
            method: 'POST',
            url: 'http://localhost:8080/api/v1/' + typeEntity,
            headers: {
                'Authorization' : 'Bearer ' + tokenId
            },
            data: entity
        });
    }

})