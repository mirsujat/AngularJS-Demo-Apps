(function () {

    angular.module('app')
        .controller('ClassroomSummaryController', ['classroom', ClassroomSummaryController]);

    function ClassroomSummaryController(classroom) {

        var vm = this;

        vm.schoolPrincipal = classroom.school.principal;
    }

}());