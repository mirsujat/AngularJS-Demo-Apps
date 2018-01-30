(function() {

    var app = angular.module('app', ['ui.router']);

    app.config(['$logProvider', '$stateProvider', '$urlRouterProvider', function ($logProvider, $stateProvider, $urlRouterProvider) {

        $logProvider.debugEnabled(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/app/templates/home.html',
                controller: 'HomeController',
                controllerAs: 'home'
            })
            .state('schools', {
                url: '/schools',
                controller: 'AllSchoolsController',
                controllerAs: 'schools',
                templateUrl: '/app/templates/allSchools.html'
            })
            .state('classrooms', {
                url: '/classrooms',
                controller: 'AllClassroomsController',
                controllerAs: 'classrooms',
                templateUrl: '/app/templates/allClassrooms.html',
                onEnter: function ($log) {
                    $log.debug('Entering the classrooms state.');
                },
                onExit: function ($log) {
                    $log.debug('Exiting the classrooms state.');
                }
            })
            .state('activities', {
                url: '/activities',
                controller: 'AllActivitiesController',
                controllerAs: 'activities',
                templateUrl: '/app/templates/allActivities.html',
                resolve: {
                    activities: function (dataService) {
                        return dataService.getAllActivities();
                    }
                },
                data: {
                    name: 'My Activity',
                    desc: 'Fun!'
                },
                foo: {
                    myFoo: 'bar'
                }
            })
            .state('classroom_parent', {
                abstract: true,
                url: '/classrooms/:id',
                templateUrl: '/app/templates/classroom_parent.html',
                controller: 'ClassroomController',
                controllerAs: 'classroom',
                params: {
                    classroomMessage: { value: 'Learning is fun!' }
                },
                resolve: {
                    classroom: function ($stateParams, dataService) {
                        return dataService.getClassroom($stateParams.id);
                    }
                }
            })
            .state('classroom_parent.classroom_summary', {
                url: '/summary',
                views: {
                    'classInfo': {
                        templateUrl: '/app/templates/classroom.html',
                        controller: 'ClassroomSummaryController',
                        controllerAs: 'classroomSummary'
                    },
                    'classMessage': {
                        templateUrl: '/app/templates/classroom_message.html',
                        controller: 'ClassroomMessageController',
                        controllerAs: 'classroomMessage'
                    }
                }
            })
            .state('classroom_parent.classroom_detail', {
                url: '/detail/{month}',
                views: {
                    'classInfo': {
                        templateUrl: '/app/templates/classroomDetail.html'
                    }
                }
            });


    }]);

    app.run(['$rootScope', '$log', function($rootScope, $log) {

        //$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //
        //    $log.debug('successfully changed states');
        //
        //    $log.debug('event', event);
        //    $log.debug('toState', toState);
        //    $log.debug('toParams', toParams);
        //    $log.debug('fromState', fromState);
        //    $log.debug('fromParams', fromParams);
        //});

        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {

            $log.error('The requested state was not found: ', unfoundState);

        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {

            $log.error('An error occurred while changing states: ', error);

            $log.debug('event', event);
            $log.debug('toState', toState);
            $log.debug('toParams', toParams);
            $log.debug('fromState', fromState);
            $log.debug('fromParams', fromParams);
        });

    }]);

}());