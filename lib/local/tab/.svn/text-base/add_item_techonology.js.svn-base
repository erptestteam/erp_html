var technology_data = [];
var detailGrid;
var entity_edit_model = {
	menu : null,
	url_index : 0,
	url : erp_api_service.EntItem,
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
		name : 'number',
		// width : 150,
		// type : 'int'
	} ],
	dispaly_columns1 : [
			{
				display : '主键',
				name : 'id',
				filter : false,
				width : 50,
				editor:{type : 'int'}
			},
			{
				display : '部品编号',
				name : 'item_number',
				width : 50,
				editor:{type : 'string'}
			},
			{
				display : '工序順序',
				name : 'technology_rank',
				width : 50,
				editor:{type : 'int'}
			},
			{
				display : '工序名字',
				name : 'technology_id',
				width : 50,
				type:'int',
				editor:{ 	
					type: 'select',
          	  		emptyvalue:false, 
          	  		data:technology_data, 
          	  		valueColumnName: 'id', 
          	  		displayColumnName: 'name',
          	  		selectBoxWidth: 300 ,
          	  		selectBoxHeight:300,
          	  		// isShowCheckBox:false,
          	  		emptyText: null,
          	  		// emptyValue:0,
          	  		valueType:"int",
          	  		columns: [
          	  		          // { header: 'ID', name: 'id',type:'int',
          	  		          // width: 20 },
          	  		          { header: '名称', name: 'name' }
          	  		          ]
					},
					render:function (item)
					{
            			for (var i = 0; i < technology_data.length; i++)
            			{
            				// console_info(materia_data[i]['id']);
            				if (technology_data[i]['id']+"" == item.technology_id+"")
            				{
            					return technology_data[i]['name'];
            				}
            			}
            			return "";
            		}
				
			},
			{
				display : '工序信息',
				name : 'technology_info',
				width : 150,
				editor:{type : 'string'}
			},
			{
				display : '規格',
				name : 'dimensions',
				width : 150,
				editor:{type : 'string'}
			},
			{
				display : '添加时间',
				name : 'i_time',
				type : 'date',
				format : 'yyyy-MM-dd hh:mm:ss',
				width : 150
			}, 
			{
				display : '更改时间',
				name : 'u_time',
				type : 'date',
				format : 'yyyy-MM-dd hh:mm:ss',
				width : 150
			},
			{
                display: '操作', isSort: false, filter:false,
                width : 100,
                render: function (rowdata, rowindex, value)
                {
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
            }
			]
};
$(function() {
	$.ajax({
		type : 'GET',
		url : erp_api_service.EntTechnology[0] + "?callback=?&limit=1000",
		dataType : 'json',
		cache : false,
		async : true,
		success : function(data) {
			if (data && data.objects) {
				var res = data.objects;
				console_info(res);
				if (res instanceof Array && res.length > 0) {
					for ( var i in res) {
						technology_data.push(res[i]);
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
function f_initGrid() {
	// 鼠标右键
	entity_edit_model.menu = $.ligerMenu({
		top : 100,
		left : 100,
		width : 120,
		items : []
	});
	$("#add_item_technology").bind("contextmenu", function(e) {
		entity_edit_model.menu.show({
			top : e.pageY,
			left : e.pageX
		});
		return false;
	});
	$.ligerDefaults.Filter.operators['string'] = $.ligerDefaults.Filter.operators['text'] = [
			"like", "equal", "notequal", "startwith", "endwith" ];
	$.ligerDefaults.Filter.operators['int'] = [ "equal", "notequal" ];
	entity_edit_model.manager = $("#add_item_technology")
			.ligerGrid(
					ERPUtils
							.get_default_grid_option_for_url({
								url : entity_edit_model.url[entity_edit_model.url_index],
								columns : entity_edit_model.dispaly_columns,
								toolbar : {
									items : [
											{
												text : '高级自定义查询',
												click : function() {
													entity_edit_model.manager
															.showFilter("#filter");
												},
												icon : 'search2'
											}, {
												line : true
											} ]
								},
								isScroll : false,
								width : 'auto',
								detail : {
									height : 'auto',
									onShowDetail : function(row, detailPanel,
											callback) {
										var grid = document
												.createElement('div');
										$(detailPanel).append(grid);
										detailGrid = $(grid)
												.css('margin', 10)
												.ligerGrid(
														ERPUtils
																.get_default_grid_option_for_url({
																	width : '90%',
																	url : erp_api_service.EntRelTechnologyItemEquipment[0]
																			+ "?item_number="
																			+ row.number
																			+ "&order_by=technology_rank",
																	columns : entity_edit_model.dispaly_columns1,
																	toolbar: { items: [
																	                    
																                    	{
																                        text: '增加', click: function () {
																                        	detailGrid.addEditRow();
																                        }, icon: 'add'
																                    	}
																                    ]
																 	},
																}));
										entity_edit_model.innerGrid.push(detailGrid);
									}
								}
							}));
}
function beginEdit(rowid) {
	detailGrid.beginEdit(rowid);
}
function cancelEdit(rowid) {
	detailGrid.cancelEdit(rowid);
}
function endEdit(rowid) {
	detailGrid.endEdit(rowid);
}
function deleteRow(rowid,not_confirm) {
    if (not_confirm||confirm('确定删除?')) {
        var row = detailGrid.getRow(rowid);
        if (row&&row.id)
        {
           var  param = {
               url: erp_api_service.EntRelTechnologyItemEquipment[0] + row.id + "/",
                method: "DELETE"
           };
           var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
           detailGrid.reload();
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
