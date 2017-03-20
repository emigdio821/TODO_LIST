var app = angular.module('toDoApp', []);

app.controller('ToDoController', ['$scope', '$filter', function($scope, $filter) {
    $scope.tasks = [];
    $scope.tasks2 = $scope.tasks;
    $scope.itemsLeft = 0;
    $scope.currentTask;
    $scope.editIndex = false;

    $scope.onFilterTasks = function(value) {
        if (value == true) {
            $scope.disableInput = true;
        } else {
            $scope.disableInput = false;
        }

        if ($scope.tasks2.length > 0) {
            $scope.tasks = $filter('filter')($scope.tasks2, value);
        }
    }

    $scope.addTask = function() {
        if ($scope.editIndex === false) {
            $scope.tasks.push({
                task: $scope.task,
                done: false
            })
        } else {
            $scope.tasks[$scope.editIndex].task = $scope.task;
        }
        $scope.editIndex = false;
        $scope.task = '';
        $scope.tasks2 = $scope.tasks;
        calculateItemsLeft();
    }

    $scope.editTask = function(index) {
        $('#modalBody').show();
        $scope.currentTaskIdx = index;
        $scope.taskName = $scope.tasks[index].task;
        genericModalConfig('Edit Task', 'Update');
    }

    $scope.doneTask = function(index) {
        $scope.tasks[index].done = true;
        calculateItemsLeft();
    }

    $scope.unDoneTask = function(index) {
        $scope.tasks[index].done = false;
        calculateItemsLeft();
    }

    $scope.deleteTaskConfirm = function(index) {
        $('#modalBody').hide();
        $scope.currentTaskIdx = index;
        $scope.taskName = $scope.tasks[index].task;
        genericModalConfig('Delete Task (' + $scope.taskName + ')?', 'Delete');
    }

    $scope.handleEvents = function(newTaskName) {
        var action = $('#modalSubmitBtn')[0].textContent; //dummy action, action can be coming from service, etc.
        if (action == 'Delete') {
            $scope.tasks.splice($scope.currentTaskIdx, 1);
        } else if (action == 'Update') {
            $scope.tasks[$scope.currentTaskIdx].task = newTaskName;
        } else if (action == 'Delete All') {
            if ($scope.tasks.length > 0) {
                for (var i = $scope.tasks.length - 1; i >= 0; i--) {
                    if ($scope.tasks[i].done) {
                        $scope.tasks.splice(i, 1);
                    }
                }
            }
        }

        $('#genericModal').modal('toggle'); //close modal
        calculateItemsLeft();
    }

    $scope.onConfirmDeleteDoneTasks = function() {
        $('#modalBody').hide();
        genericModalConfig('Delete Done Tasks?', 'Delete All');
    }

    function genericModalConfig(modalTitle, buttonState) { //just to build the modal title and button text
        $('#genericModal').modal('show');
        $scope.modalTitle = modalTitle;
        $scope.buttonState = buttonState;
    }

    function calculateItemsLeft() {
        var tempArray = [];
        for (var i = 0; i < $scope.tasks.length; i++) {
            if (!$scope.tasks[i].done) {
                tempArray.push($scope.tasks[i]);
            }
        }
        $scope.itemsLeft = tempArray.length;
    }
}]);