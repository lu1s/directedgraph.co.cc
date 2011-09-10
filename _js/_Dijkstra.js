/**
 * Class dDijkstra
 * 
 * Implements Dijkstra's algorithm.
 */
(function(d, undefined) {
	
	d.distance = []; // shortest known distance from start
	d.preceeding = []; // preceeding node in path
	d.visited = []; // all false initially
	d.maxDistance = 99999999;
	
	d.init = function(start) {
		for (var i = 0; i < dGraph.size(); i++) {
			this.visited[i] = false;
			this.distance[i] = this.maxDistance;
		}
		
		this.distance[start] = 0;
		
		for (var i = 0; i < dGraph.size(); i++) {
			var next = dDijkstra.minVertex();
			console.log('next', next);
			this.visited[next] = true;

			// The shortest path to next is dist[next] and via pred[next].

			var neighbors = dGraph.neighbors(next);
			
			for (var j = 0; j < neighbors.length; j++) {
				var v = neighbors[j],
					d = this.distance[next] + dGraph.getWeight(dGraph.summits[next], v);
				
				v = dGraph.summits.indexOf(v);
				
				if (this.distance[v] > d) {
					this.distance[v] = d;
					this.preceeding[v] = next;
				}
			}
		}
		return this.preceeding;  // (ignore pred[s]==0!)
	};
	
	d.minVertex = function() {
		var y = -1, // graph not connected, or no unvisited vertices
			x = this.maxDistance;   
		
		for (var i = 0; i < this.distance.length; i++) {
			if ( ! this.visited[i] && this.distance[i] < x ) {
				y = i;
				x = this.distance[i];
			}
		}
		return y;
	};
	
	d.printPath = function(preceeding, start, summit) {
		var path = [],
			x = summit,
			start = dGraph.summits[start];
/*		
		while (x !== start) {
			if (x !== undefined) {
				path.push(x.label);
				x = preceeding[dGraph.summits.indexOf(x)];
			}
		}
		path.push(start);
		console.log('path', path);
*/
	}
		
	
}(window.Dijkstra = window.Dijkstra || {}));