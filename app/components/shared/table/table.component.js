'use strict'

tableModule.component('tableComponent', {
    templateUrl: '../../../components/shared/table/table.html',
    bindings: {
        entity: '<',
        table: '<',
        actions: '<',
    },
    controller: function TableController($scope, $rootScope, $location, $uibModal, 
        storeService, 
        employeeService, 
        categoryService,
        voucherService,
        orderService) {

        const $ctrl = this;

        $scope.itemsPerPage = 4;
        $scope.listEntity;
        $scope.storeList;

        $scope.selectedList;

        $ctrl.$onInit = function() {
            getEntityList();
            getAllStores()
        };

        //authorize
        $scope.isNotPermitted = function() {
            const currentUser = JSON.parse(window.localStorage.getItem('cafeteria_auth'));
            if (currentUser) {
                if (currentUser.employeeRole > 1) return true;
                return false;
            }
        }

        //Handle check boxes============
        $scope.onCheckBoxAll = function() {
            if ($scope.checkAll) {
                $scope.checkAll = true;
            } else {
                $scope.checkAll = false;
            }
            angular.forEach($scope.listEntity, function (entity) {
                entity.checked = $scope.checkAll;
            });
        }

        $scope.onEntitySelected = function() {
            let checkBoxTotal = $scope.listEntity.length;
            let count = 0;
            angular.forEach($scope.listEntity, function (entity) {
                if(entity.checked){
                    count++;
                }
            });

            if(checkBoxTotal == count){
                $scope.checkAll = true;
            } else{
                $scope.checkAll = false;
            }
        }
        //===================================

        //Handle Actions======================
        function InitOrder() {
            $rootScope.$broadcast('getBeverages', $scope.listEntity.filter(function(entity) {
                return entity.checked;
            }))
        }

        $scope.onHandleActions = function(event) {
            switch (event.target.innerHTML) {
                case 'Add to order' : {
                    InitOrder();
                }
                break;
                case 'Delete': {
                    if (confirm('Are you sure to delete these entities ?')) {
                        deleteEntitiesPromise($scope.listEntity.filter(function(entity) {
                            return entity.checked;
                        }))
                        .then(function succeed(res) {
                            alert(res.data.message);
                            location.reload();
                        }, function failed(res) {
                            alert('Delete failed !! Status code: ' + res.status);
                        })

                    }
                }
            }
            angular.forEach($scope.listEntity, function (entity) {
                entity.checked = false;
            });
        }
        //===================================

        //Sort Handler
        $scope.onSortBtnClicked = function(event) {
            $('.btn-sort-asc').each(function() {$(this).removeClass('disabled')} );
            $('.btn-sort-desc').each(function() {$(this).removeClass('disabled')} );

            const parentNode = event.target.parentNode.parentNode;
            if ($scope.sort == 1) {
                $scope.sort = -1;
                parentNode.querySelector('.btn-sort-asc').classList.add('disabled');
            } else {
                $scope.sort = 1;
                parentNode.querySelector('.btn-sort-desc').classList.add('disabled');
            }

            sortListEntity(parentNode.getAttribute('sortField'));
        }

        function sortListEntity(sortField) {
            if ($scope.sort > 0) {
            $scope.listEntity = $scope.listEntity.sort( function(a, b) {
                if ( a[sortField] < b[sortField] ) return -1;
                if ( a[sortField] > b[sortField] ) return 1;
                return 0;
            })
            } else if ($scope.sort < 0) {
            $scope.listEntity = $scope.listEntity.sort( function(a, b) {
                if ( a[sortField] < b[sortField] ) return 1;
                if ( a[sortField] > b[sortField] ) return -1;
                return 0;
            })
            }
        }
        //===================================


        //Change items per page
        $scope.onItemsPerPageSelected = function(element) {
            if (element.value > 0) {
                $scope.itemsPerPage = element.value;
                $scope.$apply();
            }
        }

        
        //get store list
        function getAllStores() {
            storeService.getAllStores()
            .then(function(res) {
                $scope.storeList = res.data.resObject;
            })
            .catch(function(res) {
                if (res.status == 401) $location.path('/login');
                else alert('Cannot get stores !! Status code : ' + res.status);
            });
        }


        //get list entity (item of table)
        function getEntityList() {
            getEntityListPromise()
            .then(function succeed(res) {
                $scope.listEntity = res.data.resObject;
            }, function failed(res) {
                alert('Cannot get ' + $ctrl.entity + ' !! Error: ' + res.data.message);
            })
            .catch(function(res) {
                if (res.status == 401) $location.path('/login');
            });
        }

        //delete entity 
        $scope.deleteEntity = async function(entity) {
            const modalInstance = await openNotiDialog('Delete ' + $ctrl.entity, 'Are you sure to delete this ' + $ctrl.entity + '?');
            modalInstance
            .then(function(res) {
                console.log(res);
            })
            // if (confirm('Are you sure to delete this ' + $ctrl.entity + '?')) {
            //     deleteEntityPromise(entity)
            //     .then(function succeed(res) {
            //         alert(res.data.message);
            //         location.reload();
            //     }, function failed(res) {
            //         alert('Cannot delete ' + $ctrl.entity + ' !! Error: ' + res.data.message);
            //     })
            //     .catch(function(res) {
            //         alert('Something went wrong !! Status code : ' + res.status);
            //     });
            // }
        }

        //open notification dialog
        function openNotiDialog(title, content) {
            return $uibModal.open({
                component: 'noti-dialog',
                resolve: {
                    modalData: function() {
                        return {
                            modalTitle: title,
                            modalContent: content
                        };
                    }
                }
            }).result;
        }

        //open edit dialog
        $scope.openEditDialog = function(entity) {
            if (!entity) return;

            let modalData;

            //pass data to modal for rendering
            switch ($ctrl.entity) {
                case 'store' :
                    modalData = new Modal('Edit store', 'edit-store', [
                        new InputForm('', 'number', 'storeId', 'storeId', entity.storeId, 'none', []),
                        new InputForm('', 'image', 'storeImage', 'storeImage', entity.storeImage, 'block', []),
                        new InputForm('Name', 'text', 'storeName', 'storeName', entity.storeName, 'block', []),
                        new InputForm('Address', 'text', 'storeAddress', 'storeAddress', entity.storeAddress, 'block', []),
                    ]);
                    break;
                case 'category' :
                    modalData = new Modal('Edit category', 'edit-category', [
                        new InputForm('', 'number', 'categoryId', 'categoryId', entity.categoryId, 'none', []),
                        new InputForm('', 'image', 'categoryImage', 'categoryImage', entity.categoryImage, 'block', []),
                        new InputForm('Name', 'text', 'categoryName', 'categoryName', entity.categoryName, 'block', []),
                        new InputForm('Size S - Price', 'number', 'sizeS', 'sizeS', entity.beverageList[0].beveragePrice, 'block', []),
                        new InputForm('Size M - Price', 'number', 'sizeM', 'sizeM', entity.beverageList[1].beveragePrice, 'block', []),
                        new InputForm('Size L - Price', 'number', 'sizeL', 'sizeL', entity.beverageList[2].beveragePrice, 'block', []),
                    ]);
                    break;
                case 'voucher' :
                    modalData = new Modal('Edit voucher', 'edit-voucher', [
                        new InputForm('', 'number', 'voucherId', 'voucherId', entity.voucherId, 'none', []),
                        new InputForm('Voucher Code', 'text', 'voucherCode', 'voucherCode', entity.voucherCode, 'block', []),
                        new InputForm('Start date', 'date', 'voucherStartDate', 'voucherStartDate', entity.voucherStartDate, 'block', []),
                        new InputForm('End date', 'date', 'voucherEndDate', 'voucherEndDate', entity.voucherEndDate, 'block', []),
                        new InputForm('Discount (%)', 'float', 'voucherPercentage', 'voucherPercentage', entity.voucherPercentage, 'block', []),
                        new InputForm('Max sale', 'number', 'voucherMax', 'voucherMax', entity.voucherMax, 'block', []),
                        new InputForm('Least order', 'number', 'voucherMinOrder', 'voucherMinOrder', entity.voucherMinOrder, 'block', []),
                        new InputForm('Quantity', 'number', 'voucherLimit', 'voucherLimit', entity.voucherLimit, 'block', []),
                    ]);
                    break;
            }

            const modalInstance = $uibModal.open({
                component: 'edit-dialog',
                resolve: {
                    modalData: function() {
                        return modalData;
                    }
                }
            });
            modalInstance.result.then(function() {
                getEntityList();
            });
        }

        //open create dialog
        $scope.openCreateDialog = function() {

            if ($ctrl.entity == 'order') {
                $location.path('/category');
                return;
            } 

            let modalData;

            //pass data to modal for rendering
            switch ($ctrl.entity) {
                case 'store' :
                    modalData = new Modal('Create store', 'create-store', [
                        new InputForm('', 'image', 'storeImage', 'storeImage', '', 'block', []),
                        new InputForm('Name', 'text', 'storeName', 'storeName', '', 'block', []),
                        new InputForm('Address', 'text', 'storeAddress', 'storeAddress', '', 'block', []),
                    ]);
                    break;
                case 'employee' :
                    modalData = new Modal('Create employee', 'create-employee', [
                        new InputForm('', 'image', 'employeeImage', 'employeeImage', '', 'block', []),
                        new InputForm('Username', 'text', 'employeeLoginName', 'employeeLoginName', '', 'block', []),
                        new InputForm('Password', 'password', 'employeePassword', 'employeePassword', '', 'block', []),
                        new InputForm('Name', 'text', 'employeeName', 'employeeName', '', 'block', []),
                        new InputForm('Phone', 'text', 'employeePhone', 'employeePhone', '', 'block', []),
                        new InputForm('Email', 'email', 'employeeEmail', 'employeeEmail', '', 'block', []),
                        new InputForm('Gender', 'select', 'employeeGender', 'employeeGender', '0', 'block', [
                            {value: 0, text: 'Other'},
                            {value: 1, text: 'Male'},
                            {value: 2, text: 'Female'},
                        ]),
                        new InputForm('Role', 'select', 'employeeRole', 'employeeRole', '1', 'block', [
                            {value: 1, text: 'Admin'},
                            {value: 2, text: 'Staff'},
                        ]),
                        new InputForm('Store', 'select', 'storeId', 'storeId', '0', 'block', $scope.storeList.map(function(store) {
                            return {
                                value: store.storeId,
                                text: store.storeName,
                            }
                        })),
                    ]); 
                    break;
                case 'category' :
                    modalData = new Modal('Create category', 'create-category', [
                        new InputForm('', 'image', 'categoryImage', 'categoryImage', '', 'block', []),
                        new InputForm('Name', 'text', 'categoryName', 'categoryName', '', 'block', []),
                        new InputForm('Size S - Price', 'number', 'sizeS', 'sizeS', '', 'block', []),
                        new InputForm('Size M - Price', 'number', 'sizeM', 'sizeM', '', 'block', []),
                        new InputForm('Size L - Price', 'number', 'sizeL', 'sizeL', '', 'block', []),
                        new InputForm('Store', 'select', 'storeId', 'storeId', '0', 'block', $scope.storeList.map(function(store) {
                            return {
                                value: store.storeId,
                                text: store.storeName,
                            }
                        })),
                    ]);
                    break;
                case 'voucher' :
                    modalData = new Modal('Create voucher', 'create-voucher', [
                        new InputForm('Code', 'text', 'voucherCode', 'voucherCode', '', 'block', []),
                        new InputForm('Start date', 'date', 'voucherStartDate', 'voucherStartDate', '', 'block', []),
                        new InputForm('End date', 'date', 'voucherEndDate', 'voucherEndDate', '', 'block', []),
                        new InputForm('Discount (%)', 'float', 'voucherPercentage', 'voucherPercentage', '', 'block', []),
                        new InputForm('Max sale', 'number', 'voucherMax', 'voucherMax', '', 'block', []),
                        new InputForm('Required order', 'number', 'voucherMinOrder', 'voucherMinOrder', '', 'block', []),
                        new InputForm('Quantity', 'number', 'voucherLimit', 'voucherLimit', '', 'block', []),
                    ]);
                    break;

            }

            const modalInstance = $uibModal.open({
                component: 'create-dialog',
                resolve: {
                    modalData: function() {
                        return modalData;
                    }
                }
            });
            modalInstance.result.then(function() {
                getEntityList();
            });
        }

        //open order detail dialog
        $scope.openOrderDetailModal = function(order) {
            $rootScope.$broadcast('getOrder', order);
        }

        //Get Services as Promise========
        function getEntityListPromise() {
            if ($ctrl.entity === 'store') return storeService.getAllStores();   
            else if ($ctrl.entity === 'employee') return employeeService.getAllEmployees();         
            else if ($ctrl.entity === 'category') return categoryService.getAllCategories();         
            else if ($ctrl.entity === 'voucher') return voucherService.getAllVouchers();         
            else if ($ctrl.entity === 'order') return orderService.getAllOrders();         
        }

        function deleteEntityPromise(entity) {
            if ($ctrl.entity === 'store') return storeService.deleteStoreById(entity.storeId);   
            else if ($ctrl.entity === 'employee') return employeeService.deleteEmployeeById(entity.employeeId);        
            else if ($ctrl.entity === 'category') return categoryService.deleteCategoryById(entity.categoryId);        
            else if ($ctrl.entity === 'voucher') return voucherService.deleteVoucherById(entity.voucherId);        
            else if ($ctrl.entity === 'order') return orderService.deleteOrderById(entity.orderId);        
        }

        function deleteEntitiesPromise(checkedEntities) {
            if ($ctrl.entity === 'store') 
                return storeService.deleteStores(checkedEntities.map(function(store){ return store.storeId }));   
            else if ($ctrl.entity === 'employee') 
                return employeeService.deleteEmployees(checkedEntities.map(function(employee){ return employee.employeeId }));        
            else if ($ctrl.entity === 'category') 
                return categoryService.deleteCategorys(checkedEntities.map(function(category){ return category.categoryId }));        
            else if ($ctrl.entity === 'voucher') 
                return voucherService.deleteVouchers(checkedEntities.map(function(voucher){ return voucher.voucherId }));        
            else if ($ctrl.entity === 'order') 
                return orderService.deleteOrders(checkedEntities.map(function(order){ return order.orderId }));        
        }
        //=================================

    }
})