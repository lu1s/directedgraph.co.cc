/*
 * Edge
 */
	
function Edge(node,target,value){
	this.node=undefined;
	this.targets=new Array();
	node ? this.node=node : null;
	if(target&&value)
		this.addTarget(target,value)
	else if(target){
		if(typeof target == "object")
			this.addTargets(target);
		else
			this.addTarget(target);
	}
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
						this.targets[j]==target[i]||this.targets[j][0]==target[i][0]||this.targets[j]==target[i][0]||this.targets[i][0]==target[i] ? found=true : null;
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
					this.targets[i]==target||this.targets[i][0]==target ? found=true : null;
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
	/* warning: very raw, to be handled by specific functions */
	addTargets : function(arr){
		for(var i=0;i<arr.length;i++){
			if(typeof arr[i] == "object" && arr[i][1])
				this.targets.push([arr[i][0],arr[i][1]]);
			else
				this.targets.push(arr[i]);
		}
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
				if( (typeof this.targets[i] == "object" && this.targets[i][0] == target) || this.targets[i] == target )
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
		for(var i=0;i<this.targets.length;i++)
			if(this.targets[i] == target || this.targets[i][0] == target)
				return i;
		return false;
	}
}

/*
 * DirectedGraph
 */
function DirectedGraph(init){
	this.name="untitled";
	this.nodes=new Array();
	this.edges=new Array();
	this.isBidirectional = false;
	if(typeof init == "object"){
		if(init.raw){
			this.name = init.raw.name;
			this.nodes = init.raw.nodes;
			for(var i=0;i<init.raw.edges.length;i++){
				this.edges.push(new Edge(init.raw.edges[i].node,init.raw.edges[i].targets));
			}
			this.isBidirectional = init.raw.isBidirectional;
		}
		else{
			init.type=="bidirectional" ? this.setType("bidirectional") : null;
			init.name ? this.setName(init.name) : null;
			typeof init.nodes == "object" ? this.addNode(init.nodes) : null;
			typeof init.edges == "object" ? this.addEdges(init.edges) : null;
		}
	}
}
DirectedGraph.prototype = {
	constructor: DirectedGraph,
	/*
	* setName
	* Sets the name of the Graph
	*/
	setName: function(name){
		this.name = name;
	},
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
		if(this.nodes.length==0)
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
			if(!this.hasNode(to))
				this.addNode(to);
			if(!this.hasEdgeFrom(from)){
				if(value){
					this.edges.push(new Edge(from,to,value));
					console.log("added edge '"+from+"' to point '"+to.toString()+"(weight: "+value+")'");
					return true;
				}
				else{
					this.edges.push(new Edge(from,to));
					console.log("added edge '"+from+"' to point '"+to.toString()+"'");
					return true;
				}
			}
			else{
				if(!value){
					if(this.edges[this.indexOfEdge(from)].addTarget(to)){
						console.log("updated edge '"+from+"' to point '"+to.toString()+"'");
						return true;
					}
				}
				else if(this.edges[this.indexOfEdge(from)].addTarget(to,value)){
					console.log("updated edge '"+from+"' to point '"+to.toString()+"(weight: "+value+")'");
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
	* removeEdgeTarget
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
	* getMatrix
	*/
	getMatrix: function(w){
		
		// get length
		var length = this.nodes.length;
		
		// build matrix
		var matrix = new Array(length);
		for(var i=0;i<length;i++)
			matrix[i] = new Array(length);
		
		// fill matrix

		// test each node (cycle for each row)
		for(var i=0;i<length;i++){
			if(this.hasEdgeFrom(this.nodes[i])){
				var edge = this.edges[this.indexOfEdge(this.nodes[i])];
				for(var j=0;j<length;j++){
					if(edge.hasTarget(this.nodes[j])){
						if(typeof edge.targets[edge.indexOfTarget(this.nodes[j])] == "object" && w=="weighted")
							matrix[i][j] = edge.targets[edge.indexOfTarget(this.nodes[j])][1];
						else
							matrix[i][j] = true;
					}
					else
						matrix[i][j] = false;
				}
			}
			else
				for(var j=0;j<length;j++)
					matrix[i][j]=false;
		}
		
		
			// prepare console text with matrix
			var t = "";
			for(var i=0;i<matrix.length;i++){
				for(var j=0;j<matrix[i].length;j++)
					t+=matrix[i][j]+",	";
				t+="\n";
			}
			
			// log console
			//console.log(t);
			
			// return matrix
			return matrix;
	},
	/*
	* traverse
	*/
	traverse: function(){
		//init
		var checkValidGraph = function(){
			for(var i=0;i<this.nodes.length;i++)
				if(!this.hasEdgeFrom(this.nodes[i]))
					return false;
			return true;
		}
		
		if(checkValidGraph()){
			
		}
	}
}
