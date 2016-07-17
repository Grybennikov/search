Object.equals = function(firstObj, secondObject) {
    if ((null == firstObj) || (null == secondObject)) return false; //null сравниваем правильно. Если хоть в одном операнде значит false
    if (('object' != typeof firstObj) && ('object' != typeof secondObject)) return firstObj == secondObject; //оба из простых - сравнение простых значений.
    else if (('object' != typeof firstObj) || ('object' != typeof secondObject)) return false; //сравнивается простое значение с объектом - всегда не равны
    //в этой точке только если сравниваем именно объекты (оба)   
    //отдельно для дат
    if ((firstObj instanceof Date) && (secondObject instanceof Date)) return firstObj.getTime() == secondObject.getTime(); //исключение для дат. сравним их по микросекундам
    else if ((firstObj instanceof Date) && (secondObject instanceof Date)) return false; //Если дата сравнивается с чем-то ещё -то всегда выдать несоответствие
    //далее сравниваем нормальные объекты
    var keysFirstObj = Object.keys(firstObj);
    var keysSecondObject = Object.keys(secondObject);
    if (keysFirstObj.length != keysSecondObject.length) {
        return false; }
    return !keysFirstObj.filter(function(key) {
        if (typeof firstObj[key] == "object" || Array.isArray(firstObj[key])) {
            return !Object.equals(firstObj[key], secondObject[key]);
        } else {
            return firstObj[key] !== secondObject[key];
        }
    }).length;
}


var search = angular.module("search", []);
search.controller("searchController", function($scope, $http) {
    $scope.result = [];
    $scope.ajaxReq = function() { //Функция, которая выполняет запрос к серверу, может быть любой файл
        $http({ url: 'players.json' }).
        success(function(data, status, headers, config) {
            filterResult($scope.input, data);
        });
    }

    var isInResult = function(object) { // Функция проверка есть ли игрок уже в результатах
        var i;
        for (i = 0; i < $scope.result.length; i += 1) {
            if (Object.equals(object, $scope.result[i])) {
                return true;
            }
        }
        return false;
    }

    var filterResult = function(input, data) { // Тут выполняем саму операцию поиска
        var i;
        $scope.result = []; // Обнулить прошлый результат поиска
        for (i = 0; i < data.length; i += 1) {
            for (key in data[i]) {

                //Сравниваем в нижнем регистре, чтобы поддерживать разный регистр
                // OSKar и oskaR дадут одинаковый результат

                var fullData = String(data[i][key]).toLowerCase();
                var searchingData = String(input).toLowerCase()
                if (fullData.indexOf(searchingData) != -1) { //Если подстрока содержится в значениях объекта – добавляем в результаты
                    if (isInResult(data[i])) {
                    	console.log("Is in result");
                        // Проверяем есть ли уже такой результат в выводе
                        // Если есть, прерываем цикл
                        continue;
                    }
                    $scope.result.push(data[i]);
                };
            };
        };
        if ($scope.result.length == 0) { // Если ничего не найдено сообщаем об этом
            $scope.result.push({ name: "Sorry not found!" })
        }

    };
});
