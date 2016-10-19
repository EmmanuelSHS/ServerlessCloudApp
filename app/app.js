var ebase = angular.module('EbaseApp', []);

ebase.factory('restfulFactory', function($http) {
    var factory = {};

    // main
    factory.create = function(url) {
        console.log("POST " + url);
        return $http.post(url, $scope.caform);
    };

    factory.read = function(url) {
        console.log("GET " + url);
        return $http.get(url);
    };

    factory.update = function(url) {
        console.log("PUT " + url);
        return $http.put(url, $scope.caform);
    };

    factory.delete = function(url) {
        console.log("DELETE " + url);
        return $http.delete(url);
    };

    return factory;
});

ebase.controller('FormController', function($scope, $http, restfulFactory) {
        var urlGate = 'https://zii2wwqfd2.execute-api.us-east-1.amazonaws.com/project_2_test';

        // record to be sent
        $scope.caform = {
            firstName: null,
            lastName: null,
            email: null,
            phoneNumber: null,
            address: null,

            id: null,
            street: null,
            streetNumber: null,
            city: null,
            zipCode: null
        };

        $scope.flag = 'none';
        $scope.succeed = false;
        $scope.msg = 'nothing';
        $scope.response = null;
        $scope.status = null;

        $scope.getFlag = function(flag) {
            if (flag === 'none') {
                return 'No Submission';
            } else {
                return flag;
            }
        };

        $scope.isSucceed = function(flag) {
            if (flag) {
                return 'Success';
            } else {
                if ($scope.flag === 'none') {
                    return 'No Submission';
                } else {
                    return 'Failed';
                }
            }
        };

        initform = function() {
            $scope.caform = {
                firstName: null,
                lastName: null,
                email: null,
                phoneNumber: null,
                address: null,

                id: null,
                street: null,
                streetNumber: null,
                city: null,
                zipCode: null
            };
        };

        // aux
        preCallback = function(response) {
            $scope.status = response.status;
            $scope.response = response;
            if ($scope.status == 200) {
                console.log(response.config.method + " Method succeeded");
                $scope.msg = response.config.method + " succeeded";
            } else {
                console.log(response.config.method + " Method failed with code " + $scope.status);
                if ($scope.status == 400) {
                    $scope.msg = "Input fields incomplete, Please fill";
                } else if ($scope.status == 404) {
                    $scope.msg = "Record not found";
                } else if ($scope.status == 405) {
                    $scope.msg = "Unsupported Catch " + $scope.status;
                }
            }
        };

        validated = function(attr) {
                if (attr === null) {
                    $scope.msg = attr + " is NULL";
                    console.log($scope.msg);
                    return false;
                }
            return true;
        };


        // connection with api gate way
        $scope.post = function() {
            console.log("Start POST " + JSON.stringify($scope.caform));
            $scope.flag = 'POST';

            // validation
            var attr;
            for (attr in $scope.caform) {
                if (!validated(attr)) {return;}
            }

            // create anyway to save calls
            //$scope.caform.address = '33';
            restfulFactory.create(urlGate + '/addresses' + '/' + $scope.caform.id);
            restfulFactory.create(urlGate + '/customers').then(function(response) {
                preCallback(response);
            }, function(response) {
                preCallback(response);
            });
            console.log("End POST " + JSON.stringify($scope.caform));
        };

        $scope.put = function() {
            // Assume if addr modified, we need to create & modify the reference
            console.log("Start PUT " + JSON.stringify($scope.caform));
            $scope.flag = 'PUT';

            // TODO: sync with backend
            if (!validated()) {return;}

            // get addr id first
            $scope.caform.address = 1;
            restfulFactory.update(urlGate + '/customers' + '/' + $scope.caform.email).then(function(response) {
                preCallback(response);
                restfulFactory.create(urlGate + '/addresses' + '/' + $scope.caform.id);
            }, function(response) {
                preCallback(response);
            });

            console.log("END PUT " + JSON.stringify($scope.caform));
        };

        $scope.del = function() {
            //
            console.log("Start DELETE " + JSON.stringify($scope.caform));
            $scope.flag = 'DELETE';

            if (!validated($scope.caform.email)) {return;}

            restfulFactory.delete(urlGate + '/customers' + '/' + $scope.caform.email).then(function(response) {
                preCallback(response);
            }, function(response) {
                preCallback(response);
            });

            console.log("END DELETE " + JSON.stringify($scope.caform));
        };

        $scope.get = function() {
            //
            console.log("Start GET " + JSON.stringify($scope.caform));
            $scope.flag = 'GET';
            if (!validated($scope.caform.email)) {return;}

            restfulFactory.read(urlGate + '/customers' + '/' + $scope.caform.email).then(function(response) {
                preCallback(response);
                if ($scope.status != 200) {
                    $scope.msg = 'User Not Exists';
                    return;
                }
                $scope.caform.firstName = response.data.firstName;
                $scope.caform.lastName = response.data.lastName;
                $scope.caform.phoneNumber = response.data.phoneNumber;

                restfulFactory.read(urlGate + '/addresses' + '/' + response.data.address.href).then(function(response) {
                    preCallback(response);
                    $scope.caform.id = response.data.id;
                    $scope.caform.street = response.data.street;
                    $scope.caform.streetNumber = response.data.streetNumber;
                    $scope.caform.city = response.data.city;
                    $scope.caform.zipCode = response.data.zipCode;
                }, function(response) {
                    preCallback(response);
                });

            }, function(response) {
                preCallback(response);
                return;
            });

            console.log("End GET " + JSON.stringify($scope.caform));
        };
    });
