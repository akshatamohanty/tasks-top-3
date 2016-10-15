var app = angular.module('top3', []);

app.controller('todayController',
              function($scope){

                   var daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                  
                   var date = new Date();
                   var day = daysOfTheWeek[date.getDay()];
                   date = date.getUTCDate() + "-" + date.getUTCMonth() + "-" + date.getUTCFullYear()

                   $scope.today = day;
                   $scope.heading = "Priorities for Today";

                   $scope.isDone = false;


                   $scope.tasks = [];
                   $scope.new_task = { 'name' : '', 'status':'incomplete'};


                   refresh();

                   function checkIsDone(){

                      var flag = arguments[0];
                      if( flag === undefined){
                        flag = 0;
                        $scope.tasks.map(function(tsk){

                            if(tsk.status == 'complete')
                                  flag++;
                        })
                      }

                      if(flag == 1){
                        chrome.browserAction.setIcon({   path : "img/two.png" })
                      }

                      else if(flag == 2){
                        chrome.browserAction.setIcon({   path : "img/one.png" })
                      }

                      else if(flag === 3){
                        //chrome.storage.sync.clear();
                        chrome.browserAction.setIcon({   path : "img/check.png" })
                        $scope.isDone = true;

                      }

                      else{
                        chrome.browserAction.setIcon({   path : "img/three.png" })
                      }
                   
                   }


                   function update(){

                      var json = {};
                      json[date] = $scope.tasks;


                      chrome.storage.sync.set(json);                   
 

                   }

                   function refresh(){
                      
                      chrome.browserAction.setIcon({   path : "img/three.png" });
                      chrome.storage.sync.get(function(items){

                          if(items[date] !== undefined){
                              $scope.tasks = items[date]; 
                              console.log("Updated tasks from storage", $scope.tasks); 
                              $scope.$digest();

                              
                              checkIsDone(); 
                          }
                          else{
                              update();
                          }

                      });    

                            
    
                   }

                   $scope.completed = function(task){

                      var flag = 0;
                      $scope.tasks.map(function(tsk){
                          
                          if(tsk.name === task.name){
                            tsk.status = tsk.status === 'incomplete' ? 'complete' : 'incomplete';
                            console.log(1);
                          }
                          if(tsk.status == 'complete')
                                flag++;
                      })

                      update();

                      checkIsDone(flag);
                      
                   }


                   $scope.addTask = function(){
                      
                      var flag = false; 
                      $scope.tasks.map(function(tsk){
                          
                          if(tsk.name ===  $scope.new_task.name){
                            flag = true;
                          }
                      
                      })

                      if(flag == false){
                        
                        $scope.tasks.push( { 'name': $scope.new_task.name, 'status': $scope.new_task.status } );

                        update();

                        $scope.new_task.name = "";
                      }
                      else{
                         alert("Duplicate Task!")
                      }
                   }

                   $scope.reset = function(){

                        var json = {};
                        json[date] = $scope.tasks;


                        $scope.isDone = false;
                        $scope.tasks = [];
                        update();

                        chrome.browserAction.setIcon({   path : "img/three.png" });

                   }

              });

<!-- http://stackoverflow.com/questions/15417125/submit-form-on-pressing-enter-with-angularjs -->
app.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });



app.directive('task', function() {
        return function(scope, element, attrs) {
            
            element.bind("click", function(event) {
                
                 //scope.$parent.finished = true; 

            });
        
        };
    });


