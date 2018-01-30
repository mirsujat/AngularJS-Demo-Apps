(function () {

    angular.module('app')
        .controller('AllActivitiesController', ['dataService', 'notifier', '$state', 'activities', '$log', AllActivitiesController]);

    function AllActivitiesController(dataService, notifier, $state, activities, $log) {

        var vm = this;

        vm.selectedMonth = 1; // default to January

        vm.allActivities = activities;

        $log.debug($state.current.data);
        $log.debug($state.current.foo);

        vm.search = function () {
            $state.go('classroom_detail', {id: vm.selectedClassroom.id, month: vm.selectedMonth});
        };


        dataService.getAllClassrooms()
            .then(function(classrooms) {
                vm.allClassrooms = classrooms;
                vm.selectedClassroom = classrooms[0];
            })
            .catch(showError);

        //dataService.getAllActivities()
        //    .then(function(activities) {
        //        vm.allActivities = activities;
        //    })
        //    .catch(showError);

        function showError(message) {
            notifier.error(message);
        }

    }

}());