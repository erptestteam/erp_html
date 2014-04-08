﻿var tracking_data = [];
var entity_edit_model = {
    menu : null,
    url_view_index : 0,
    url_view : erp_api_service.VFeedingTracking,
    url_ent_index : 0,
    url_ent : erp_api_service.EntFeeding,
    top_menu : null,
    default_pages_size : 15,// 默认页面大小
    pages_size : [ 10, 15, 30, 50, 100 ],// 定义分页时 页面的大小级别
    innerGrid : [],
    dispaly_columns : [ {
        display : '主键',
        name : 'id',
        filter : false,
        width : 50,
        type : 'int'
    }, {
        display : '部品编号',
        name : 'item_number',
        // width : 150,
        editor: { type: 'string'},
        type : 'int'
    }, {
        display : '投料数量',
        name : 'feeding_count',
        editor: { type: 'int'},
        width : 100
    }, {
        display : '投料日期',
        name : 'feeding_date',
        editor: { type: 'date'},
        width : 150,
        type : 'date',
        format : 'yyyy-MM-dd hh:mm:ss'
    }, {
		display : '投料单状态',
		name : 'storage_mark',
		width : 70,
		render : function(rowdata, rowindex, value) {
			if (value + '' == '0') {
				return "未入库";
			}
			if (value + '' == '1') {
				return "已入库";
			}
		}
	}, {
		display : '已完成工序',
		name : 'feeding_status_now',
		width : 80
	}, {
		display : '总共工序',
		name : 'feeding_status_all',
		width : 80
	}, {
        display : '添加时间',
        name : 'i_time',
        width : 150,
        type : 'date',
        format : 'yyyy-MM-dd hh:mm:ss'
    }, {
        display: '操作', isSort: false, width: 120, filter:false,
        render: function (rowdata, rowindex, value) {
            var h = "";
            if (!rowdata._editing) {
                h += "<a href='javascript:beginEdit(" + rowindex + ")'>修改</a> ";
                h += "<a href='javascript:deleteRow(" + rowindex + ")'>删除</a> ";
            }
            else {
                h += "<a href='javascript:endEdit(" + rowindex + ")'>提交</a> ";
                h += "<a href='javascript:cancelEdit(" + rowindex + ")'>取消</a> ";
            }
            return h;
        }
    } ]
};
$(function() {
    $.ajax({
        type : 'GET',
        url : erp_api_service.EntFeeding[0] + "?callback=?&limit=1000",
        dataType : 'json',
        cache : false,
        async : true,
        success : function(data) {
            if (data && data.objects) {
                var res = data.objects;
                console_info(res);
                if (res instanceof Array && res.length > 0) {
                    for ( var i in res) {
                        tracking_data.push(res[i]);
                    }
                } else {
                    tipOnce("提示", "获取投料单信息失败,请刷新。", 10000);
                }
            } else {
                tipOnce("提示", "获取投料单信息失败,请刷新。", 10000);
            }
        },
        error : function(XMLHttpRequest) {
            tipOnce("提示", "获取投料单信息失败,请刷新。", 10000);
        }
    });
    $(f_initGrid);
});
$.ligerDefaults.Grid.editors['textarea'] = {
	create: function (container, editParm) {
		var input = $("<textarea />");
		container.append(input);
		container.width('auto').height('auto');
		return input;
	},
	getValue: function (input, editParm) {
		return input.val();
	},
	setValue: function (input, value, editParm) {
		input.val(value);
	},
	resize: function (input, width, height, editParm) {
		var column = editParm.column;
		input.width(column.editor.width);
		input.height(column.editor.height);
	}
};
function f_initGrid() {
    // 添加顶层菜单栏
    $("#top_menu").ligerMenuBar({
        items : [ {
            text : '文件',
            menu : {
                width : 120,
                items : [ {
                    text : '保存',
                    click : function() {
                    }
                }, {
                    text : '列存为',
                    click : function() {
                    }
                }, {
                    line : true
                }, {
                    text : '关闭',
                    click : function() {
                    }
                } ]
            }
        } ]
    });
    // 鼠标右键
    entity_edit_model.menu = $.ligerMenu({
        top : 100,
        left : 100,
        width : 120,
        items : []
    });
    $("#item").bind("contextmenu", function(e) {
        entity_edit_model.menu.show({
            top : e.pageY,
            left : e.pageX
        });
        return false;
    });
    $.ligerDefaults.Filter.operators['string'] = $.ligerDefaults.Filter.operators['text'] = [
            "like", "equal", "notequal", "startwith", "endwith" ];
    $.ligerDefaults.Filter.operators['int'] = [ "equal", "notequal" ];
    entity_edit_model.manager = $("#item").ligerGrid(
        ERPUtils.get_default_grid_option_for_url({
        url : entity_edit_model.url_view[entity_edit_model.url_view_index],
        columns : entity_edit_model.dispaly_columns,
        toolbar : {
        items : [
                 {
                     text : '高级自定义查询',
                     click : function() {
                         entity_edit_model.manager.showFilter("#filter");
                         },
                     icon : 'search2'
                 },
                 { line : true },
                 {
                     text : '添加投料单',
                     click : function() {
                    	 entity_edit_model.manager.addEditRow();
                     },
                     icon: 'add'
                 },
                 { line : true },
                 { text: '删除',click:function(){
                 	if(confirm('确定删除'+entity_edit_model.checked_record.join(',')+'?'))
                 	{
                 		console_info(entity_edit_model.checked_record.join(','));
                 		var errors=[];
                 		var rights=[];
                     	if(entity_edit_model.checked_record&&entity_edit_model.checked_record.length>0)
                     	{
                     		for(var i in entity_edit_model.checked_record)
                     		{
                     			if(!deleteById(entity_edit_model.checked_record[i],true))
                     				errors.push(entity_edit_model.checked_record[i]);
                     			else
                     				rights.push(entity_edit_model.checked_record[i]);
                     		}
                     		entity_edit_model.manager.reload();
                     		if(errors.length>0)
                     			tipOnce("提示", Util.formatString("[{0}]删除失败", errors.join(",")), 10000);
                     		else
                     			tipOnce("提示", Util.formatString("[{0}]删除成功", rights.join(",")), 5000);
                     	}
                 	}
                 }, img: '../lib/ligerUI/ligerUI/skins/icons/delete.gif' }
                 ]
        },
        onBeforeSubmitEdit:function()
        {
        	console_info(arguments[0]);
            var param;
            if (arguments[0].record.__status == "add") {
                param = {
                    url: entity_edit_model.url_ent[entity_edit_model.url_ent_index],
                    method: "POST",
                    data: Util.extend(arguments[0].record, arguments[0].newdata)
                    // encode:"utf-8"
                };
            }
            else {
            	console_info(arguments[0]);
                param = {
                    url: entity_edit_model.url_ent[entity_edit_model.url_ent_index] + 
                    								arguments[0].record.id,
                    method: "PATCH",
                    // data: Util.extend(arguments[0].record,
					// arguments[0].newdata)
                    data:arguments[0].newdata
                    // encode:"utf-8"
                };
            }
            var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
            alert(JSON.stringify(res));
            if (res != null && res.status > 199 && res.status<300) {
                tipOnce("提示", "修改成功", 5000);
                return true;
            }
            else {
                tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
                return false;
            }
        },
        onAfterSubmitEdit:function()
        {
        	entity_edit_model.manager.reload();
        },
        onBeforeCancelEdit:function()
        {
        },
        isScroll : false,
        width : 'auto',
        checkbox: false,
        allowHideColumn:true,
        // rownumbers:true,
        colDraggable:true,
        rowDraggable:true,
        // rownumbers:true,
        isScroll: false,
        frozen: false,
        pageSize:entity_edit_model.default_pages_size,
        pageSizeOptions: entity_edit_model.pages_size,
        enabledEdit: true,
        detailToEdit: false,
        clickToEdit: false,
        // url:entity_edit_model.url[entity_edit_model.url_index],
        method:"get",
        urlFilter:function(){
        	var op=arguments[1].options;
        	var ps=[];
        	// console_info(op);
        	var url=op.url+"?callback=?";
        	if(op.parms&&op.parms.where)
        	{
        		var filter=JSON.parse(op.parms.where);
        		if(filter&&filter!="")
        			url+="&"+change_ligerui_filter_to_python(filter);
        	}
        	// console_info(url);
        	return url;
        },
        paramFilter:function(){
        	var op=arguments[1].options;
        	var ps=[];
    		var page=op.newPage;
    		var pageSize=op.pageSize;
    		var sortOrder=op.sortOrder=="asc"?"":"-";
        	if(op.sortName)
        		ps.push({name:"order_by",value:sortOrder+op.sortName});
        	ps.push({name:"offset",value:(page-1)*pageSize});
        	ps.push({name:"limit",value:pageSize});
        	return ps;
        },
        onSuccess:function()
        {
        	arguments[0].Rows=arguments[0].objects;
        	arguments[0].Total=arguments[0].meta.total_count;
        }
        }));
}
function beginEdit(rowid) {
    entity_edit_model.manager.beginEdit(rowid);
}
function cancelEdit(rowid) {
    entity_edit_model.manager.cancelEdit(rowid);
}
function endEdit(rowid) {
    entity_edit_model.manager.endEdit(rowid);
}
function deleteRow(rowid,not_confirm) {
    if (not_confirm||confirm('确定删除?')) {
        var row = entity_edit_model.manager.getRow(rowid);
        if (row&&row.id)
        {
        	var param = {
        		   url: entity_edit_model.url_ent[entity_edit_model.url_ent_index] + row.id + "/",
        		   method: "DELETE"
        	};
        	var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
        	entity_edit_model.manager.reload();
        	if (res != null && res.status > 199 && res.status < 300) {
        		if(!not_confirm)
        			tipOnce("提示", "删除成功", 5000);
        	}
        	else {
        		if(!not_confirm)
        			tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res ? res.status : null), 10000)
        	}
        }
    }
}