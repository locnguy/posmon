'use strict';

/* Controllers */

angular.module('myApp.controllers', ['timer']).
    controller('AppCtrl', function ($scope, socket) {
        $scope.orders = [];
		
		$scope.shownorders = [];
		
		$scope.seehistory = false;
		$scope.toggleHistory = function() {
			console.log("HERE");
			console.log($scope.seehistory);
			$scope.seehistory = !$scope.seehistory;
			console.log($scope.seehistory);
			$scope.shownorders = $scope.filterOrders();
		};
        
        $scope.tlr = [
            {'Viet Coffee' : 'Cafe'},
            {'COLD' : 'Lanh'},
                {'BBQ BM' : 'Banh Mi BBQ'},
        ];
        
        $scope.getDescription = function(item) {
            var desc = item["Receipt Description"];
            for(var i=0;i<$scope.tlr.length;i++) {
                /*console.log("-s-");
                console.log(desc);
                console.log($scope.tlr[i][desc]);
                console.log("-e-");*/
                if($scope.tlr[i][desc] != undefined) {
                    return $scope.tlr[i][desc];
                }
            }
            return desc;
        }
		
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
			
			$scope.shownorders = $scope.filterOrders();
        });

        $scope.filterOrders = function() {
			var sorders = [];
			for(var i=0;i<$scope.orders.length;i++) {
				if(($scope.orders[i]['mon_all_done'] == 1 && $scope.seehistory == 1) ||
					($scope.orders[i]['mon_all_done'] != 1 && $scope.seehistory != 1))
					sorders.push($scope.orders[i]);
			}
			return sorders;
        }

        $scope.done = function(ordernumber, itemid) {
            socket.emit('send:done', {'ordernumber': ordernumber, 'item':itemid});
        };

        $scope.undone = function(ordernumber, itemid) {
            socket.emit('send:undone', {'ordernumber': ordernumber, 'item':itemid});
        };
		
		$scope.alldone = function(ordernumber) {
			socket.emit('send:alldone', {'ordernumber': ordernumber});
		};
        
        $scope.undoalldone = function(ordernumber) {
            socket.emit('send:undoalldone', {'ordernumber': ordernumber});
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
