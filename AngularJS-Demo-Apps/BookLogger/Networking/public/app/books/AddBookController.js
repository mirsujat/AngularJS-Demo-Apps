(function() {

    angular.module('app')
        .controller('AddBookController', ['$log', '$location', 'dataService', AddBookController]);

    function AddBookController($log, $location, dataService) {

        var vm = this;

        vm.newBook = {};

        vm.addBook = function () {

            dataService.addBook(vm.newBook)
                .then(addBookSuccess)
                .catch(addBookError);

        };

        function addBookSuccess(message) {
            $log.info(message);
            $location.path('/');
        }

        function addBookError(errorMessage) {
            $log.error(errorMessage);
        }

    }

}());