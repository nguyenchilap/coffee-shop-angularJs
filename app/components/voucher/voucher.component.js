'use strict'

voucherModule.component('voucher', {
    templateUrl: '../../components/voucher/voucher.html',
    controller: function VoucherController() {

        //binding values
        this.entity = 'voucher';
        this.tableEntity = new TableEntity('Voucher', [
            new TableColumn('ID', 'voucherId', 'number', true),
            new TableColumn('Code', 'voucherCode', 'text', true),
            new TableColumn('Start date', 'voucherStartDate', 'date', true),
            new TableColumn('End date', 'voucherEndDate', 'date', true),
            new TableColumn('Discount (%)', 'voucherPercentage', 'percentage', true),
            new TableColumn('Max sale', 'voucherMax', 'money', true),
            new TableColumn('Required order', 'voucherMinOrder', 'money', true),
            new TableColumn('Limit', 'voucherLimit', 'number', true),
        ]);
        this.actions = [
            {actionName: 'Delete', actionLink: ''},
        ]

        this.$onInit = function() {
        }
    }
})