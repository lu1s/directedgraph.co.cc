		var swap = function(z,a,b){
			var tmp=z[a];
			z[a]=z[b];
			z[b]=tmp;
		}
		var sort = {
			/*
			*	quickSort partition: 	12 + n(7)
			*	quickSort sort:			15
			*/
			quickSort : {
				partition: function(array, begin, end, pivot){
					//4
					//2
					var piv=array[pivot];
					//1
					swap(array, pivot, end-1);
					//1
					var store=begin;
					// 1
					for(var ix=begin; ix<end-1; ix++) {
						//2
						//2
						if(array[ix]<=piv) {
							//1
							swap(array, store, ix);
							//2
							store++;
						}
					}
					//2
					swap(array, end-1, store);
					//1
					return store;
				},
				sort: function(array, begin, end){
					//3
					//2
					if(end-1>begin) {
						//6
						var pivot=begin+Math.floor(Math.random()*(end-begin));
						//2
						pivot=sort.quickSort.partition(array, begin, end, pivot);
						//1
						sort.quickSort.sort(array, begin, pivot);
						//1
						sort.quickSort.sort(array, pivot+1, end);
					}
				}
			}
		}