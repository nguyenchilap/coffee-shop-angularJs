'use strict'

navBarModule.component('navbar', {
    templateUrl: '../../../components/shared/navbar/navbar.html',
    controller: function NavBarController($scope, $location) {

        $scope.userRole = JSON.parse(window.localStorage.getItem('cafeteria_auth')).employeeRole;

        $scope.navItems = [
            {isActive: 'store', href: '/#!/store', navIcon: 'fa-store', lowPriority: false},
            {isActive: 'employee', href: '/#!/employee', navIcon: 'fa-users', lowPriority: true},
            {isActive: 'category', href: '/#!/category', navIcon: 'fa-mug-saucer', lowPriority: false},
            {isActive: 'voucher', href: '/#!/voucher', navIcon: 'fa-percent', lowPriority: true},
            {isActive: 'order', href: '/#!/order', navIcon: 'fa-receipt', lowPriority: false},
            {isActive: 'profile', href: '/#!/profile', navIcon: 'fa-gear', lowPriority: false}, 
        ]

        $scope.isActive = function(location) {
            return location === $location.path().split('/')[1];
        };

        $scope.isNotPermitted = function(lowPriority) {
            if ($scope.userRole > 1) {
                return lowPriority;
            }
            return false;
        }

    }
});