# Grapher + Vue

This package makes using [Grapher](http://grapher.cultofcoders.com/) with [Vue](https://vuejs.org/) in [Meteor](https://www.meteor.com/) easier and more declarative.

It automatically subscribes to your queries when the component is loaded, and unsubscribes to them when the component is destroyed.

Query parameters are reactive by default, using Vue's reactivity. So if you for example use `this.limit` in your query, it will update the query and subscription when `this.limit` changes.

**BREAKING CHANGE:** Beginning with 1.0, instead of the result being in `result.data`, the result is the root object, and the extra properties are prefixed with `$`.

## Setup
```
meteor add herteby:grapher-vue
```
```javascript
import GrapherVue from 'meteor/herteby:grapher-vue'
Vue.use(GrapherVue)
```
## Example
```vue
<template>
  <div v-if="users.$readyOnce">
    Users: {{users.$count}} of {{users.$fullCount}}<br>
    Time taken: {{users.$time}}ms
    <div v-for="user in users">
      <h4>{{user.username}}</h4>
      <pre>{{user.profile}}</pre>
    </div>
    <button v-if="users.$count < users.$fullCount" @click="this.limit += 20">Load more</button>
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
          fullCount:true,
          query:{
            $options:{limit:this.limit},
            username:1,
            profile:1
          }
        }
      }
    }
  }
</script>
```
[Live demo](https://dev.herte.by/)

[Demo repo](https://github.com/Herteby/testing)

## API
<table>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Required/Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>collection</td>
    <td>Mongo.Collection</td>
    <td>Required</td>
    <td>The root collection for the query</td>
  </tr>
  <tr>
    <td>query</td>
    <td>Object</td>
    <td>Required</td>
    <td>Argument for Grapher's <a href="http://grapher.cultofcoders.com/api/query.html#Collection-createQuery">createQuery()</a></td>
  </tr>
  <tr>
    <td>subscribe</td>
    <td>Boolean</td>
    <td>Defaults to <i>true</i></td>
    <td>If set to false, uses a method call instead. The result structure is the same regardless</td>
  </tr>
  <tr>
    <td>single</td>
    <td>Boolean or String</td>
    <td>Defaults to <i>false</i></td>
    <td>If set to true, it will work like <code>fetchOne()</code>, and adds <code>$options:{limit:1}</code> to the query. If a String, it also adds <code>$filters:{_id:theString}</code></td>
  </tr>
  <tr>
    <td>fullCount</td>
    <td>Boolean</td>
    <td>Defaults to <i>false</i></td>
    <td>If true, <a href="http://grapher.cultofcoders.com/api/query.html#Query-getCount">getCount()</a> will be called to fetch the full count from the server. Useful if you have set a limit on the query</td>
  </tr>
  <tr>
    <td>disabled</td>
    <td>Boolean</td>
    <td>Defaults to <i>false</i></td>
    <td>Disable the query. Use with a reactive Vue variable if you for example want to wait for the user to input a search string, or select which document to show</td>
  </tr>
  <tr>
    <td>countOnly</td>
    <td>Boolean</td>
    <td>Defaults to <i>false</i></td>
    <td>If true, only <a href="http://grapher.cultofcoders.com/api/query.html#Query-getCount">getCount()</a> will be called, and no data will be fetched. Useful for notification badges and such. Instead of the normal format, the result will simply be <i>false</i> initially, and then when getCount() returns, a Number representing the count.</td>
  </tr>
  <tr>
    <td>reactive</td>
    <td>Boolean</td>
    <td>Defaults to <i>true</i></td>
    <td>Wether the query should update when Vue variables it depends on change.</td>
  </tr>
</table>

## Extra result properties
<table>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>$ready</td>
    <td>Boolean</td>
    <td>Wether the subscription has finished fetching all documents</td>
  </tr>
  <tr>
    <td>$readyOnce</td>
    <td>Boolean</td>
    <td>Unlike ready, this will remain true if the subscription is later changed (useful for loading indicators)</td>
  </tr>
  <tr>
    <td>$count</td>
    <td>Number</td>
    <td>Number of results</td>
  </tr>
  <tr>
    <td>$fullCount</td>
    <td>Number or false</td>
    <td>Only available if you set fullCount or countOnly to true.<br>This will initially be set to false. Once the getCount() server call returns, this will be updated with the count</td>
  </tr>
  <tr>
    <td>$time</td>
    <td>Number</td>
    <td>How many milliseconds it took to fetch all the data</td>
  </tr>
  <tr>
    <td>$disabled</td>
    <td>Boolean</td>
    <td>If it's disabled</td>
  </tr>
</table>

If you need to get rid of these for some reason, just use this Lodash function:
```javascript
_.omitBy(result, key => key[0] == '$') //_.omit in Underscore
```