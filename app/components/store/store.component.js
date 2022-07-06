'use strict'

storeModule.component('store', {
    templateUrl: '../../components/store/store.html',
    controller: function StoreController() {

        const currentUser = JSON.parse(window.localStorage.getItem('cafeteria_auth'));

        //binding values
        this.entity = 'store';
        this.tableEntity = new TableEntity('Store', [
            new TableColumn('ID', 'storeId', 'number', true),
            new TableColumn('Name', 'storeName', 'text', true),
            new TableColumn('Address', 'storeAddress', 'long-text', true),
            new TableColumn('Image', 'storeImage', 'image', false),
            new TableColumn('Employees', 'employeeList', 'length', true),
            new TableColumn('Categories', 'categoryList', 'length', true),
        ]);
        

        this.$onInit = function() {
            if (currentUser.employeeRole == 1) {
                this.actions = [
                    {actionName: 'Delete', actionLink: ''}
                ]
            }
        }

    }
})