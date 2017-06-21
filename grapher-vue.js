export default {
	install(Vue, options){
		Vue.mixin({
			beforeCreate(){
				this._grapher = {}
			},
			created(){
				if(this.$options.grapher){
					_.each(this.$options.grapher, (fn, name) => {
						this.$data[name] = []
						Vue.util.defineReactive(this, name, null)
						let computation
						let readyOnce = false
						let nonreactive
						//Run this function once, and every time the query parameters change
						let unwatch = this.$watch(fn, params => {
							nonreactive = params.reactive === false
							let start = new Date(), time
							if(!this._grapher[name]){
								this._grapher[name] = params.collection.createQuery(params.query)
							}
							let query = this._grapher[name]
							query.body = params.query
							if(params.subscribe === false){ //"Method style" fetch
								this[name] = Object.freeze({
									ready:false,
									readyOnce:false,
									count:0,
									data:[]
								})
							query.fetch((err,res) => {
								if(err){
									console.err(err)
								} else {
									this[name] = Object.freeze({
										ready:true,
										readyOnce:true,
										count:res.length,
										time:new Date() - start,
										data:res
									})
								}
							})
							} else { //Subscribe and fetch
								let oldSub = query.subscriptionHandle
								query.subscribe()
								if(oldSub){
									oldSub.stop()
								}
								if(computation){
									this.$stopHandle(computation)
								}
								computation = this.$autorun(()=>{
									let ready = query.subscriptionHandle.ready()
									if(ready && !readyOnce){
										readyOnce = true
									}
									if(ready && !time){
										time = new Date() - start
									}
									let data = query.fetch()
									this[name] = Object.freeze({
										ready:ready,
										readyOnce:readyOnce,
										count:data.length,
										time:time,
										data:data
									})
								})
							}
						},{immediate:true})
						if(nonreactive){
							unwatch() //stop the watcher if the user specified reactive:false
						}
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
