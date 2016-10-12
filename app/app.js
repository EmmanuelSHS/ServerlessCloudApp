angular.module('EbaseApp', [])
    .controller('FormController', function($scope) {
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

        // connection with api gate way
        $scope.post = function(form) {
            $scope.setCust(form);
            $scope.setAddr(form);

            $scope.flag = 'post';
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
