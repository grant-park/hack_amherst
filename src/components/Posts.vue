<template>
  <div class="posts">
    <h1 style="margin-bottom:25px;color:#FFFFFF;">Five College Rideshare</h1>
    <div v-if="posts.length > 0" class="table-wrap">
      <div style="margin:5px;">
        <router-link v-bind:to="{ name: 'addpost' }" class="">Add Post</router-link>
      </div>
      <div style="margin:5px;">
        <a v-on:click="browseAll()" style="cursor:pointer;" class="">Browse All</a>
      </div>
      <div style="margin:5px;">
        <a v-on:click="query()" style="cursor:pointer;" class="">Find matches</a>
      </div>

     <table class="container">
     	<thead>
     		<tr>
              <th><h1>Name</h1></th>
              <th><h1>Destination</h1></th>
              <th><h1>Origin</h1></th>
              <th><h1>Transportation</h1></th>
              <th><h1>Leave On</h1></th>
              <th><h1>Leave By</h1></th>
     		</tr>
     	</thead>
     	<tbody>
          <tr class="wow" v-for="post in posts">
              <td v-on:click="postSelected(post)">{{ post.name }}</td>
              <td v-on:click="postSelected(post)">{{ post.destination }}</td>
              <td v-on:click="postSelected(post)">{{ post.origin }}</td>
              <td v-on:click="postSelected(post)">{{ post.transportation }}</td>
              <td v-on:click="postSelected(post)">{{ post.date | formatDate }}</td>
              <td v-on:click="postSelected(post)">{{ post.time }}</td>
              <td v-if="userKey == post.userKey" align="center" style="text-align:center !important;">
                <router-link v-bind:to="{ name: 'editpost', params: { id: post._id } }">Edit</router-link> |
                <a href="#" @click="deletePost(post._id)">Delete</a>
              </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      There are no posts.. Lets add one now <br /><br />
      <router-link v-bind:to="{ name: 'addpost' }" class="add_post_link">Add Post</router-link>
      <vue-simple-spinner></vue-simple-spinner>
    </div>
  </div>
</template>

<script>
import PostsService from '@/services/PostsService'
import moment from 'moment'
import Vue from 'vue'
import $ from 'jquery'
import 'tablesorter'
import Spinner from 'vue-simple-spinner'

$(function () {
  $('#keywords').tablesorter()
})

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY')
  }
})

export default {
  name: 'posts',
  components: {
    Spinner
  },
  data () {
    return {
      posts: [],
      userKey: null
    }
  },
  mounted () {
    this.userKey = this.$cookie.get('user')
    this.getPosts()
  },
  methods: {
    postSelected (post) {
      const $this = this
      var contactStr = post.contact
      var regex = /(https?:\/\/([-\w.]+)+(:\d+)?(\/([\w/_.]*(\?\S+)?)?)?)/ig
      var replacedText = contactStr.replace(regex, "<a href='$1' target='_blank'>$1</a>")
      $this.$swal({
        html: '<div style="text-align:left;"> <b>' + 'Name: ' + '</b>' + post.name + '<br />' + '<br />' +
        '<b>' + 'Contact: ' + '</b>' + replacedText + '<br />' + '<br />' +
        '<b>' + 'Description: ' + '</b>' + post.description + '<br />' + '<br />' +
        '<b>' + 'Transportation: ' + '</b>' + post.transportation + '<br />' + '<br />' +
        '<b>' + 'Destination: ' + '</b>' + post.destination + '<br />' + '<br />' +
        '<b>' + 'Origin: ' + '</b>' + post.origin + '<br />' + '<br />' +
        '<b>' + 'Leave On: ' + '</b>' + moment(post.date).format('MM/DD/YYYY') + '<br />' + '<br />' +
        '<b>' + 'Leave By: ' + '</b>' + post.time + '<br /></div>',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      }).then(function () {
        // TODO
      })
    },
    browseAll () {
      this.$route.params.clear = true
      this.getPosts()
    },
    query () {
      this.$router.push({ name: 'query' })
    },
    async getPosts () {
      const $this = this
      const response = await PostsService.fetchPosts()
      var searchDate = this.$route.params.date
      var searchTime = this.$route.params.time
      var searchDestination = this.$route.params.destination
      var clear = this.$route.params.clear
      this.posts = response.data.posts
      if ((searchDate != null || searchTime != null || searchDestination != null) && !clear) {
        var filteredPosts = []
        for (var i = 0; i < this.posts.length; i++) {
          var candidateTime = {
            hh: this.posts[i].time.substring(0, 2),
            mm: this.posts[i].time.substring(3, 5),
            a: this.posts[i].time.substring(6, 8)
          }
          var convertTimeToMinutes = function (str) {
            return Number(str.hh) * 60 + Number(str.mm) + (str.a === 'am' ? 0 : 720)
          }
          var isCandidateTimeOk = convertTimeToMinutes(candidateTime) <= convertTimeToMinutes(searchTime)
          if (searchDestination === this.posts[i].destination && searchDate.getMonth() === (new Date(this.posts[i].date)).getMonth() &&
            searchDate.getDate() === (new Date(this.posts[i].date)).getDate() && isCandidateTimeOk) {
            filteredPosts.push(this.posts[i])
          }
        }
        if (filteredPosts.length === 0 && !clear) {
          console.log('no matches')
          $this.$swal({
            text: "There weren't any matches.",
            type: 'warning',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then(function () {
              // TODO
          })
        } else {
          if (!clear) {
            this.posts = filteredPosts
          }
        }
      }
      // console.log(this.posts[0].userKey)
      // console.log(this.$cookie.get('user'))
    },
    async deletePost (id) {
      const $this = this
      $this.$swal({
        name: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(function () {
        PostsService.deletePost(id)
        $this.$router.go({
          path: '/'
        })
      })
    }
  }
}
</script>
<style type="text/css">
/*
	Side Navigation Menu V2, RWD
	===================
	License:
	https://goo.gl/EaUPrt
	===================
	Author: @PableraShow

 */

@charset "UTF-8";
@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,700);

body {
  font-family: 'Open Sans', sans-serif;
  font-weight: 300;
  line-height: 1.42em;
  color:#A7A1AE;
  background-color:#1F2739;
}

h1 {
  font-size:3em;
  font-weight: 300;
  line-height:1em;
  text-align: center;
  color: #4DC3FA;
}

h2 {
  font-size:1em;
  font-weight: 300;
  text-align: center;
  display: block;
  line-height:1em;
  padding-bottom: 2em;
  color: #FB667A;
}

h2 a {
  font-weight: 700;
  text-transform: uppercase;
  color: #FB667A;
  text-decoration: none;
}

.blue { color: #185875; }
.yellow { color: #FFF842; }

.container th h1 {
	  font-weight: bold;
	  font-size: 1em;
  text-align: left;
  color: #185875;
}

.container td {
	  font-weight: normal;
	  font-size: 1em;
  -webkit-box-shadow: 0 2px 2px -2px #0E1119;
	   -moz-box-shadow: 0 2px 2px -2px #0E1119;
	        box-shadow: 0 2px 2px -2px #0E1119;
}

.container {
	  text-align: left;
	  overflow: hidden;
	  width: 80%;
	  margin: 0 auto;
  display: table;
  padding: 0 0 8em 0;
  color: white;
}

.container td, .container th {
	  padding-bottom: 2%;
	  padding-top: 2%;
  padding-left:2%;
}

/* Background-color of the odd rows */
.container tr:nth-child(odd) {
	  background-color: #323C50;
}

/* Background-color of the even rows */
.container tr:nth-child(even) {
	  background-color: #2C3446;
}

.container th {
	  background-color: #1F2739;
}

.container td:first-child { color: #FB667A; }

.wow:hover {
-webkit-box-shadow: 0 6px 6px -6px #0E1119;
	   -moz-box-shadow: 0 6px 6px -6px #0E1119;
	        box-shadow: 0 6px 6px -6px #0E1119;
  background-color: #FFF842 !important;
  color: #403E10;
  font-weight: bold;

  box-shadow: #7F7C21 -1px 1px, #7F7C21 -2px 2px, #7F7C21 -3px 3px, #7F7C21 -4px 4px, #7F7C21 -5px 5px, #7F7C21 -6px 6px;
  transform: translate3d(6px, -6px, 0);

  transition-delay: 0s;
	  transition-duration: 0.4s;
	  transition-property: all;
  transition-timing-function: line;
}

@media (max-width: 800px) {
.container td:nth-child(4),
.container th:nth-child(4) { display: none; }
}
a {
  color: #4d7ef7;
  text-decoration: none;
}
a.add_post_link {
  background: orange;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
</style>
