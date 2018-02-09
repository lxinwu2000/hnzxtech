//教师信息index
layui.use('table', function(){
  var table = layui.table;
 
  table.render({    //表格渲染 
     elem: '#teacherstable'
    ,url:Root+'admin/Teachers/json'
    ,height: 'full-150'   
    ,cellMinWidth: 80 
    ,page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
     layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] //自定义分页布局      
     ,limit: 10//默认 值
     ,curr: 1 //设定初始在第 1 页
     ,groups: 5 //只显示 1 个连续页码
     ,first: true //不显示首页false
     ,last: true //不显示尾页false
      
    }    
    ,cols: [[
	   {type:'numbers',title:'记录号',width:50,fixed: true}
	  ,{type:'checkbox'}
      ,{field:'rid', width:80, title: 'ID', sort: true,align:'center',unresize: true}
      ,{field:'number', width:100, title: '教工编号',align:'center'}
      ,{field:'cnname', width:85, title: '中文名',align:'center'}
      ,{field:'enname', width:85, title: '英文名',align:'center'}
      ,{field:'office', width:200, title: '办公室',align:'center'}
      ,{field:'idcard', width:180, title: '身份证',align:'center'}
      ,{field:'birthday', width:180, title: '生日', sort: true,align:'center'}
      ,{field:'entrydate', width:180, title: '入职日期',sort: true,align:'center'}
      ,{field:'educationlevel', width:100, title: '学历',align:'center'}
      ,{field:'graduateinstitutions', width:180, title: '毕业院校',align:'center'}
      ,{field:'workingyears', width:80, title: '工龄',sort: true,align:'center'}    
      ,{field:'right',width:200, title: '操作',toolbar:"#barDemo"}
    ]] 
    ,id: 'table_a'//重载表格唯一id
  });
  table.on('checkbox(Idtable)', function(obj){		 
	 /*  console.log(obj); */
  });
  table.on('tool(Idtable)', function(obj){
	    var rid =obj.data.rid;
	    //删除
	   if(obj.event === 'del'){
	      layer.confirm('真的删除这条数据么', function(index){	    		    	
	    	 Ajaxalls(rid,null,2,'admin/Teachers/delete');
//	    	 obj.del();
	      });
	    } 
	 //编辑
	   else if(obj.event === 'edit'){
		   window.location.href="edit?rid="+rid;	    	
	    		    	
	    }else if(obj.event ==='lookimg'){
	    	 $.ajax({
		 			url : Root+"admin/Teachers/json",
		 			type : "get",
		 			data:{"rid":rid},
		 			dataType: "json",
		 			success: function(data){
		 				if(data.state==1){
		 					layer.open({
		 						  type: 1,
		 						  title:data.cnname+'的照片',
		 						  skin: 'layui-layer-demo',
		 						  closeBtn: 1,
		 						  shadeClose: true,
		 						  shade: 0.4,
		 						  offset: 't',
		 						  content: '<img src="'+data.src+'" class="simg" width="250">'
		 						});				  				
		 				}else{
		 				layer.msg(data.msg, {icon: 5});
		 				}
		 			},
		 		});	
	    }
	  });
  var $ = layui.$, active = {
		    reload: function(){
		      var demoReload = $('#demoReload');
		      table.reload('table_a', {
		        page: {
		          curr: 1 
		        }
		      //关键词搜索
		        ,where: {
		          key:demoReload.val()         
		        }
		      });
		    }
  //批量获取要删除的id
         ,getCheckid:function(){
        	 var checkStatus = table.checkStatus('table_a')
             ,data = checkStatus.data;
        	 var checkedid=new Array();
        	 for(i=0;i<data.length;i++){
        		 checkedid[i]=data[i].rid;
        	 }       	         	        	        	        	         	         	        	         	        	 
        	 if(checkedid.length=='0'){
        		 layer.msg('你没有选择要删除的数据',{icon:5});
        	 }else{
        		 //ajax从数据库删除
        		 layer.confirm('真的删除这些数据吗', function(index){       		    	
        		    	 $.ajax({
        		 			url : Root+"admin/Teachers/delete",
        		 			type : "post",
        		 			data:{"checkedid":checkedid},
        		 			dataType: "json",
        		 			success: function(data){
        		 				if(data.state==1){
        		 					//同步删除表格的数据
        		 					 for(i=0;i<checkedid.length;i++){        		 
        		 		        		 $('td[data-field=rid]').each(function(){
        		 		        			    if($(this).text()==checkedid[i]){
        		 		        			    	 var index_id = $(this).parent('tr').attr('data-index');
        		 		                             $('tr[data-index=' + index_id + ']').remove();
        		 		        			    }
        		 		        	     });               		             						                       			         		 
        		 		        	 }
        		 				     layer.close(index);				  				
        		 				}else{
        		 				layer.msg(data.msg, {icon: 5});
        		 				}
        		 			},
        		 		});	      
        		      });
        	 }        	
           
       }
 };	 
  $('.demoTable .layui-btn').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
  });
    
});