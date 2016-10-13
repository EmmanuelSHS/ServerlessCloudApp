angular.module('EbaseApp', [])
    .controller('FormController', function($scope, $http) {
        // record to be sent
        $scope.caform = {
            firstname: null,
            lastname: null,
            email: null,
            phone: null,
            aidRef: null,

            aid: null,
            street: null,
            number: null,
            city: null,
            zip: null
        };

        $scope.data = {
            'email': null,
            'address': null,
            'firstName': null,
            'lastName' : null,
            'phoneNumber': null,

            'id': null,
            'street': null,
            'streetNumber': null,
            'city': null,
            'zipCode': null 
        };

        $scope.cust = {
            firstname: null,
            lastname: null,
            email: null,
            phone: null
        };

        $scope.addr = {
            street: null,
            number: null,
            city: null,
            zip: null
        };

        $scope.flag = 'none';
        $scope.succeed = false;
        $scope.response = null;

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

        /* depreciated
        makeReq = function(mtdData, mtd, mtdUrl) {
            var req = {
                method: mtd,
                url: mtdUrl,
                data: mtdData
            };
            return req;
        };
        */

        makeData = function() {
            var data = {
                'email': $scope.caform.email,
                'address': null,
                'firstName': $scope.caform.firstname,
                'lastName' : $scope.caform.lastname,
                'phoneNumber': $scope.caform.phone,

                'id': null,
                'street': $scope.caform.street,
                'streetNumber': $scope.caform.number,
                'city': $scope.caform.city,
                'zipCode': $scope.caform.zip
            } 
        }

        // TODO: setter for table attributes
        setAttri = function(field, value) {};

        create = function(url) {
            $http.post(url, makeData()).then(function(response) {$scope.response = response.message});
        };

        read = function(url) {
            
        };

        update = function(url) {

        };

        delt = function(url) {
            
        };

        // connection with api gate way
        $scope.post = function(form) {
            $scope.flag = 'POST';

            // call get addr first, then update barcode
            //custData = makeCustData();
            //$http.post(urlGate + '/customers', custData).then(callBack);
            create(urlGate + '/customers')
        };

        $scope.put = function(form) {
            //
            $scope.flag = 'PUT';
        };

        $scope.del = function(form) {
            //
            $scope.flag = 'DELETE';
        };

        $scope.get = function(form) {
            //
            $scope.flag = 'GET';
        };
    });
