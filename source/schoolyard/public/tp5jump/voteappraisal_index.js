//投票评优index
layui.use('table', function(){
  var table = layui.table;
 
  table.render({    //表格渲染 
     elem: '#positionstable'
    ,url:Root+'admin/Voteappraisal/json'
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
	   {type:'numbers',title:'记录号',width:80}
	  ,{type:'checkbox'}
      ,{field:'rid', width:80, title: 'ID', sort: true,align:'center',unresize: true}   
      ,{field:'publishername', width:100, title: '发布人',align:'center'}
      ,{field:'groupdesc', width:100, title: '信息分组',align:'center'}
	  ,{field:'subject', width:150, title: '主题',align:'center'} 
      ,{field:'detail', width:150, title: '详情',align:'center'}
      ,{field:'poll', width:100, title: '票数',align:'center'}
      ,{field:'fromdate', width:120, title: '开始时间',align:'center'}
	  ,{field:'todate', width:120, title: '结束时间',align:'center'} 
      ,{field:'remark', minWidth:80, title: '备注',align:'center'}    
      ,{field:'right',width:190, title: '操作',toolbar:"#barDemob"}
    ]] 
    ,id: 'table_b'//重载表格唯一id
  });
  table.on('checkbox(Idtableb)', function(obj){		 
	 /*  console.log(obj); */
  });
  table.on('tool(Idtableb)', function(obj){
	    var rid =obj.data.rid;
	    //删除
	   if(obj.event === 'del'){
	      layer.confirm('真的删除这条数据么', function(index){	    		    	
	    	 Ajaxalls(rid,null,2,'admin/Voteappraisal/delete');
//	    	 obj.del();
	    	
	      });
	    } 
	 //编辑
	   else if(obj.event === 'edit'){
		   window.location.href="edit?rid="+rid;	    	
	    		    	
	    }
	  });
  var $ = layui.$, active = {
		    reload: function(){
		      var demoReload = $('#demoReload');
		      table.reload('table_b', {
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
        	 var checkStatus = table.checkStatus('table_b')
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
        		 			url : Root+"admin/Voteappraisal/delete",
        		 			type : "post",
        		 			data:{"checkedid":checkedid},
        		 			dataType: "json",
        		 			success: function(data){
        		 				if(data.state==1){
        		 					layer.msg(data.msg, {icon: 6});
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
  $('.demoTableb .layui-btn').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
  });
    
});

