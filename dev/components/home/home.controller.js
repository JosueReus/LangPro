(function() {
    "use strict";

    angular.module("AppProject")
        .controller("homeController", homeController);
    homeController.$inject = ['$state', '$mdSidenav', '$scope'];

    function homeController($state, $mdSidenav, $scope) {
        var vm = this;
    }
})();