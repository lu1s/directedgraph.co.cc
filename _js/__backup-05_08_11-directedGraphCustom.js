/*
 * Edge
 */
function Edge(node,target){
	this.node=undefined;
	this.targets=new Array();
	node ? this.node=node : null;
	target ? this.addTarget(target) : null;	
}
Edge.prototype = {
	constructor:Edge,
	create:function(node,targets){
		var r = null;
		if(node&&targets){
			this.node=node;
			this.addTarget(targets);
			r=node;
		}
		return r;
	},
	addTarget:function(target,value){
		var r = false;
		if(target&&this.node!=undefined){
			if(typeof target == "object"){
				r = new Array();
				for(var i=0;i<target.length;i++){
					var j=0,found=false;
					while(j<this.targets.length&&!found){
						this.targets[j]==target[i] ? found=true : null;
						j++;
					}
					if(j==this.targets.length){
						this.targets.push(target[i]);
						r.push(target[i]);
					}
				}
			}
			else{
				var i=0,found=false;
				while(i<this.targets.length&&!found){
					this.targets[i]==target ? found=true : null;
					i++;
				}
				if(!found){
					if(!value)
						this.targets.push(target);
					else
						this.targets.push([target,value]);
					r = target;
				}
			}
		}
		return r;
	},
	removeTarget:function(target){
		var r = null;
		if(target){
			if(typeof target == "object"){
				r = new Array();
				for(var i=0;i<target.length;i++){
					var j=0;
					while(this.targets[j]!=undefined){
						if(this.targets[j]==target[i]){
							r.push(target[i]);
							this.targets.splice(j,1);
							j--;
						}
						j++;
					}
				}
			}
			else{
				var i=0;
				while(this.targets[i]!=undefined){
					if(this.targets[i]==target){
						r = target;
						this.targets.splice(i,1);
						i--;
					}
					i++;
				}
			}
		}
		return r;
	},
	hasTarget:function(target){
		if(typeof target != "object"){
			for(var i=0;i<this.targets.length;i++)
				if(this.targets[i] == target)
					return true;
			return false;
		}
		else{
			for(var i=0;i<target.length;i++)
				if(!this.hasTarget(target[i]))
					return false;
			return true;
		}
	},
	indexOfTarget:function(target){
		for(var i=0;i<thistargets.length;i++)
			if(this.targets[i] == target)
				return i;
		return false;
	}
}

/*
 * DirectedGraph
 */
function DirectedGraph(init){
	this.nodes=new Array();
	this.edges=new Array();
	this.isBidirectional = false;
	if(typeof init == "object"){
		init.type=="bidirectional" ? this.setType("bidirectional") : null;
		typeof init.nodes == "object" ? this.addNode(init.nodes) : null;
		typeof init.edges == "object" ? this.addEdges(init.edges) : null;
	}
}
DirectedGraph.prototype = {
	constructor: DirectedGraph,
	/*
	* setType
	* Sets the type of Graph. It must be empty to
	* set the type. Can be: unidirectional (set by default),
	* or bydirectional.
	*/
	setType: function(how){
		if(this.isEmpty()){
			switch(how){
				case "unidirectional":
					this._isBidirectional=false;
					break;
				case "bidirectional":
					this._isBidirectional=true;
					break;
				default:
					return false;
			}
			return true;
		}
		return false;
	},
	/*
	* isEmpty
	* Checks if the array of nodes is empty
	* @return True if is empty, false if it isn't
	*/
	isEmpty: function(){
		if(this._nodes._length==0)
			return true;
		return false;
	},
	/*
	* reset
	* Creates a new array for the nodes and for the
	* edges (it empties the Graph), and leaves only
	* the type of Graph value
	*/
	reset: function(){
		this.nodes = new Array();
		this.edges = new Array();
	},
	/*
	* addNode
	* Adds a node to the Graph, verifying first if the
	* value of the node exists already.
	* @return true if the node was inserted, and
	* false if it wasn't because it was already there
	*/
	addNode: function(a){
		if(typeof a != "object"){
			if(!this.hasNode(a)){
				this.nodes.push(a);
				return a;
			}
			return false;
		}
		else{
			var r = new Array();
			for(var i=0;i<a.length;i++)
				if(this.addNode(a[i]))
					r.push(a[i]);
		}
		return r;
	},
	/*
	* hasNode
	* Checks if the given value is contained on the Graph
	* @return true if it is. False if it isn't.
	*/
	hasNode: function(a){
		if(typeof a != "object"){
			for(var i=0;i<this.nodes.length;i++)
				if(this.nodes[i] == a)
					return true;
			return false;
		}
		else{
			for(var i=0;i<a.length;i++)
				if(!this.hasNode(a[i]))
					return false;
			return true;
		}
	},
	/*
	* removeNode
	*/
	removeNode: function(a){
		if(typeof a != "object"){
			var i=0;
			while(i<this.nodes.length){
				if(this.nodes[i]==a){
					this.nodes.splice(i,1);
					i--;
					return a;
				}
				i++;
			}
			return false;
		}
		else{
			var r = new Array();
			for(var i=0;i<a.length;i++)
				if(this.removeNode(a[i]))
					r.push(a[i]);
		}
		return r;
	},
	/*
	* addEdge
	*/
	addEdge: function(from,to,value){
		if(from&&to){
			if(!this.hasNode(from))
				this.addNode(from);
			if(typeof to == "object"){
				if(this.hasEdgeFrom(from)){
					var arr = this.edges[this.indexOfEdge(from)].targets.slice();
					for(var i=0;i<arr.length;i++)
						to.push(arr[i]);
				}
				to.sort();
				for(var i=1;i<to.length;i++)
					if(to[i]==to[i-1]){
						to.splice(i,1);
						i--;
					}
				for(var i=0;i<to.length;i++)
					!this.hasNode(to[i]) ? this.addNode(to[i]) : null;
			}
			else if(!this.hasNode(to))
				this.addNode(to);
			if(!this.hasEdgeFrom(from)){
				this.edges.push(new Edge(from,to));
				console.log("added edge:["+from+"] with ["+to.toString()+"]");
				return true;
			}
			else{
				if(!value)
					if(this.edges[this.indexOfEdge(from)].addTarget(to)){
						console.log("updated edge:["+from+"], now: ["+to.toString()+"]");
						return true;
					}
				else
					if(this.edges[this.indexOfEdge(from)].addTarget(to,value)){
						console.log("updated edge:["+from+"], now: ["+to.toString()+"]");
						return true;
					}
			}
		}
		return false;
	},
	/*
	* addEdges
	*/
	addEdges: function(edges){
		for(var i=0;i<edges.length;i++)
			this.addEdge(edges[i][0],edges[i][1]);
	},
	/*
	* indexOfEdge
	*/
	indexOfEdge: function(from){
		for(var i=0;i<this.edges.length;i++)
			if(from==this.edges[i].node)
				return i;
		return false;
	},
	/*
	* hasEdge
	*/
	hasEdge: function(which,to){
		for(var i=0;i<this.edges.length;i++)
			if(which==this.edges[i].node)
				for(var j=0;j<this.edges[i].targets.length;j++)
					if(to==this.edges[i].targets[j])
						return true;
		return false;
	},
	/*
	* hasEdgeFrom
	*/
	hasEdgeFrom: function(which){
		for(var i=0;i<this.edges.length;i++)
			if(which==this.edges[i].node)
				return true;
		return false;
	},
	/*
	* removeEdge
	*/
	removeEdge: function(which){
		if(this.hasEdge(which)){
			this.edges.splice(this.indexOfEdge(which),1);
			return which;
		}
		return false;
	},
	/*
	*
	*/
	removeEdgeTarget: function(node,target){
		if(this.hasEdge(node)){
			if(typeof target != "object"){
				var arr = this.edges[this.indexOfEdge(node)].targets.slice();
				for(var i=0;i<arr.length;i++)
					if(arr[i] == target){
						arr.splice(i,1);
						this.edges[this.indexOfEdge(node)].targets = arr;
						return target;
					}
				return false;
			}
			else{
				var r = new Array();
				for(var i=0;i<target.length;i++)
					if(this.removeEdgeTarget(node,target[i]))
						r.push(target[i]);
				if(r.length==0)
					return false;
				else
					return r;
			}
		}
		else
			return false;
	},
	/*
		TODO: {} Add functions to:
		
				Build matrix
				Draw matrix
				
			  Update functions:
			  	
			  	removeNode:
			  		- Find if there's an edge object whos node is the node to be
			  		removed, and remove that edge object.
			  		- Find if there's edges pointing to the node to be removed and
			  		  remove those targets from their edge objects
		}
	*/
	getMatrix: function(w){
		var length = this.nodes.length;
		var matrix = new Array(length);
		for(var i=0;i<length;i++)
			matrix[i] = new Array(length);
		for(var i=0;i<length;i++){
			if(this.hasEdgeFrom(this.nodes[i])){
				var edge = this.edges[this.indexOfEdge(this.nodes[i])];
				for(var j=0;j<edge.targets.length;j++){
					for(var k=0;k<length;k++){
						var r=0;
						if(edge.targets[j]==this.nodes[k]){
							if(w=="weighted" && typeof edge.targets[j] == "object")
									r=edge.targets[j][1];
							else
								r=edge.targets[j];
						}
						matrix[i][k] = r;
					}
				}
			}
			else
				for(var j=0;j<length;j++)
					matrix[i][j] = 0;
		}
		return matrix;
	}
}