'use strict'

employeeModule.component('employee', {
    templateUrl: '../../components/employee/employee.html',
    controller: function EmployeeController() {

        //binding values
        this.entity = 'employee';
        this.tableEntity = new TableEntity('Employee', [
            new TableColumn('ID', 'employeeId', 'number', true),
            new TableColumn('Name', 'employeeName', 'text', true),
            new TableColumn('Image', 'employeeImage', 'image', false),
            new TableColumn('Username', 'employeeLoginName', 'text', true),
            new TableColumn('Gender', 'employeeGender', 'number', true),
            new TableColumn('Role', 'employeeRole', 'number', true),
            new TableColumn('Store ID', 'storeId', 'number', true),
        ]);
        this.actions = [
            {actionName: 'Delete', actionLink: ''}
        ]

        this.$onInit = function() {
        }
    }
})