'use strict'


categoryModule.component('category', {
    templateUrl: '../../components/category/category.html',
    controller: function CategoryController($scope, $location, voucherService, orderService) {

        const currentUser = JSON.parse(window.localStorage.getItem('cafeteria_auth'));

        //binding values
        this.entity = 'category';
        this.tableEntity = new TableEntity('Category', [
            new TableColumn('ID', 'categoryId', 'number', true),
            new TableColumn('Name', 'categoryName', 'text', true),
            new TableColumn('Image', 'categoryImage', 'image', false),
            new TableColumn('Store ID', 'storeId', 'number', true),
        ]);
        this.actions = [
            {actionName: 'Add to order', actionLink: ''},
        ]


        $scope.order = {
            orderTotal: 0,
            orderFinalTotal: 0,
        };
        $scope.voucher;
        $scope.categories = [];
        $scope.orderCategories = [];

        this.$onInit = function() {

            if (currentUser.employeeRole == 1) {
                this.actions.push({actionName: 'Delete', actionLink: ''})
            }
            
        }

        // Handle Order===========================
        $scope.onCreateOrder = function() {
            console.log($scope.orderCategories);
        }

        $scope.onResetOrder = function() {
            if (confirm('Are you sure to reset this order ?')) {
                $scope.order = {
                    orderTotal: 0,
                    orderFinalTotal: 0,
                };
            } else return;
        }

        $scope.onChangeQuantity = function() {
            calculateOrderTotal();
        }
        
        $scope.onRemoveBeverageFromOrder = function(category) {
            $scope.categories.splice($scope.categories.indexOf(category), 1);
            $scope.orderCategories.splice( $scope.orderCategories.find(function(orderCategory) {
                return orderCategory.category == category;
            }), 1);
            calculateOrderTotal();
        }

        $scope.onGetVoucher = function() {
            if ($scope.order.orderTotal <= 0) {
                alert('Choose beverages first !'); 
                return;
            }
            voucherService.getBestVoucherForOrder($scope.order)
            .then(function succeed(res) {
                $scope.voucher = res.data.resObject;
                $scope.order.voucherId = $scope.voucher.voucherId;
                calculateOrderTotal();
            }, function failed(res) {
                alert('No voucher found for this order !!');
                $scope.voucher = null;
                $scope.order.voucherId = null;
            })
            .catch(function(res) {
                alert('Cannot get voucher !! Status code : ' + res.status);
            }) 
        } 

        $scope.onCreateOrder = function() {
            orderService.createOrder($scope.order)
            .then(function succeed(res) {
                const requestOrderBeverages = getOrderBeverages(res.data.resObject);

                orderService.addBeveragesToOrder(requestOrderBeverages)
                .then(function succeed(res) {
                    alert(res.data.message);
                    $location.path('/order');
                }, function failed(res) {
                    alert(res.data.message + '. Status code: ' + res.status);
                });

            }, function failed(res) {
                alert(res.data.message + '. Status code: ' + res.status);
            })
            .catch(function(res) {
                alert('Cannot create order !! Status code : ' + res.status);
            });

        }

        function getOrderBeverages(submittedOrder) {
            let requestOrderBeverages = [];
            $scope.orderCategories.forEach(function(orderCategory) {
                orderCategory.orderBeverages.forEach(function(orderBeverage) {
                    if (orderBeverage.quantity > 0) {
                        orderBeverage.order = submittedOrder;
                        requestOrderBeverages.push(orderBeverage);
                    }
                });
            });
            return requestOrderBeverages;
        }

        function calculateOrderTotal() {
            $scope.order.orderTotal = $scope.orderCategories.reduce(function(accumulator, orderCategory){
                orderCategory.orderBeverages.forEach(function(orderBeverage) {
                    if (orderBeverage.quantity > 0) 
                    accumulator += orderBeverage.beverage.beveragePrice * orderBeverage.quantity;
                });
                return accumulator;
            }, 0);
            if ($scope.voucher) {
                $scope.order.orderFinalTotal = (Math.round($scope.order.orderTotal * (1 - $scope.voucher.voucherPercentage) * 100) / 100).toFixed(2);
            } else $scope.order.orderFinalTotal = $scope.order.orderTotal

            $('.order-total').html(Number.parseInt($('.order-total').html()).toLocaleString('en'));
            console.log(Number.parseInt($('.order-total').html()).toLocaleString('en'))
        }

        //============================================

        //get selected from table component
        $scope.$on('getBeverages', addCategories);
        
        function addCategories($event, categoryList) {
            categoryList.forEach(category => {
                //if not exist yet -> push 
                if ($scope.categories.findIndex(function(cat) { return cat == category}) < 0) 
                    $scope.categories.push(category);
            });

            //get orderCategories
            $scope.categories.forEach(function(category) {
                if (category.beverageList) {
                    $scope.orderCategories.push({
                        category,
                        orderBeverages: [
                            { beverage: category.beverageList[0], quantity: 0 },
                            { beverage: category.beverageList[1], quantity: 0 },
                            { beverage: category.beverageList[2], quantity: 0 },
                        ]
                    })
                }
            });

            $('html, body').animate({
                scrollTop: $("#create-order").offset().top
            }, 600);
        }
        //====================================

    }
});