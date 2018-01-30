(function () {

    angular.module('app')
        .factory('bookLoggerInterceptor', ['$q', '$log', bookLoggerInterceptor]);

    function bookLoggerInterceptor($q, $log) {

        return {
            request: requestInterceptor,
            responseError: responseErrorInterceptor

            // not yet implemented - all interceptors are optional
            // requestError
            // response
        };

        function requestInterceptor(config) {

            $log.debug('HTTP ' + config.method + ' request - ' + config.url);
            return config;

        }

        function responseErrorInterceptor(response) {

            $log.debug('HTTP ' + response.config.method + ' response error - ' + response.config.url);
            return $q.reject(response);

        }

    }

}());