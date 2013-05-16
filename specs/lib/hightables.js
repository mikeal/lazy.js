window.HighTables={};HighTables.charts={};$(document).ready(function(){Highcharts.setOptions({credits:{enabled:!!HighTables.includeHighchartsLinks}});var c={line:{engine:HighTables.LineChart},spline:{engine:HighTables.LineChart,options:{chart:{type:"spline"}}},area:{engine:HighTables.LineChart,options:{chart:{type:"area"}}},stack:{engine:HighTables.LineChart,options:{chart:{type:"area"},plotOptions:{area:{stacking:"normal"}}}},bar:{engine:HighTables.BarChart},column:{engine:HighTables.BarChart,options:{chart:{type:"column"}}},pie:{engine:HighTables.PieChart}};function e(j){var h=c[j].engine;var g=c[j].options;$("."+j+"-chart").each(function(){h.renderTo(this,g)})}function d(j){var h=c[j].engine;var g=c[j].options;$("table.render-to-"+j+"-chart").each(function(){h.renderFromTable(this,g)})}function f(){for(var g in c){e(g);d(g)}}function b(h){var j=$(h).attr("class").split(/\s+/);for(var g=0;g<j.length;++g){if(j[g].match(/^(?:line|spline|area|stack|bar|column|pie)-chart$/)){return j[g].replace(/-chart$/g,"")}}}function a(h){var j=$(h).attr("class").split(/\s+/);for(var g=0;g<j.length;++g){if(j[g].match(/^render-to-(?:line|spline|area|stack|bar|column|pie)-chart$/)){return j[g].replace(/^render-to-/g,"").replace(/-chart$/g,"")}}}HighTables.renderCharts=f;HighTables.renderChart=function(k){var j=b(k);var h=c[j].engine;var g=c[j].options;h.renderTo(k,g)};HighTables.renderChartFromTable=function(k){var j=a(chart);var h=c[j].engine;var g=c[j].options;h.renderFromTable(k,g)};f()});HighTables.Parse=function(){function b(e){var d=parseFloat(e&&e.replace(/^\$|,/g,""));return isNaN(d)?null:d}function a(f){var e=[];for(var d=0;d<f.length;++d){e.push(parseInt(f[d]))}return e}function c(h,d){var g=0;var f;var e=[];for(i=0;i<h.length;++i){if(h[i]==="..."){f=h[i+1]||d+1;while(g<f){e.push(g++)}}else{g=parseInt(h[i]);e.push(g++)}}return e}return{number:b,integers:a,integersWithRanges:c}}();HighTables.Base=function(d){d=$(d);var o;var k;var j;var n;var f={options:function(p){return h(p)},title:function(p){return{title:{text:p}}},order:function(p){return{order:p}},"x-interval":function(p){return{xAxis:{tickInterval:parseInt(p)}}},"x-min":function(p){return{xAxis:{min:parseInt(p)}}},"y-interval":function(p){return{yAxis:{tickInterval:parseInt(p)}}},"y-min":function(p){return{yAxis:{min:parseInt(p)}}}};function h(q){var r=q.split(".");var p=window;while(r.length>0){p=p[r.shift()]}return(typeof p==="function")?p():p}function g(){if(!n){if(d.is("table")){n=d}else{n=$(d.attr("data-source"))}}return n}function b(){var p={};var r;for(var q in f){r=d.attr("data-"+q);if(r){$.extend(p,f[q](r))}}return $.extend(p,{labelColumn:m(),valueColumns:e(),limit:l(),threshold:a(),transpose:c()})}function m(){return parseInt(d.attr("data-label-column"))}function e(){var p=d.attr("data-value-columns");if(p){return HighTables.Parse.integersWithRanges(p.split(","),g().find("tr:first th, tr:first td").length-1)}else{return null}}function l(){return parseInt(d.attr("data-limit"))}function a(){return parseFloat(d.attr("data-threshold"))}function c(){return d.attr("data-transpose")==="true"}this.getTable=g;this.options=function(){if(!o){o=b();o.labelColumn=this.labelColumn();o.valueColumns=this.valueColumns();o.limit=l();o.threshold=a();o.transpose=c()}return o};this.labelColumn=function(){if(typeof k==="undefined"){k=m()}return k};this.valueColumns=function(){if(typeof j==="undefined"){j=e()}return j};this.element=d};HighTables.Table=function(d){$.extend(this,new HighTables.Base(d));var k=this.element;var g;var b;var a;var f;var h;function c(m,n,l){if(n in m){return m[n]}return l}function e(l,m){m=m||{};var o=l.text()||l.find("input").val();var n;if(c(m,"numeric",true)){n=HighTables.Parse.number(o);if(!m.threshold||n>=m.threshold){return n}else{return null}}else{return o}}function j(o,n,m){var l=k.find("tr:nth-child("+(o+1)+")").find("th:nth-child("+n+"), td:nth-child("+n+")");return e(l,m)}this.getCellValue=e;this.getOrCreateChart=function(){if(!g){g=$("<div>").addClass("chart");g.attr("id","chart-"+$(".chart").length+1);g.insertBefore(k)}return g};this.firstRow=function(){if(!b){b=k.find("tr:first")}return b};this.bodyRows=function(){if(!a){a=k.find("tr:gt(0)")}return a};this.columnCount=function(){if(!f){f=this.firstRow().find("td,th").length}return f};this.rowCount=function(){if(!h){h=k.find("tr").length}return h};this.getColumnHeader=function(l){return e(this.firstRow().find("td:nth-child("+(l+1)+"),th:nth-child("+(l+1)+")"),{numeric:false})};this.getColumnData=function(m,l){l=l||{};var n=[];this.bodyRows().each(function(){var o=$(this).find("td:nth-child("+(m+1)+")");n.push(e(o,l))});if(l.limit){n=n.slice(0,l.limit)}if(l.order==="descending"){n.reverse()}return n};this.getRowHeader=function(l){return e(k.find("tr:nth-child("+(l+1)+")").find("td:first"),{numeric:false})};this.getRowData=function(m,l){l=l||this.options()||{};var o=[];if(l.valueColumns){for(var n=0;n<l.valueColumns.length;++n){o.push(j(m,l.valueColumns[n],l))}}else{k.find("tr:nth-child("+(m+1)+")").find("td:gt(0):not(.exclude-from-chart),th:gt(0):not(.exclude-from-chart)").each(function(){o.push(e($(this),l))})}return o}};HighTables.Chart=function(a){$.extend(this,new HighTables.Base(a))};HighTables.LineChart=function(){var a=HighTables.charts.line=[];function d(j,h){var g=h.labelColumn||0;return j.getColumnData(0,$.extend({},h,{numeric:false}))}function b(k,g){var j=[];var l=g.valueColumns;if(l){for(var h=0;h<l.length;++h){j.push({name:k.getColumnHeader(l[h]),data:k.getColumnData(l[h],g)})}}else{for(var h=1;h<k.columnCount();h++){j.push({name:k.getColumnHeader(h),data:k.getColumnData(h,g)})}}return j}function c(l,k,h){h=h||{};var g=d(l,h);var j=b(l,h);a.push(new Highcharts.Chart($.extend(true,{chart:{renderTo:k[0],type:"line"},xAxis:{categories:g},yAxis:{title:false},title:false,series:j},h)))}function f(h,g){var j=new HighTables.Chart(h);var k=new HighTables.Table(j.getTable()[0]);return c(k,j.element,$.extend({},j.options(),g))}function e(h,g){var j=new HighTables.Table(h);return c(j,j.getOrCreateChart(),$.extend({},j.options(),g))}return{renderTo:f,renderFromTable:e}}();HighTables.BarChart=function(){var c=HighTables.charts.bar=[];function e(j,h){if(h.transpose){return j.getColumnData(0,$.extend({},h,{numeric:false}))}else{return j.getRowData(0,$.extend({},h,{numeric:false}))}}function b(j){for(var h=0;h<j.length;++h){if(j[h]){return true}}return false}function a(o,k){var m=[];var n=k.transpose?o.columnCount():o.rowCount();var j=k.limit?Math.min(k.limit+1,n):n;var h;for(var l=1;l<j;l++){if(k.transpose){h={name:o.getColumnHeader(l),data:o.getColumnData(l,k)}}else{h={name:o.getRowHeader(l),data:o.getRowData(l,k)}}if(b(h.data)){m.push(h)}}return m}function d(m,l,j){j=j||{};var h=e(m,j);var k=a(m,j);c.push(new Highcharts.Chart($.extend(true,{chart:{renderTo:l[0],type:"bar"},xAxis:{categories:h},yAxis:{title:false},title:false,series:k},j)))}function g(j,h){var k=new HighTables.Chart(j);var l=new HighTables.Table(k.getTable()[0]);return d(l,k.element,$.extend({},k.options(),h))}function f(j,h){var k=new HighTables.Table(j);return d(k,k.getOrCreateChart(),$.extend({},k.options(),h))}return{renderTo:g,renderFromTable:f}}();HighTables.PieChart=function(){var j=HighTables.charts.pie=[];function h(l){if(l.valueColumns){return"nth-child("+l.valueColumns[0]+")"}else{return"last-child"}}function b(m,l){return m.getCellValue(m.firstRow().find("th:"+h(l)),{numeric:false})}function c(l,m){return l.getCellValue($(m).find("td:first"),{numeric:false})}function d(m,n,l){return m.getCellValue($(n).find("td:"+h(l)))}function f(n,l){var m=[];n.bodyRows().each(function(){var o=c(n,this);var p=d(n,this,l);if(o&&p){m.push([o,p])}});return m}function k(n,m){var l=b(n,m);var o=f(n,m);return[{type:"pie",name:l,data:o}]}function a(o,n,l){l=l||{};var m=k(o,l);j.push(new Highcharts.Chart($.extend(true,{chart:{renderTo:n[0],type:"pie"},title:false,series:m},l)))}function g(m,l){var n=new HighTables.Chart(m);var o=new HighTables.Table(n.getTable()[0]);return a(o,n.element,$.extend({},n.options(),l))}function e(m,l){var n=new HighTables.Table(m);return a(n,n.getOrCreateChart(),$.extend({},n.options(),l))}return{renderTo:g,renderFromTable:e}}();