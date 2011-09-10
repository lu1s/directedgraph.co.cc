	// the custom data structure (_directedGraphCustom.js)
	var g = new DirectedGraph();
	
	// a variable to save existing graphs
	var graphs = new Array();
	
	// to be used if reseting graph then injecting content again
	var description = $("#canvas").html();

	// setting canvas size depending on your window actual size
	$("#canvas").css({height:(window.innerHeight-$("#form").height()-45)+"px",width:(window.innerWidth-38)+"px"});
	var canvasWidth = parseInt($("#canvas").css("width").slice(0,$("#canvas").css("width").length-2));
	var canvasHeight = parseInt($("#canvas").css("height").slice(0,$("#canvas").css("height").length-2));
	
	//edge flags
	var edgeFlag = {from:null,to:null,fromMenu:null,fromDelete:null,fromShortestPath:null};
	
	// input text focus manipulation
	$("#form > input:eq(1)").focusin(function(){
		$(this).val()=="Node" ? $(this).val("").css({"color":"black"}) : null;
	}).focusout(function(){
		$(this).val()=="" ? $(this).val("Node").css({"color":"#999"}) : null;
	});
	
	$("#form > input:eq(0)").focusin(function(){
		$(this).val()=="Untitled graph" ? $(this).val("").css({"color":"black"}) : null;
	}).focusout(function(){
		$(this).val()=="" ? $(this).val("Untitled graph").css({"color":"#999"}) : null;
	});	
	
	// flags for handling the buttons to be locked

	
	// switch for the button click events
	$("#form > button").click(function(){		
		switch($(this).html()){
			case "add":
				if($("#form > input:eq(1)").val()!=""&&$("#form > input:eq(1)").val()!="Node"){
					if(!addNode($("#form > input:eq(1)").val()))
						$.notifyBar({html:"Node already exists, it wasn't added",cls:"error"});
					$("#form > input:eq(1)").val("").focus();
				}
			break;
			case "weighted matrix":
				if(g.nodes.length>0){
					var r = '<h2>Weighted Matrix</h2><table><tr><th> </th>';
					var matrix = g.getMatrix("weighted");
					for(var i=0;i<g.nodes.length;i++)
						r+='<th>'+g.nodes[i]+'</th>';
					r+='</tr>';
					for(var i=0;i<g.nodes.length;i++){
						r+='<tr><td class="table_first">'+g.nodes[i]+'</td>'
						for(var j=0;j<g.nodes.length;j++){
							r+='<td>';
							if(typeof matrix[i][j] != "boolean")
								r+='<span style="color:red">'+matrix[i][j].toString()+'</span>';
							else if(matrix[i][j] == true)
								r+='1';
							else
								r+='0';
							r+='</td>';
						}
						r+='</tr>'
					}
					r+='</table><p>Weights shown in <span style="color:red">red</span><br/>Unweighted edge displays as 1<br/>Non existent edge displays as 0</p>';
					$("#matrix-overlay").html(r);
					$("#matrix-overlay-div").fadeIn();
				}
				else
					$.notifyBar({html:"The graph is empty<br/>Try adding some nodes first", cls:"error"});
			break;
			case "adjacency matrix":
				if(g.nodes.length>0){
					var r = '<h2>Adjacency Matrix</h2><table><tr><th> </th>';
					var matrix = g.getMatrix("weighted");
					for(var i=0;i<g.nodes.length;i++)
						r+='<th>'+g.nodes[i]+'</th>';
					r+='</tr>';
					for(var i=0;i<g.nodes.length;i++){
						r+='<tr><td class="table_first">'+g.nodes[i]+'</td>'
						for(var j=0;j<g.nodes.length;j++){
							r+='<td>';
							if(matrix[i][j])
								r+='<span style="color:red">1</span>';
							else
								r+='0';
							r+='</td>';
						}
						r+='</tr>'
					}
					r+='</table>';
					$("#matrix-overlay").html(r);
					$("#matrix-overlay-div").fadeIn();
				}
				else
					$.notifyBar({html:"The graph is empty<br/>Try adding some nodes first",cls:"error"});
			break;
			case "adjacency list":
				if(g.nodes.length>0){
					if(g.edges.length>0){
						var r = "<h2>Adjacency List</h2><ul>";
						for(var i=0;i<g.edges.length;i++){
							r+='<li>'+g.edges[i].node+'<ul>';
							for(var j=0;j<g.edges[i].targets.length;j++){
								var txt = "";
								if(g.edges[i].targets[j][1])
									txt=g.edges[i].targets[j][0] + ' ('+g.edges[i].targets[j][1]+')';
								else
									txt=g.edges[i].targets[j];
								r+='<li>'+txt+'</li>';
							}
							r+='</ul></li>';
						}
						r+='</ul>';
						$("#matrix-overlay").html(r);
						$("#matrix-overlay-div").fadeIn();
					}
					else
						$.notifyBar({html:"The graph doesn't contain any edges<br/>Try adding some by double-clicking a node",cls:"error"});
				}
				else
					$.notifyBar({html:"The graph is empty<br/>Try adding some nodes first",cls:"error"});
			break;
			case "reset app":
				if(g.nodes.length>0)
					jConfirm("All unsaved changes will be lost.<br/>Really reset?", "About to reset your graph", function(r){
						if(r){
							$("#canvas").fadeOut().delay(300).fadeIn();
							window.setTimeout(function(){
								$("#canvas").html(description);
							}, 300);
							g = new DirectedGraph();
						}
					});
				else
					$.notifyBar({html:"There's nothing to reset"});
			break;
			case "redraw":
				if(g.nodes.length>0)
					plot();
				else
					$.notifyBar({html:"There's nothing to draw or redraw<br/>Try adding some nodes first"});
			break;
			case "new":
				if(g.nodes.length>0){
					jConfirm("Any unsaved changes will be lost<br/>Do you want to continue?","Create new graph",function(r){
						if(r){
							g = new DirectedGraph();
							$("#canvas").empty();
							$("#form > input:eq(0)").val("Untitled graph").css({"color":"#999"});
						}
					});
				}
			break;
			case "save":
				if(g.nodes.length>0){
					var name = $("#form > input:eq(0)").val();
					if(name!=""&&name!="Untitled graph"){
						if(!getCookie(name)){
							g.setName(name);
							graphs.push(name);
							setCookie("graphsCookie",JSON.stringify(graphs),3650);
							setCookie(name,JSON.stringify(g),3650);
							$("#form > select").empty().html('<option style="color:ccc">load a graph</option>');
							for(var i=0;i<graphs.length;i++)
								$("#form > select").append('<option>'+graphs[i]+'</option>');
							$.notifyBar({html:name+" was saved successfully",cls:"success"});							
						}
						else
							jConfirm("Another graph exists with that name in this computer.<br/>Do you want to replace it with this one?","Replace graph",function(r){
								if(r){
									setCookie(name,JSON.stringify(g),3650);
									$("#form > select").empty().html('<option style="color:ccc">load a graph</option>');
									for(var i=0;i<graphs.length;i++)
										$("#form > select").append('<option>'+graphs[i]+'</option>');
									$.notifyBar({html:name+" was saved successfully",cls:"success"});
								}
							});
					}
					else
						$.notifyBar({html:"The graph must be named first",cls:"error"});
				}
				else
					$.notifyBar({html:"The graph is empty<br/>Try adding some nodes first",cls:"error"});
			break;
			case "delete this graph":
				if(graphs.length>0){
					if(graphs.filter(function(a){ return(a==g.name) }).length>0){
						jConfirm("Are you sure you want to delete this graph?<br/>There's no going back","Confirm deletion",function(r){
							if(r){
								var arr = new Array();
								graphs.forEach(function(x){ if(x!=g.name) arr.push(x) });
								graphs = arr;
								setCookie("graphsCookie",JSON.stringify(graphs),3650);
								deleteCookie(g.name);
								$("#form > select").empty().html('<option style="color:ccc">load a graph</option>');
								for(var i=0;i<graphs.length;i++)
									$("#form > select").append('<option>'+graphs[i]+'</option>');
								$.notifyBar({html:g.name+" was deleted successfully",cls:"success"});
								g = new DirectedGraph();
								$("#canvas").empty();						
							}
						})
					}
					else
						$.notifyBar({html:"There's nothing to delete<br/>Try saving the graph"})
				}
				else
					$.notifyBar({html:"There's nothing to delete<br/>Try saving a graph first"});
			break;
			case "delete all graphs":
				if(graphs.length>0)
					jConfirm("Do you REALLY want to delete all graphs stored on this computer?<br/>There's no turn back","Confirm complete deletion",function(r){
						if(r){
							deleteAllCookies();
							graphs = new Array();
							$("#form > select").html('<option>load a graph</option>');
							$("#canvas").fadeOut().delay(300).fadeIn();
							window.setTimeout(function(){
								$("#canvas").html(description);
							}, 300);
							g = new DirectedGraph();
							$.notifyBar({html:"All graphs were deleted successfully.",cls:"success"});						
						}
					});
				else
					$.notifyBar({html:"There's nothing to delete<br/>Try saving a graph first"});
			break;
			case "load":	
				var check = function(){
					if($("#form > select > option").size()>1)
						for(var i=1;i<$("#form  > select > option").size();i++)
							if($("#form > select > option:eq("+i+")").attr("selected"))
								return $("#form > select > option:eq("+i+")").html();
					return false;
				}
				if(check()){
					if(g.nodes.length>0)
						jConfirm("Any unsaved changes will be lost<br/>Do you want to continue?","Confirm graph load",function(r){
							if(r)
								g = new DirectedGraph({raw:JSON.parse(getCookie(check()))});
								$("#canvas").fadeOut().delay(300).fadeIn();
								window.setTimeout(function(){
									plot();
								}, 300);
						})
					else{
						g = new DirectedGraph({raw:JSON.parse(getCookie(check()))});
						$("#canvas").fadeOut().delay(300).fadeIn();
						window.setTimeout(function(){
							plot();
						}, 300);
					}
				}
				else
					$.notifyBar({html:"Nothing to load<br/>Select a graph from the drop-down menu first"})
			break;
			case "depth":
				if(g.nodes.length>0){
					var depth = g.depth("depth,path-Array");
					if(depth){
						$("#matrix-overlay").html('<h2>Root node: <span style="color:blue">'+g.nodes[0]+'</span></h2><h2>Depth: <span style="color:blue">'+depth.depth.toString()+'</span></h2><h2>Path:</h2></div><div><div style="float:left;margin:4px;padding:5px;text-align:center;border:solid 1px gray;border-radius:7px;color:blue;font-weight:800">'+g.nodes[0]+'</div>');
						for(var i=0;i<depth.path.length;i++)
							$("#matrix-overlay").append('<span style="float:left;margin:2px;padding:5px;font-size:18px">⇢</span><div style="float:left;margin:4px;padding:5px;text-align:center;border:solid 1px gray;border-radius:7px;color:blue;font-weight:800">'+depth.path[i]+'</div>')
						$("#matrix-overlay").append("<div class='clear'></div></div>")
						$("#matrix-overlay-div").fadeIn();
					}
					else
						$.notifyBar({html:"The graph is not valid<br/>Each node must have at least one connection",cls:"error"});
				}
				else
					$.notifyBar({html:"There's nothing to calculate it's depth<br/>Try adding some nodes first"});
			break;
		}
	});
			
	// bind the close button for the matrix overlay
	$("#matrix-overlay-close").bind("click",function(){
		$("#matrix-overlay-div").fadeOut();
	});

	// to trigger the addNode function when pressing enter if input is focused
	$("#form > input:eq(1)").keyup(function(e){
		if(e.which == 13)
			if($("#form > input:eq(1)").val()!=""&&$("#form > input:eq(1)").val()!="Node"){
				if(!addNode($("#form > input:eq(1)").val()))
					$.notifyBar({html:"Node already exists. It wasn't added.",cls:"error"});
				$(this).val("").focus();
			}
	});
	
	
	/* Canvas and plotting functions */	

	// main plot function
	var plot = function(){
		$("#canvas").empty();
		var gr = new Graph();
		gr.addNodesFromArray(g.nodes);
		var arr = new Array();
		for(var i=0;i<g.edges.length;i++)
			for(var j=0;j<g.edges[i].targets.length;j++)
				if(typeof g.edges[i].targets[j] == "object")
					arr.push([g.edges[i].node,g.edges[i].targets[j][0],{directed:true,label:g.edges[i].targets[j][1]}])
				else
					arr.push([g.edges[i].node,g.edges[i].targets[j],{directed:true}]);
		gr.addEdgesFromArray(arr);
		var layouter = new Graph.Layout.Spring(gr);
		layouter.layout();
		var renderer = new Graph.Renderer.Raphael("canvas",gr,window.innerWidth-100,window.innerHeight-130);
		renderer.draw();
		bindEllipses();
	};
	
	// a binding function that is inserted each time the svg graph is redrawn
	var bindEllipses = function(){

		// bind ellipse for click (to complete addEdge or removeEdge functions)
		$("#canvas > svg > ellipse").bind("click",function(){
			if(edgeFlag.fromMenu){
				if(edgeFlag.from!=$(this).attr("id")){
					edgeFlag.to=$(this).attr("id");
					jPrompt("Enter weight<br/>Leave blank for unweighted edge","","Weight", function(r){
						if(r=="")
							r="k-e-y--12344992334"
						if(r){
							if(r!="k-e-y--12344992334"){
								if(parseFloat(r))
									tx=parseFloat(r);
								addEdge(edgeFlag.from,edgeFlag.to,r);
							}
							else
								addEdge(edgeFlag.from,edgeFlag.to);
							edgeFlag.from = null;
							edgeFlag.to = null;
							edgeFlag.fromMenu = null;
						}
						else{
							edgeFlag.from = null;
							edgeFlag.to = null;
							edgeFlag.fromMenu = null;
						}
					});
				}
				else
					$.notifyBar({html:"A node can't point to itself<br/>Click on another node to add a target<br/>If you wish to cancel press [escape]",cls:"error",delay:5000});
			}
			else if(edgeFlag.fromDelete){
				edgeFlag.to = $(this).attr("id");
				if(g.hasEdge(edgeFlag.from,edgeFlag.to))
					removeEdge(edgeFlag.from,edgeFlag.to);
				else
					$.notifyBar({html:"The edge from <span style='color:green'>" + edgeFlag.from + "</span> to <span style='color:green'>" + edgeFlag.to + "</span> doesn't exist",cls:"error"});
				edgeFlag.from=null;
				edgeFlag.to=null;
				edgeFlag.fromDelete=null;
			}
			else if(edgeFlag.fromShortestPath){
				edgeFlag.to = $(this).attr("id");
				var path = g.shortestPath(edgeFlag.from,edgeFlag.to);
				if(path){
					$("#matrix-overlay").html('<h2>Shortest path from '+edgeFlag.from+' to '+edgeFlag.to+'</h2><h2>Cost: <span style="color:blue">'+path.cost.toString()+'</span></h2><h2>Path:</h2></div><div><div style="float:left;margin:4px;padding:5px;text-align:center;border:solid 1px gray;border-radius:7px;color:blue;font-weight:800">'+edgeFlag.from+'</div>');
					for(var i=0;i<path.path.length;i++)
						$("#matrix-overlay").append('<span style="float:left;margin:2px;padding:5px;font-size:18px">⇢</span><div style="float:left;margin:4px;padding:5px;text-align:center;border:solid 1px gray;border-radius:7px;color:blue;font-weight:800">'+path.path[i]+'</div>');
					$("#matrix-overlay-div").fadeIn();
				}
				else{
					$.notifyBar({html:"There's no way to get there from " + edgeFlag.from,cls:"error"});
				}
				edgeFlag.from=null;
				edgeFlag.to=null;
				edgeFlag.fromShortestPath=null;
			}
		});
		
		// bind ellipse for doubleclick (to perform the addEdge function)
		$("#canvas > svg > ellipse").bind("dblclick",function(){
			edgeFlag.from = $(this).attr("id");
			edgeFlag.fromMenu = true;
			$.notifyBar({html:"now click on target node"});				
		});
		
		$('#canvas > svg > ellipse').bind('contextmenu',function(){
			displayMenu($(this).attr("id"), parseInt($(this).attr("cx")), parseInt($(this).attr("cy")));
			return false;
		});

		
		var displayMenu = function(node,x,y){
			$(".vmenu > div:eq(0) > span").html(node);
			$(".vmenu").css({
				"top":(y+30)+"px",
				"left":(x+70)+"px"
			}).fadeIn(200);
		};

		$("body").bind("click",function(){
			$(".vmenu").fadeOut(200);
		});

		$("#createEdge").bind("click",function(){
			edgeFlag.from=$(".vmenu > div:eq(0) > span").html();
			edgeFlag.fromMenu = true;
			$.notifyBar({html:"now click on the target node"});
			$(".vmenu").fadeOut(50);
		});
		
		$("#removeNode").bind("click",function(){
			var thisNode = $(".vmenu > div:eq(0) > span").html();
			if(g.hasEdgeFrom(thisNode)||g.hasEdgeTo(thisNode)){
				jConfirm("Removing this node will also remove all it's connected edges<br/>Do you want to continue?","Confirm node deletion", function(r){
					if(r)
						removeNode(thisNode);
				});
			}
			else
				removeNode(thisNode);
			$(".vmenu").fadeOut(50);
		});
		
		$("#removeEdge").bind("click",function(){
			if(g.hasEdgeFrom($(".vmenu > div:eq(0) > span").html())){
				edgeFlag.fromDelete = true;
				edgeFlag.from=$(".vmenu > div:eq(0) > span").html();
				$.notifyBar({html:"now click on the target node"});
			}
			else
				$.notifyBar({html:"This node has no edges departing from it",cls:"error"});
			$(".vmenu").fadeOut(50);
		});
		
		$("#findShortestPath").bind("click",function(){
			if(g.hasEdgeFrom($(".vmenu > div:eq(0) > span").html())){
				edgeFlag.fromShortestPath = true;
				edgeFlag.from=$(".vmenu > div:eq(0) > span").html();
				$.notifyBar({html:"now click on the target node"});
			}
			else
				$.notifyBar({html:"This node has no edges departing from it<br/>It doesn't point anywhere"});
			$(".vmenu").fadeOut(50);
		});
		
		
		$("#canvas > svg > ellipse").css({"cursor":"pointer"});
		
	};

	
	// addNode
	var addNode = function(node){
		if(g.addNode(node)){
			plot();
			return true;
		}
		else
			return false;
	};
	
	// removeNode
	var removeNode = function(node){
		g.removeNode(node);
		plot();
	};
	
	// addEdge
	var addEdge = function(from,to,value){
		if(g.addEdge(from,to,value))
			plot();
	};
	
	var removeEdge = function(from,to){
		if(g.removeEdge(from,to))
			plot();
	};
	
	// onResize function and variable
	var onResize = function(){
		$("#canvas").css({height:(window.innerHeight-$("#form").height()-45)+"px",width:(window.innerWidth-38)+"px"});
		if(g.nodes.length>0)
			plot();
	};
	var timer;
	// bind the window to listen for resize event
	$(window).resize(function(){
	   timer && clearTimeout(timer);
	   timer = setTimeout(onResize, 100);
	});
	
// experiment: web speech
var speak = function(value){
	if(value!=""&&value!="Node"){
		if(!addNode(value))
			$.notifyBar({html:"Node already exists, it wasn't added",cls:"error"});
		$("#form > input:eq(1)").val("").focus();
	}
};

var secret = function(value){
	$("#secret-text").append('"'+value +'" ');
};

$("#secret-close").bind("click",function(){
	$("#secret-text").empty();
	$("#secret").fadeOut(100);
});

// super experimental
var secretFlag = [false,false,false]
$(document).keydown(function(e){
	if(e.which==27){
		if(edgeFlag.fromMenu){
			edgeFlag.fromMenu=null;
			edgeFlag.from=null;
			edgeFlag.to=null;
			$.notifyBar({html:"Adding this edge was cancelled"});
		}
		else if(edgeFlag.fromDelete){
			edgeFlag.fromDelete=null;
			edgeFlag.from=null;
			edgeFlag.to=null;
			$.notifyBar({html:"Deleting edge was cancelled"});
		}
		else if($(".vmenu").is(":visible")){
			$(".vmenu").fadeOut();
		}
	}
	switch(e.which){
		case 17:
			secretFlag[0]=true;
		break;
		case 16:
			secretFlag[1]=true;
		break;
		case 83:
			secretFlag[2]=true;
		break;
	}
	if(secretFlag[0]&&secretFlag[1]&&secretFlag[2])
		$("#secret").fadeIn(2000);
}).keyup(function(e){
	switch(e.which){
		case 17:
			secretFlag[0]=false;
		break;
		case 16:
			secretFlag[1]=false;
		break;
		case 83:
			secretFlag[2]=false;
		break;
	}		
});

// initialize application
$(document).ready(function(){
	if(getCookie("graphsCookie")){
		graphs = JSON.parse(getCookie("graphsCookie"));
	}
	for(var i=0;i<graphs.length;i++)
		$("#form > select").append('<option>'+graphs[i]+'</option>');
	
	
	window.setTimeout(function(){
		$("#loading-overlay").fadeOut(400);
	},1500);
});