# Grapher + Vue

This package makes using [Grapher](http://grapher.cultofcoders.com/) with [Vue](https://vuejs.org/) in [Meteor](https://www.meteor.com/) easy. It automatically subscribes to your queries when the component is loaded, and unsubscribes to them when the component is destroyed.

Query paramaters are reactive, using Vue's reactivity. If you for example use `this.limit` in your query, and `this.limit` changes, it will update the query and subscription. If you want to turn this off, add `reactive:false`.

You can also fetch data nonreactively, by adding `subscribe:false`. It uses the same result structure as the subscribe version. It will first return an object `{ready:false,data:[]}`. Once it finishes, the object will be updated with the results.

If you add `single:true`, it will work like `fetchOne()`, and `data` will be a single object instead of an Array. When using `single:true`, `limit:1` is added automatically.

## Installation
```
meteor add herteby:grapher-vue
```
## Setup
```javascript
import GrapherVue from 'meteor/herteby:grapher-vue'
Vue.use(GrapherVue)
```
## Usage
```vue
<template>
  <div v-if="users.ready">
    Users: {{users.count}}<br>
    Time taken: {{users.time}}ms
    <div v-for="user in users.data">
      <h4>{{user.username}}</h4>
      <pre>{{user.profile}}</pre>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
  export default {
    data(){
      return {
        limit:20,
      }
    },
    grapher:{
      users(){
        return {
          collection:Meteor.users,
          query:{ //These are the paramaters passed to collection.createQuery()
            username:1,
            profile:1,
            $options:{limit:this.limit}
          },
          subscribe:true, //optional, default is true
          reactive:true,  //optional, default is true
          single:false    //optional, default is false
        }
      }
    }
  }
</script>
```
The object that is returned ("users" in the example) looks like this:
```javascript
{
  ready: Boolean, //Wether the subscription has finished fetching all documents
  readyOnce: Boolean, //Unlike ready, this will remain true even if the subscription is later changed
  count: Number, //Number of results
  time: Number, //How many milliseconds it took until it was ready
  data: Array //The result of the query
}
```
## Example project
[Clone my testing respository](https://github.com/Herteby/testing). It's a Meteor project with some test data and everything set up.