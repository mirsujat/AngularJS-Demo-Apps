(function () {

    angular.module('app')
        .controller('ClassroomMessageController', ['$stateParams', ClassroomMessageController]);

    function ClassroomMessageController($stateParams) {

        var vm = this;

        vm.message = $stateParams.classroomMessage;
    }

}());