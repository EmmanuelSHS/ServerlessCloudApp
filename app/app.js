angular.module('EbaseApp', [])
    .controller('FormController', function($scope, $http) {
        // record to be sent
        $scope.caform = {
            firstname: null,
            lastname: null,
            email: null,
            phone: null,

            street: null,
            number: null,
            city: null,
            zip: null
        };

        $scope.cust = {
            firstname: null,
            lastname: null,
            email: null,
            phone: null,
        }

        $scope.addr = {
            street: null,
            number: null,
            city: null,
            zip: null
        }

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


        $scope.setCust = function(form) {
            $scope.cust.firstname = $scope.caform.firstname;
            $scope.cust.lastname = $scope.caform.lastname;
            $scope.cust.email = $scope.caform.email;
            $scope.cust.phone = $scope.caform.phone;
        };

        $scope.setAddr = function(form) {
            $scope.addr.street = $scope.caform.street;
            $scope.addr.number = $scope.caform.number;
            $scope.addr.city = $scope.caform.city;
            $scope.addr.zip = $scope.caform.zip;
        }


        var url = 'https://zii2wwqfd2.execute-api.us-east-1.amazonaws.com/project_2_test';

        makeReq = function(mtdData, mtd, mtdUrl) {
            var req = {
                method: mtd,
                url: mtdUrl,
                data: mtdData
            }
            return req;
        };

        makeCustData = function(form) {
            var data = {
                'email': form.email,
                'address': '1',
                'firstName': form.firstname,
                'lastName' : form.lastname,
                'phoneNumber': form.phone
            };

            return data;
        }

        sucCallback = function(response) {
            $scope.response = response.message;
            $scope.isSucceed = true;
        }

        errCallback = function(response) {
            $scope.response = response.message;
            $scope.isSucceed = false;
        }

        // connection with api gate way
        $scope.post = function(form) {
            $scope.setCust(form);
            $scope.setAddr(form);

            $scope.flag = 'POST';

            custData = makeCustData($scope.form);
            custReq = makeReq(custData, $scope.flag, url + '/customers');
            $http.post(custReq, data).then(sucCallback, errCallback);
        };

        $scope.put = function(form) {
            //
            $scope.setCust(form);
            $scope.setAddr(form);
            
            $scope.flag = 'put';
        };

        $scope.delete = function(form) {
            //
            $scope.setCust(form);

            $scope.flag = 'delete';
        };

        $scope.get = function(form) {
            //
            $scope.setCust(form);

            $scope.flag = 'get';
        };
    })
