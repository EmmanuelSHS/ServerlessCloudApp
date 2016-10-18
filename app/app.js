angular.module('EbaseApp', [])
    .controller('FormController', function($scope, $http) {
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
        $scope.addrid = null;

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
        callback = function(response) {
            $scope.status = response.status;
            //$scope.response = response;
            if ($scope.status == 200) {
                console.log("Method succeeded");
            } else {
                console.log("Method failed with code " + $scope.status);
            }
            return response;
        };

        validation = function() {
            
        };

        // main
        create = function(url) {
            console.log("POST " + url);
            $http.post(url, $scope.caform).then(callback, callback);
        };

        read = function(url) {
            console.log("GET " + url);
            $http.get(url).then(callback, callback);
        };

        update = function(url) {
            console.log("PUT " + url);
            $http.put(url, $scope.caform).then(callback, callback);
        };

        delt = function(url) {
            console.log("DELETE " + url);
            $http.delete(url).then(callback, callback);
        };

        // connection with api gate way
        $scope.post = function() {
            console.log("Start POST " + JSON.stringify($scope.caform));
            $scope.flag = 'POST';

            // TODO: call get addr first, then update barcode

            //$scope.caform.address = '33';
            //read(urlGate + '/addresses' + '/' + $scope.caform.id)
            create(urlGate + '/customers');
        };

        $scope.put = function() {
            //
            console.log("Start PUT " + JSON.stringify($scope.caform));
            $scope.flag = 'PUT';
            // get addr id first
            $scope.caform.address = 1;
            update(urlGate + '/customers' + '/' + $scope.caform.email);
            // TODO: put here, we update addr to a specific aid, or assign to another aid?
        };

        $scope.del = function() {
            //
            console.log("Start DELETE " + JSON.stringify($scope.caform));
            $scope.flag = 'DELETE';
            delt(urlGate + '/customers' + '/' + $scope.caform.email);

            if ($scope.status == 200) {
                $scope.msg = "Deleted";
            } else {
                $scope.msg = "Failed, please check syntax";
            };
        };

        $scope.get = function() {
            //
            console.log("Start GET " + JSON.stringify($scope.caform));
            $scope.flag = 'GET';
            // TODO: find a way to allow locking here
            read(urlGate + '/customers' + '/' + $scope.caform.email).then(function(data) {
                if ($scope.status != 200) {
                    $scope.msg = 'User Not Exists';
                    return;
                }
                $scope.caform.firstName = data.data.firstName;
                $scope.caform.lastName = data.data.lastName;
                $scope.caform.phoneNumber = data.data.phoneNumber;

            });

            //get addr id
            //if ($scope.status != 200) {
            //    $scope.msg = 'User Not Exists';
            //    return;
            //};

            //$scope.caform.firstName = $scope.response.data.firstName;
            //$scope.caform.lastName = $scope.response.data.lastName;
            //$scope.caform.phoneNumber = $scope.response.data.phoneNumber;

            //read(urlGate + '/addresses' + '/' + $scope.response.data.address.href);
            //if ($scope.status == 200) {
            //    $scope.caform.street = $scope.response.data.street;
            //    $scope.caform.streetNumber = $scope.response.data.streetNumber;
            //    $scope.caform.city = $scope.response.data.city;
            //    $scope.caform.zipCode = $scope.response.data.zipCode;
            //} else {
            //    $scope.msg = 'Address Not Exists';
            //    initform();
            //};
        };
    });
