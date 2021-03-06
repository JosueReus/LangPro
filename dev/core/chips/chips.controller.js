(function() {
    "use strict";

    angular.module("AppProject")
        .controller("chipsController", chipsController);
    chipsController.$inject = ['$q', '$timeout', '$scope'];

    function chipsController($q, $timeout, $scope) {
        var vm = this;
        var pendingSearch, cancelSearch = angular.noop;
        var cachedQuery, lastSearch;
        vm.allContacts = loadContacts();
        vm.contacts = [vm.allContacts[0]];
        vm.filterSelected = true;
        vm.querySearch = querySearch;
        vm.delayedQuerySearch = delayedQuerySearch;
        /**
         * Search for contacts; use a random delay to simulate a remote call
         */
        function querySearch(criteria) {
            cachedQuery = cachedQuery || criteria;
            return cachedQuery ? vm.allContacts.filter(createFilterFor(cachedQuery)) : [];
        }
        /**
         * Async search for contacts
         * Also debounce the queries; since the md-contact-chips does not support this
         */
        function delayedQuerySearch(criteria) {
            cachedQuery = criteria;
            if (!pendingSearch || !debounceSearch()) {
                cancelSearch();
                return pendingSearch = $q(function(resolve, reject) {
                    // Simulate async search... (after debouncing)
                    cancelSearch = reject;
                    $timeout(function() {
                        resolve(vm.querySearch());
                        refreshDebounce();
                    }, Math.random() * 500, true)
                });
            }
            return pendingSearch;
        }

        function refreshDebounce() {
            lastSearch = 0;
            pendingSearch = null;
            cancelSearch = angular.noop;
        }
        /**
         * Debounce if querying faster than 300ms
         */
        function debounceSearch() {
            var now = new Date().getMilliseconds();
            lastSearch = lastSearch || now;
            return ((now - lastSearch) < 300);
        }
        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(contact) {
                return (contact._lowername.indexOf(lowercaseQuery) != -1);;
            };
        }

        function loadContacts() {
            return $scope.buffer;
        }
    }
})();