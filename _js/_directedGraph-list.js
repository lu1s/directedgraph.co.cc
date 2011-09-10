/*
 * Linked List implementation in JavaScript
 * Copyright (c) 2009 Nicholas C. Zakas
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * A linked list implementation in JavaScript.
 * @class LinkedList
 * @constructor
 */
function LinkedList() {

    /**
     * The number of items in the list.
     * @property _length
     * @type int
     * @private
     */
    this._length = 0;
    
    /**
     * Pointer to first item in the list.
     * @property _head
     * @type Object
     * @private
     */
    this._head = null;
}

LinkedList.prototype = {

    //restore constructor
    constructor: LinkedList,
    
    /**
     * Appends some data to the end of the list. This method traverses
     * the existing list and places the value at the end in a new item.
     * @param {variant} data The data to add to the list.
     * @return {Void}
     * @method add
     */
    add: function (data){
    
        //create a new item object, place data in
        var node = { 
                data: data, 
                next: null 
            },
            
            //used to traverse the structure
            current;
    
        //special case: no items in the list yet
        if (this._head === null){
            this._head = node;
        } else {
            current = this._head;
            
            while(current.next){
                current = current.next;
            }
           
            current.next = node;            
        }
        
        //don't forget to update the count
        this._length++;
    
    },
    
    /**
     * Retrieves the data in the given position in the list.
     * @param {int} index The zero-based index of the item whose value 
     *      should be returned.
     * @return {variant} The value in the "data" portion of the given item
     *      or null if the item doesn't exist.
     * @method item
     */
    item: function(index){
    
        //check for out-of-bounds values
        if (index > -1 && index < this._length){
            var current = this._head,
                i = 0;
                
            while(i++ < index){
                current = current.next;            
            }
        
            return current.data;
        } else {
            return null;
        }
    },
    
    /**
     * Removes the item from the given location in the list.
     * @param {int} index The zero-based index of the item to remove.
     * @return {variant} The data in the given position in the list or null if
     *      the item doesn't exist.
     * @method remove
     */
    remove: function(index){
    
        //check for out-of-bounds values
        if (index > -1 && index < this._length){
        
            var current = this._head,
                previous,
                i = 0;
                
            //special case: removing first item
            if (index === 0){
                this._head = current.next;
            } else {
        
                //find the right location
                while(i++ < index){
                    previous = current;
                    current = current.next;            
                }
            
                //skip over the item to remove
                previous.next = current.next;
            }
        
            //decrement the length
            this._length--;
        
            //return the value
            return current.data;            
        
        } else {
            return null;
        }
    
    },
    
    /**
     * Returns the number of items in the list.
     * @return {int} The number of items in the list.
     * @method size
     */
    size: function(){
        return this._length;
    },
    
    /**
     * Converts the list into an array.
     * @return {Array} An array containing all of the data in the list.
     * @method toArray
     */
    toArray: function(){
        var result = [],
            current = this._head;
        
        while(current){
            result.push(current.data);
            current = current.next;
        }
        
        return result;
    },
    
    /**
     * Converts the list into a string representation.
     * @return {String} A string representation of the list.
     * @method toString
     */
    toString: function(){
        return this.toArray().toString();
    }
};

/*
* DirectedGraph
*	Represents a directed graph data structure with certaing
*	useful functions on it.
*	It can be used with GraphDracula Javascript Library to
*	show them (http://www.graphdracula.net/)
* 	@author: Luis Pulido <pulidoman@gmail.com>
*	@date: March 31, 2011
*/
function DirectedGraph(){
	this._isBidirectional = false;
	this._nodes = new LinkedList();
	this._edges = new LinkedList();
	this._matrix = null;
};

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
		this._nodes = new LinkedList();
		this._edges = new LinkedList();
	},
	/*
	* addNode
	* Adds a node to the Graph, verifying first if the
	* value of the node exists already.
	* @return true if the node was inserted, and
	* false if it wasn't because it was already there
	*/
	addNode: function(a){
		if(!this.containsNode(a)){
			this._nodes.add(a);
			return true;
		}
		return false;
	},
	/*
	* addNodesFromArray
	* Adds a set of nodes parsing a given array and pushing
	* them using the addNode function
	*/
	addNodesFromArray: function(arr){
		for(var i=0;i<arr.length;i++)
			this.addNode(arr[i]);
	},
	/*
	* addEdge
	* Adds an edge to the Graph, verifying first if the
	* edge exists already.
	* It executes the addNode function for each node on the
	* edge, to ensure it's on the Graph. If it's already
	* there, the node won't be added.
	* @parameter	from:				'starting node',
	*				to:					'destination node',
	*				value (optional):	'value of the edge'
	* @return true if it was added, false if it wasn't
	*/
	addEdge: function(from,to,value){
		var ret = false;
		if(!this.containsEdge(from,to)){
			this.addNode(from);
			this.addNode(to);
			if(value)
				this._edges.add([from,to,value]);
			else
				this._edges.add([from,to]);
			if(this._isBidirectional){
				if(value)
					this._edges.add([to,from,value]);
				else
					this._edges.add([to,from]);
			}
			ret = true;
		}
		return ret;
	},
	/*
	* addEdgesFromArray
	* Adds a set of edges parsing a given array and pushing
	* them using the addEdge function
	*/
	addEdgesFromArray: function(arr){
		for(var i=0;i<arr.length;i++){
			if(arr[i].length==3)
				this.addEdge(arr[i][0],arr[i][1],arr[i][2]);
			else
				this.addEdge(arr[i][0],arr[i][1]);
		}
	},
	/*
	* containsNode
	* Checks if the given value is contained on the Graph
	* @return true if it is. False if it isn't.
	*/
	containsNode: function(a){
		for(var i=0;i<this._nodes.size();i++)
			if(this._nodes.item(i)==a)
				return true;
		return false;
	},
	/*
	* containsEdge
	* Checks if the given pair of values (representing an
	* edge (a=from, b=to)) is contained on the Graph
	* @return true if it is. False if it isn't.
	*/
	containsEdge: function(from,to){
		for(var i=0;i<this._edges.size();i++)
			if(this._edges.item(i)[0]==from&&this._edges.item(i)[1]==to)
				return true;
		return false;
	},
	/*
	* getEdgeIndex
	* Returns, if the edge exists, the index in which it's
	* contained on the array
	*/
	getEdgeIndex: function(from,to){
		for(var i=0;i<this._edges.size();i++)
			if(this._edges.item(i)[0]==from&&this._edges.item(i)[1]==to)
				return i;
		return null;
	},
	/*
	* edgesFrom
	* Returns an array with all the nodes that the
	* parameter node is pointing to. If there's none
	* it returns null.
	* If a returning edge has a value, it'll show inside the array
	* as an array of two values:
	*  [0]=destination node
	*  [1]=value of the edge
	*/
	edgesFrom: function(node){
		var arr = new Array();
		for(var i=0;i<this._edges.size();i++)
			if(this._edges[i][0]==node){
				if(this._edges[i][2])
					arr.push([this._edges.item(i)[1],this._edges.item(i)[2]]);
				else
					arr.push(this._edges.item(i)[1]);
			}
		if(arr.length==0)
			return null;
		return arr;
	},
	/*
	* edgesTo
	* Returns an array with all the nodes that are pointing
	* to the parameter node. If there's none it'll return null.
	* If a returning edge has a value, it'll show inside the array
	* as an array of two values:
	*  [0]=departing node
	*  [1]=value of the edge
	*/
	edgesTo: function(node){
		var arr = new Array();
		for(var i=0;i<this._edges.size();i++)
			if(this._edges.item(i)[1]==node){
				if(this._edgesitem(i)[2])
					arr.push([this._edges.item(i)[0],this._edges.item(i)[2]]);
				else
					arr.push(this._edges.item(i)[0]);
			}
		if(arr.length==0)
			return null;
		return arr;
	},
	/*
	* buildMatrix
	* Creates the adjacency matrix for the Directed Graph and stores it
	* on the _matrix bidimentional array.
	* If the parameter value exists and it's: 'withValues', the matrix
	* will contain the value instead of "true" if the edge has value.
	*/
	buildMatrix: function(w){
		var length = this._nodes.size();
		this._matrix = new Array(length);
		for(var i=0;i<this._matrix.length;i++)
			this._matrix[i] = new Array(length);
		for(var i=0;i<this._nodes.size();i++)
			for(var j=0;j<this._nodes.size();j++){
				if(this.containsEdge(this._nodes.item(i),this._nodes.item(j))){
					if(w=="withValues"&&this._edges.item(this.getEdgeIndex(this._nodes.item(i),this._nodes.item(j))).length==3){
						this._matrix[i][j]=this._edges.item(this.getEdgeIndex(this._nodes.item(i),this._nodes.item(j)))[2];
					}
					else
						this._matrix[i][j]=true;
				}
				else
					this._matrix[i][j]=false;
			}
	},
	/*
	* drawMatrix
	* If the matrix was alredy built, and the given id of an html
	* element exists, the function will draw the adjacent matrix
	* on an html table.
	* It puts values inside the matrix if:
	*   a) The parameter m exists and is "withValues"
	*   b) The edge contains a value
	* The parameter "append" is optional, and it appends a string in each
	* <td> that contains a value.
	* To format the table you can draw the matrix inside a div and
	* manipulate it with css
	*/
	drawMatrix: function(where,m,append){
		if(document.getElementById(where)&&this._matrix){
			var r = '<table><thead><tr><th></th>', length = this._nodes.length;
			for(var i=0;i<length;i++)
				r+='<th>'+this._nodes[i]+'</th>';
			r+='</tr></thead><tbody>';
			for(var i=0;i<length;i++){
				r+='<tr><td>'+this._nodes[i]+'</td>';
				for(var j=0;j<length;j++){
					if(this._matrix[i][j]){
						if(typeof this._matrix[i][j]!="boolean"&&m=="withValues"){
							r+='<td>'+this._matrix[i][j].toString();
							if(append)
								r+=append;
							r+='</td>';
						}
						else
							r+='<td>1</td>';
					}
					else
						r+='<td>0</td>';
				}
				r+='</tr>';
			}
			r+='</tbody></table>';
			try{
				document.getElementById(where).innerHTML = r;
			}
			catch(e){
				alert("DirectedGraph.drawMatrix() error.\nVerify that the html object supports innerHTML");
			}
		}
	}
}