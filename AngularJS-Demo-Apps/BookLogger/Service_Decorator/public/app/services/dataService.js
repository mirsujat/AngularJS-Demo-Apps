(function() {

    angular.module('app')
        .factory('dataService', ['$q', '$timeout', '$http', 'constants', '$cacheFactory', dataService]);


    function dataService($q, $timeout, $http, constants, $cacheFactory) {

        return {
            getAllBooks: getAllBooks,
            getAllReaders: getAllReaders,
            getBookByID: getBookByID,
            updateBook: updateBook,
            addBook: addBook,
            deleteBook: deleteBook,
            getUserSummary: getUserSummary
        };

        function getUserSummary() {

            var deferred = $q.defer();

            var dataCache = $cacheFactory.get('bookLoggerCache');

            if (!dataCache) {
                dataCache = $cacheFactory('bookLoggerCache');
            }

            var summaryFromCache = dataCache.get('summary');

            if (summaryFromCache) {

                console.log('returning summary from cache');
                deferred.resolve(summaryFromCache);

            } else {

                console.log('gathering new summary data');

                var booksPromise = getAllBooks();
                var readersPromise = getAllReaders();

                $q.all([booksPromise, readersPromise])
                    .then(function (bookLoggerData) {

                        var allBooks = bookLoggerData[0];
                        var allReaders = bookLoggerData[1];

                        var grandTotalMinutes = 0;

                        allReaders.forEach(function (currentReader, index, array) {
                            grandTotalMinutes += currentReader.totalMinutesRead;
                        });

                        var summaryData = {
                            bookCount: allBooks.length,
                            readerCount: allReaders.length,
                            grandTotalMinutes: grandTotalMinutes
                        };

                        dataCache.put('summary', summaryData);
                        deferred.resolve(summaryData);

                    });

            }

            return deferred.promise;

        }

        function deleteSummaryFromCache() {

            var dataCache = $cacheFactory.get('bookLoggerCache');
            dataCache.remove('summary');

        }

        function getAllBooks() {

            return $http({
                method: 'GET',
                url: 'api/books',
                headers: {
                    'PS-BookLogger-Version': constants.APP_VERSION
                },
                transformResponse: transformGetBooks,
                cache: true
            })
            .then(sendResponseData)
            .catch(sendGetBooksError)

        }

        function deleteAllBooksResponseFromCache() {

            var httpCache = $cacheFactory.get('$http');
            httpCache.remove('api/books');

        }


        function transformGetBooks(data, headersGetter) {

            var transformed = angular.fromJson(data);

            transformed.forEach(function (currentValue, index, array) {
                currentValue.dateDownloaded = new Date();
            });

            //console.log(transformed);
            return transformed;

        }

        function sendResponseData(response) {

            return response.data;

        }

        function sendGetBooksError(response) {

            return $q.reject('Error retrieving book(s). (HTTP status: ' + response.status + ')');

        }

        function getBookByID(bookID) {

            return $http.get('api/books/' + bookID)
            .then(sendResponseData)
            .catch(sendGetBooksError);

        }

        function updateBook(book) {

            deleteSummaryFromCache();
            deleteAllBooksResponseFromCache();

            return $http({
                method: 'PUT',
                url: 'api/books/' + book.book_id,
                data: book
            })
            .then(updateBookSuccess)
            .catch(updateBookError);

        }

        function updateBookSuccess(response) {

            return 'Book updated: ' + response.config.data.title;

        }

        function updateBookError(response) {

            return $q.reject('Error updating book.(HTTP status: ' + response.status + ')');

        }

        function addBook(newBook) {

            deleteSummaryFromCache();
            deleteAllBooksResponseFromCache();

            return $http.post('api/books', newBook, {
                transformRequest: transformPostRequest
            })
            .then(addBookSuccess)
            .catch(addBookError);
        }

        function transformPostRequest(data, headersGetter) {

            data.newBook = true;

            console.log(data);

            return JSON.stringify(data);
        }

        function addBookSuccess(response) {

            return 'Book added: ' + response.config.data.title;

        }

        function addBookError(response) {

            return $q.reject('Error adding book. (HTTP status: ' + response.status + ')');

        }

        function deleteBook(bookID) {

            deleteSummaryFromCache();
            deleteAllBooksResponseFromCache();

            return $http({
                method: 'DELETE',
                url: 'api/books/' + bookID
            })
                .then(deleteBookSuccess)
                .catch(deleteBookError);

        }

        function deleteBookSuccess(response) {

            return 'Book deleted.';

        }

        function deleteBookError(response) {

            return $q.reject('Error deleting book. (HTTP status: ' + response.status + ')');

        }

        function getAllReaders() {

            var readersArray = [
                {
                    reader_id: 1,
                    name: 'Marie',
                    weeklyReadingGoal: 315,
                    totalMinutesRead: 5600
                },
                {
                    reader_id: 2,
                    name: 'Daniel',
                    weeklyReadingGoal: 210,
                    totalMinutesRead: 3000
                },
                {
                    reader_id: 3,
                    name: 'Lanier',
                    weeklyReadingGoal: 140,
                    totalMinutesRead: 600
                }
            ];

            var deferred = $q.defer();

            $timeout(function() {

                deferred.resolve(readersArray);

            }, 1500);

            return deferred.promise;
        }
    }

}());