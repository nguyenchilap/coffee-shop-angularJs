'use strict'

orderModule.component('order', {
    templateUrl: '../../components/order/order.html',
    controller: function OrderController($scope) {

        //binding values
        this.entity = 'order';
        this.tableEntity = new TableEntity('Order', [
            new TableColumn('ID', 'orderId', 'number', true),
            new TableColumn('Date', 'orderDate', 'date', true),
            new TableColumn('Address', 'orderAddress', 'long-text', true),
            new TableColumn('Note', 'orderNote', 'long-text', true),
            new TableColumn('Total', 'orderTotal', 'money', true),
            new TableColumn('Final Total', 'orderFinalTotal', 'money', true),
            new TableColumn('Voucher ID', 'voucherId', 'number', false),
        ]);

        this.actions = [
            {actionName: 'Delete', actionLink: ''},
        ]

        this.$onInit = function() {
        }

        //order details
        $scope.$on('getOrder', showOrderDetails);

        function showOrderDetails($event, order) {
            if (order) {
                $scope.order = order;
                $('html, body').animate({
                    scrollTop: $("#order-details").offset().top
                }, 600);
            } 
        }
    }
})