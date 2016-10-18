angular.module('EbaseApp', [])
    .controller('FormController', function($scope, $http) {
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
        $scope.aid = null;

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

        var urlGate = 'https://zii2wwqfd2.execute-api.us-east-1.amazonaws.com/project_2_test';

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

        callback = function(response) {
            $scope.status = response.status;
            $scope.response = response;
        };

        create = function(url) {
            $http.post(url, $scope.caform).then(callback, callback);
        };

        read = function(url) {
            $http.get(url).then(callback, callback);
        };

        update = function(url) {
            $http.put(url, $scope.caform).then(callback, callback);
        };

        delt = function(url) {
            $http.delete(url).then(callback, callback);
        };

        // connection with api gate way
        $scope.post = function() {
            $scope.flag = 'POST';

            // TODO: call get addr first, then update barcode

            $scope.caform.address = '33';
            //read(urlGate + '/addresses' + '/' + $scope.caform.id)
            create(urlGate + '/customers');
        };

        $scope.put = function() {
            //
            $scope.flag = 'PUT';
            // get addr id first
            $scope.caform.address = 1;
            update(urlGate + '/customers' + '/' + $scope.caform.email);
            // TODO: put here, we update addr to a specific aid, or assign to another aid?
        };

        $scope.del = function() {
            //
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
            $scope.flag = 'GET';
            read(urlGate + '/customers' + '/' + $scope.caform.email);

            //get addr id
            if ($scope.status == 200) {
                $scope.caform.firstName = $scope.response.data.firstName;
                $scope.caform.lastName = $scope.response.data.lastName;
                $scope.caform.phoneNumber = $scope.response.data.phoneNumber;

                read(urlGate + '/addresses' + '/' + $scope.response.data.address.href);
                if ($scope.status == 200) {
                    $scope.caform.street = $scope.response.data.street;
                    $scope.caform.streetNumber = $scope.response.data.streetNumber;
                    $scope.caform.city = $scope.response.data.city;
                    $scope.caform.zipCode = $scope.response.data.zipCode;
                } else {
                    $scope.msg = 'Address Not Exists';
                    initform();
                };
            } else {
                $scope.msg = 'User Not Exists';
            }
        };
    });
