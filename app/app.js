var ebase = angular.module('EbaseApp', ['ui.bootstrap']);

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

ebase.factory('sharedServices', function($http) {
    return {
        data: {
            hasLogin: false,
            profile: null,
            urlGate: 'https://zii2wwqfd2.execute-api.us-east-1.amazonaws.com/project3_test/app'
        },
        services: {
            generateParams: function(resource, op, params) {
                return {
                    resource_name: resource,
                    operation: op,
                    params: params
                }
            },
            post: function(url, params) {
                return $http.post(url, params);
            }
        }
    };
});

ebase.controller('LoginController', function($scope, $uibModal, sharedServices) {
    $scope.shared = sharedServices;
    $scope.openRegisterDialog = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'ProfileModal.html',
            controller: 'RegisterController'
        });
    };
    $scope.logout = function () {
        $scope.shared.data.hasLogin = false;
        $scope.shared.data.profile = null;
        console.log('logout...')
        FB.logout(function(response) {
          // user is now logged out
          //FB.Auth.setAuthResponse(null, 'unknown');

          console.log(response);
        });
    }

    $scope.openProfileDialog = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'ProfileModal.html',
            controller: 'ProfileController'
        });
    };



        // This is called with the results from from FB.getLoginStatus().
    $scope.statusChangeCallback = function(response) {
      console.log('statusChangeCallback');
      console.log(response);
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      //$scope.afterFbLogin();
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        $scope.afterFbLogin();
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        //document.getElementById('status').innerHTML = 'Please log ' +
          //'into this app.';
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        //document.getElementById('status').innerHTML = 'Please log ' +
         // 'into Facebook.';
      }
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    $scope.checkLoginState = function() {
      FB.getLoginStatus(function(response) {
        $scope.statusChangeCallback(response);
      });
    }

    $scope.facebookLogin = function() {
        //$scope.logout();
        FB.login(function(){
            console.log("checkLoginState....");
            $scope.checkLoginState();
        }, {scope: 'email,publish_actions'});
    }

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    $scope.afterFbLogin = function() {
        console.log('Logged in via Facebook');
        FB.api('/me', {fields: 'first_name,last_name,email'}, function(response) {
            console.log(response);
            $scope.shared.data.profile = {
                email: response.email,
                firstName: response.first_name,
                lastName: response.last_name
            };
            $scope.getAccountProfile(response.email);
            /*
            if ($scope.shared.data.profile == null) {
                $scope.shared.data.profile = response;
                $scope.openRegisterDialog();
            }
            */
            /*
            $scope.$apply(function () {
                $scope.form.email = response.email;
                $scope.form.lastName = response.last_name;
                $scope.form.firstName = response.first_name;
                if ($scope.fbHasSignedUp($scope.form.email)) {
                    $scope.shared.data.profile = response;
                    $scope.shared.data.hasLogin = true;
                    console.log($scope.shared.data.hasLogin);
                    console.log($scope.shared.data.profile);
                    $scope.closeModal();
                } else {
                    $scope.newUser = true;
                }
            });
            */
            console.log('apply'); 
        });
    }

    //TODO(chaozc)
    $scope.getAccountProfile = function(email) {
        params = $scope.shared.services.generateParams('customer', 'read', {email: email});
        successfulCallback = function(response) {
            console.log(response.data);
            if (response.data.status_code == 200) {
                $scope.shared.data.profile = response.data.response_body;
                $scope.shared.data.hasLogin = true;
            } else {
                $scope.openRegisterDialog();
            }
            /*
            $scope.$apply(function() {
                $scope.shared.data.hasLogin = true;
            });
            */
        };
        errorCallback = function(response) {
            console.log('bad:'+response.data);
        };
        console.log(params);
        console.log($scope.shared.data.urlGate);
        $scope.shared.services.post($scope.shared.data.urlGate, params).then(successfulCallback, errorCallback);
        //$scope.shared.data.profile = {first_name: "Zichen", last_name: "Chao", email: "zichen.chao@gmail.com", id: "2156565677901352"};
        //return $scope.shared.data.profile;
    }
})


ebase.controller('ProfileController', function($scope, $uibModalInstance, sharedServices) {
    $scope.shared = sharedServices;
    $scope.form = $scope.shared.data.profile;
    $scope.formValid = {
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        address: {
            street: true,
            streetNumber: true,
            city: true,
            zipCode: true
        }
    };
    $scope.closeModal = function(){
       $uibModalInstance.close();
       console.log('closed');
    }
    console.log($scope.form);
});


ebase.controller('RegisterController', function($scope, $http, $uibModalInstance, sharedServices) {
    $scope.shared = sharedServices;
    $scope.form = {
        email: $scope.shared.data.profile.email,
        firstName: $scope.shared.data.profile.firstName,
        lastName: $scope.shared.data.profile.lastName,
        phoneNumber: null,
        address: {
            street: null,
            streetNumber: null,
            city: null,
            zipCode: null
        }
    }


    $scope.formValid = {
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        address: {
            street: true,
            streetNumber: true,
            city: true,
            zipCode: true
        }
    }

    $scope.nonEmpty = function(st) {
        return st != null && st.length > 0;
    }

    $scope.isNumber = function(st) {
        if (!$scope.nonEmpty(st)) {
            return false;
        }
        for (var i = 0; i < st.length; ++i) {
            if (st[i] > '9' || st[i] < '0') {
                return false;
            }
        }
        return true;
    }

    $scope.checkRegisterValid = function() {
        $scope.formValid = {
            email: $scope.nonEmpty($scope.form.email),
            firstName: $scope.nonEmpty($scope.form.firstName),
            lastName: $scope.nonEmpty($scope.form.lastName),
            phoneNumber: $scope.isNumber($scope.form.phoneNumber),
            address: {
                street: $scope.nonEmpty($scope.form.address.street),
                streetNumber: $scope.isNumber($scope.form.address.streetNumber),
                city: $scope.nonEmpty($scope.form.address.city),
                zipCode: $scope.isNumber($scope.form.address.zipCode) && $scope.form.address.zipCode.length == 5
            }
        }
        for (var field in $scope.formValid) {
            if (!$scope.formValid.hasOwnProperty(field) || field == 'address') {
                continue;
            }
            if (!$scope.formValid[field]) {
                return false;
            }
        }
        for (var field in $scope.formValid.address) {
            if (!$scope.formValid.address.hasOwnProperty(field)) {
                continue;
            }
            if (!$scope.formValid.address[field]) {
                return false;
            }
        }
        return true;
    }

    $scope.register = function() {
        console.log($scope.form);
        if (!$scope.checkRegisterValid()) {
            return;
        }
        params = $scope.shared.services.generateParams('customer', 'create', $scope.form);
        successfulCallback = function(response) {
            console.log(response);
            console.log(response.data);
            if (response.data.status_code == 200) {
                $scope.shared.data.profile = $scope.form;
                $scope.closeModal();
                $scope.shared.data.hasLogin = true;
            } else {
                alert('Invalid Address');
            }
        };
        errorCallback = function(response) {
            console.log('bad:'+response.data);
        };
        console.log(params);
        console.log($scope.shared.data.urlGate);
        $scope.shared.services.post($scope.shared.data.urlGate, params).then(successfulCallback, errorCallback);
    }

    $scope.closeModal = function(){
       $uibModalInstance.close();
       console.log('closed');
    }
});


ebase.controller('ContentController', function($scope, $http, sharedServices, restfulFactory) {
    $scope.shared = sharedServices;
    $scope.contentLevels = ['Property', 'NBC'];
    $scope.currentLevel = 0;
    //$scope.contents = {'Property'};
    $scope.switchToLevel = function(level) {
        $scope.currentLevel = level;
    };

})


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
