'use strict';

/* Controllers */

angular.module('myApp.controllers', ['timer']).
    controller('AppCtrl', function ($scope, socket) {
        $scope.orders = [];

        socket.on('send:name', function (data) {
            $scope.name = data.name;
        });

        socket.on('send:order', function (data) {
            //$scope.orders.push(data);
            var inserted = false;
            for(var i=0;i<$scope.orders.length;i++) {
                if($scope.orders[i]['Number'] == data['Number']) {
                    $scope.orders[i] = data;
                    inserted = true;
                }
            }
            if(!inserted)
                $scope.orders.push(data);
        });

        $scope.isOrderAllDone = function(order) {
            
        }

        $scope.done = function(ordernumber, itemid) {
            socket.emit('send:done', {'ordernumber': ordernumber, 'item':itemid});
        };

        $scope.undone = function(ordernumber, itemid) {
            socket.emit('send:undone', {'ordernumber': ordernumber, 'item':itemid});
        };

        $scope.gettime = function() {
            return 5;
        }

        $scope.t = 1422751821389;// Date.now() - 60000;

        $scope.timelapse = function(created) {
            var min = Math.floor((Date.now() - Date.parse(created)) / 60000);
            //console.log(min);
            return min;
        }

        $scope.startTime = function(order) {
            //"2015-01-03 11:42:44.128" should be turned into "2015-01-03T11:42:44.128"
            //console.log(order);
            var created = order['Date Created'];
            created = created.replace(" ", "T");
            //console.log(created);
            //console.log(typeof created);
            var cc = Date.parse(created);
            //console.log(typeof cc);
            //console.log(cc);
            return cc;
        }

    }).
    controller('MyCtrl1', function ($scope, socket) {

        socket.on('send:time', function (data) {
            $scope.time = data.time;
        });

    }).
    controller('MyCtrl2', function ($scope) {
        // write Ctrl here
    });
