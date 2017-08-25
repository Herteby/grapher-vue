export default {
	install(Vue, options){
		Vue.mixin({
			beforeCreate(){
				this._grapher = {}
				let args = typeof this.$options.grapher == 'function' ? this.$options.grapher() : this.$options.grapher
				_.each(args, (fn, name) => {
					Vue.util.defineReactive(this, name, {}) //Initial "dummy result"
				})
			},
			created(){
				if(this.$options.grapher){
					let args = typeof this.$options.grapher == 'function' ? this.$options.grapher() : this.$options.grapher
					_.each(args, (fn, name) => {
						let computation
						let readyOnce = false
						//Run this function once, and every time the query parameters change
						this.$watch(fn, params => {
							if(typeof params !== 'object'){
								throw new Error('Parameters must be an object')
							}
							let start = new Date(), time
							if(!this._grapher[name]){ //Create the query
								this._grapher[name] = params.collection.createQuery(params.query)
							}
							let query = this._grapher[name]
							query.body = _.cloneDeep(params.query)

							if(params.countOnly){
								this[name] = false
								query.getCount((err, count) => {
									this[name] = count
								})
								return
							}

							if(params.single){
								if(!query.body.$options){
									query.body.$options = {}
								}
								query.body.$options.limit = 1
								if(typeof params.single == 'string'){
									if(!query.body.$filters){
										query.body.$filters = {}
									}
									query.body.$filters._id = params.single
								}
							}

							if(params.subscribe === false){ //"Method style" fetch
								if(query.subscriptionHandle){ //Handle switching from subscription-based
									this.$stopHandle(computation)
									query.unsubscribe()
								}
								this[name].$ready = false 
								query.fetch((err, result) => {
									if(err){
										console.err(err)
									} else {
										if(params.single){
											result = result[0]
										}
										_.extend(result, {
											$ready:true,
											$readyOnce:true,
											$count:params.single ? undefined : result.length,
											$time:new Date() - start,
										})
										if(params.fullCount){
											result.$fullCount = false
										}
										this[name] = result
									}
								})
							} else { //Subscribe and fetch
								let oldSub = query.subscriptionHandle
								if(!params.disabled){
									query.subscribe()
								}
								if(oldSub){
									oldSub.stop()
								} else { //Handle switching from method-based
									readyOnce = false
								}
								if(computation){
									this.$stopHandle(computation)
								}
								if(params.disabled){
									this[name] = _.extend([], {$disabled:true, $ready:false})
									return
								}
								computation = this.$autorun(()=>{
									if(!query.subscriptionHandle){
										return
									}									
									let ready = query.subscriptionHandle.ready()
									if(ready && !readyOnce){
										readyOnce = true
									}
									if(ready && !time){
										time = new Date() - start
									}
									let result = query.fetch()
									if(params.single){
										result = result[0]
									}
									_.extend(result, {
										$ready:ready,
										$readyOnce:readyOnce,
										$count:params.single ? undefined : result.length,
										$time:time,
									})
									if(params.fullCount){
										result.$fullCount = this[name].fullCount || false
									}
									this[name] = result
								})
							}

							if(params.fullCount){
								query.getCount((err, count) => {
									this.$set(this[name], 'fullCount', count)
								})
							}
						}, {immediate:true})
					})
				}
			},
			destroyed(){
				_.each(this._grapher, query => query.unsubscribe())
				this._grapher = null
			}
		})
	}
}
