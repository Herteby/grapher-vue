# Grapher + Vue

This package makes using [Grapher](http://grapher.cultofcoders.com/) with [Vue](https://vuejs.org/) in [Meteor](https://www.meteor.com/) easy. It automatically subscribes to your queries when the component is loaded, and unsubscribes to them when they are destroyed.

If you want to fetch your data nonreactively "Method style", just add `subscribe:false`. No need for a callback though. It will first return an object `{ready:false,data:[]}`, and once it finishes, the object will be updated with the results, using the same structure as the subscription version.

It also supports reactive query paramaters, using Vue's reactivity. So if you for example call `this.limit` in your query, and `this.limit` changes, it will update the query and subscription. If you want to turn this off, add `reactive:false`.

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
          query:{
            username:1,
            profile:1,
            $options:{limit:this.limit}
          },
          subscribe:true, //default
          reactive:true //default
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