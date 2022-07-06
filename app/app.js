'use strict'

// Declare app level module which depends on views, and cores

const myApp = angular.module('myApp', [
  'ngRoute', 'headerModule', 'navBarModule',
  'dialogCreateModule', 'dialogEditModule', 'tableModule',
  'profileModule', 
  'loginModule',
])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  //$locationProvider.hashPrefix('!');

  $routeProvider

    .when('/login', {
      template: '<login></login>'
    })
    
    .when('/store', {
      template: '<store></store>',
      resolve: {
        'auth': function(authService) {
          return authService.isLoggedIn();
        }
      }
    })

    .when('/employee', {
      template: '<employee></employee>',
      resolve: {
        'auth': function(authService) {
          return authService.isLoggedInAndPermitted();
        }
      }
    })

    .when('/category', {
      template: '<category></category>',
      resolve: {
        'auth': function(authService) {
          return authService.isLoggedIn();
        }
      }
    })

    .when('/voucher', {
      template: '<voucher></voucher>',
      resolve: {
        'auth': function(authService) {
          return authService.isLoggedInAndPermitted();
        }
      }
    })

    .when('/order', {
      template: '<order></order>',
      resolve: {
        'auth': function(authService) {
          return authService.isLoggedIn();
        }
      }
    })

    .when('/profile', {
      template: '<profile></profile>',
      resolve: {
        'auth': function(authService) {
          return authService.isLoggedIn();
        }
      }
    })

    .otherwise({
      redirectTo: '/store',
      resolve: {
        'auth': function(authService) {
          return authService.isLoggedIn();
        }
      }
    });
}])

.controller('AppController', function() {

  //Dismiss session each 30 mins
  setTimeout(function() {
    window.localStorage.removeItem('cafeteria_auth');
  }, 1000 * 60 * 30);

});


//initial fire base
firebase.initializeApp({
  apiKey: "AIzaSyCf50GKg4O1Cob01U56mOVTBPCzV-oPR04",
  authDomain: "cafeteria-ef616.firebaseapp.com",
  projectId: "cafeteria-ef616",
  storageBucket: "cafeteria-ef616.appspot.com",
  messagingSenderId: "777787963195",
  appId: "1:777787963195:web:4629c014d1b216f50d691e",
  measurementId: "G-0W4QXEMNYZ"
});

class Modal {
  modalId = '';
  modalTitle = '';
  modalInput = [];

  constructor(modalTitle, modalId, inputForms) {
    this.modalId = modalId;
    this.modalTitle = modalTitle;
    this.modalInput = inputForms;
  }
}

class InputForm {
  inputLabel = '';
  inputType = '';
  inputName = '';
  inputId = '';
  inputValue = '';
  inputDisplay = '';
  inputSelectOptions = [];
  
  constructor(inputLabel, inputType, inputName, inputId, inputValue, inputDisplay, inputSelectOptions) {
    this.inputLabel = inputLabel;
    this.inputType = inputType;
    this.inputName = inputName;
    this.inputId = inputId;
    this.inputValue = inputValue;
    this.inputDisplay = inputDisplay;
    this.inputSelectOptions = inputSelectOptions;
  }
}


class TableEntity {
  tableTitle = 'Table Title';
  tableColumns = [];

  constructor(tableTitle, tableColumns) {
    this.tableTitle = tableTitle;
    this.tableColumns = tableColumns;
  }
}

class TableColumn {
  columnTitle = 'Column Title';
  columnValue;
  columnType;
  sortAble;

  constructor(columnTitle, columnValue, columnType, sortAble) {
    this.columnTitle = columnTitle;
    this.columnValue = columnValue;
    this.columnType = columnType;
    this.sortAble = sortAble;
  }

}

