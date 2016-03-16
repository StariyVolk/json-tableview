/**
 * Created by vatiba01 on 11.06.2015.
 */
var tableClass = function(selector){
    var data = {};
    data.fields = [];

    function getData(){
        $.ajax({
            url: "../json/data.json",
            dataType: "json",
            success: function(res){
                data.json = res;
                getByField(res);
            }
        });
    }

    function getByField(res){
        var obj = {};

        if(typeof data.fields !== 'undefined'){
            for (var key in res) {
                if(data.fields.indexOf(key) > -1){
                    obj[key] = res[key];
                }
            }
        } else {
            for (var key in res) {
                obj[key] = res[key];
            }
        }

        createRows(obj);

    }

    function createRows(res){
        var result = [],
            col = 1,
            row = 1;

        result[0] = [''];
        for (var key in res) {
            result[0].push(key);
            for (var obj in res[key]) {
                if(typeof result[row] === "undefined"){
                    result[row] = [];
                }
                if(col == 1){
                    result[row][0] = obj;
                }
                result[row][col] = res[key][obj];
                row++;
            }
            row = 1;
            col++;
        }

        showTable(result);
    }

    function showTable(res){
        console.log(res);
        var html = '';

        for (var i = 0; i < res.length; i++) {
            var row = res[i];
            html += "<tr>";
            for (var j = 0; j < row.length; j++) {
                var item = row[j];

                html += "<td>" + item + "</td>";
            }
            html += "</tr>";
        }
        data.table.append(html);
    }

    return {
        init: function(fields){
            data.elem = $(selector).eq(0);
            data.table = $("<table></table>");
            data.elem.append(data.table);
            data.fields = fields;
            getData();
        },
        showFields: function(fields){
            data.table.html('');
            data.fields = fields;
            getByField(data.json);
        }
    }
};

var tabler = "";

$(function(){
    tabler = new tableClass("#table");
    tabler.init();
});