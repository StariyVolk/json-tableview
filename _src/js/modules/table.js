/**
 * Created by vatiba01 on 11.06.2015.
 */
var tableClass = function(selector){
    var data = {};
    data.fields = [];
    data.types = [];
    data.fClasses = [];
    data.tClasses = [];

    /*
     Приватные методы
     */

    /*
    Функция реализует получение данных посредством ajax запроса
     */
    function getData(){
        $.ajax({
            url: "../json/data.json",
            dataType: "json",
            success: function(res){
                data.json = res;
                getCols(res);
            }
        });
    }

    /*
     Функция создает новый объект, с необходимыми данными
     */
    function getCols(res){
        var obj = {};

        if(data.fields.length || data.types.length){
            for (var key in res) {
                if(data.fields.indexOf(key) > -1 || data.fields.length == 0) {
                    for (var name in res[key]) {
                        if (!obj[key]) {
                            obj[key] = {};
                        }
                        if(data.types.indexOf(name) > -1  || data.types.length == 0) {
                            obj[key][name] = res[key][name];
                        }
                    }
                }
            }
        } else {
            for (var key in res) {
                obj[key] = res[key];
            }
        }
        createRows(obj);
    }

    /*
     Функция создает массив, по которому будет строиться таблица
     */
    function createRows(res){
        var result = [],
            col = 1,
            row = 1,
            name = '';

        result[0] = [{"value":"", "prefix":''}];
        for (var key in res) {
            result[0].push({"value":key, "prefix":''});
            for (var obj in res[key]) {
                name = '';
                if(typeof result[row] === "undefined"){
                    result[row] = [];
                }
                if(col == 1){
                    result[row][0] = {"value":obj};
                }

                if(data.fClasses[key]){
                    name += " " + data.fClasses[key];
                }
                if(data.tClasses[obj]){
                    name += " " + data.tClasses[obj];
                }

                result[row][col] = {"value":res[key][obj], "prefix":name};
                row++;
            }
            row = 1;
            col++;
        }

        showTable(result);
    }

    /*
     Функция реализует построение итоговой таблицы с данными
     */
    function showTable(res){
        var html = '';

        for (var i = 0; i < res.length; i++) {
            var row = res[i];
            html += "<tr>";
            for (var j = 0; j < row.length; j++) {
                var item = row[j];

                html += "<td class='" + item.prefix + "'>" + item.value + "</td>";
            }
            html += "</tr>";
        }
        data.table.append(html);
    }

    /*
     Функция необходима для очистки параметров фильтров при их изменении
     */
    function clearFIlter(){
        data.fields = [];
        data.types = [];
        data.fClasses = fieldClasses || [];
        data.tClasses = typeClasses || [];
    }

    return {
        /*
         Публичные методы
         */
        init: function(fields, types, fieldClasses, typeClasses){
            data.elem = $(selector).eq(0);
            data.table = $("<table></table>");
            data.elem.append(data.table);
            data.fields = fields || [];
            data.types = types || [];
            data.fClasses = fieldClasses || [];
            data.tClasses = typeClasses || [];
            getData();
        },
        showFilterBy: function(fields, types, fieldClasses, typeClasses){
            clearFIlter();
            data.table.html('');
            data.fields = fields || [];
            data.types = types || [];
            data.fClasses = fieldClasses || [];
            data.tClasses = typeClasses || [];
            data.fClasses = fieldClasses || [];
            data.tClasses = typeClasses || [];
            getCols(data.json);
        }
    }
};

var tabler = "";

$(function(){
    tabler = new tableClass("#table");
    tabler.init(["category1", "category2", "category3"],["type1", "type2", "type3", "type4"],{"category2":"class1"},{"type3":"class4"});
});