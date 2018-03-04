<template>
  <div class="posts">
    <h1 style="color:white;margin-bottom:20px;">Add Post</h1>
      <div class="form">
        <div>
          <input type="text" name="name" placeholder="NAME" v-model="name" style="margin-bottom:30px;">
        </div>
        <div>
          <input type="text" name="contact" placeholder="CONTACT" v-model="contact" style="margin-bottom:30px;">
        </div>
        <div>
          <textarea rows="5" cols="15" placeholder="DESCRIPTION" v-model="description"></textarea>
        </div>
        <p>Destination</p>
        <v-select class="vue-select-bar" taggable v-model="destination" :options="['Boston','New York','Bradley Airport (BDL)','Wesleyan','Brown']"></v-select>
        <p>Origin</p>
        <v-select class="vue-select-bar" taggable v-model="origin" :options="['UMass','Amherst','Hampshire','Mt. Holyoke','Smith']"></v-select>
        <p>Mode of transportation:</p>
        <v-select class="vue-select-bar" taggable v-model="transportation" :options="['VanGO','Valley Transporter','Uber','Lyft','Peter Pan','Greyhound','Megabus']"></v-select>
        <p>Leave on:</p>
        <datepicker placeholder="DATE" v-model="date" style="margin:auto;width:28.5%;padding:10px;"></datepicker>
        <p>Leave by:</p>
        <vue-timepicker format="hh:mm a" v-model="time" hide-clear-button style=".form.div{margin:0};"></vue-timepicker>
        <div>
          <button class="app_post_btn" @click="addPost">Add</button>
        </div>
      </div>
  </div>
</template>

<script>
import PostsService from '@/services/PostsService'
import Datepicker from 'vuejs-datepicker'
import VueTimepicker from 'vue2-timepicker'
import Vue from 'vue'
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)

export default {
  name: 'addpost',
  data () {
    return {
      name: '',
      contact: '',
      description: '',
      transportation: null,
      destination: '',
      origin: '',
      date: '',
      time: {
        hh: '08',
        mm: '00',
        a: 'am'
      },
      userKey: this.$cookie.get('user')
    }
  },
  components: {
    Datepicker,
    VueTimepicker
  },
  methods: {
    async addPost () {
      var userKey = Math.random()
      if (this.$cookie.get('user') == null) {
        console.log('I have a cookie')
        this.$cookie.set('user', userKey, 365)
        console.log(this.$cookie.get('user'))
      }
      console.log('printing userKey')
      console.log(this.userKey)
      if (this.contact === '' || this.destination === '' || this.date === '') {
        this.$swal(
          'Uh Oh!',
          `At least fill out your contact, destination, and date to leave by!`,
          'error'
        )
        return
      }
      await PostsService.addPost({
        name: this.name,
        contact: this.contact,
        description: this.description,
        transportation: this.transportation,
        destination: this.destination,
        origin: this.origin,
        date: this.date,
        time: this.time.hh + ':' + this.time.mm + ' ' + this.time.a,
        userKey: this.userKey
      })
      this.$swal(
        'Great!',
        `Your post has been added!`,
        'success'
      )
      this.$router.push({ name: 'Posts', params: { date: this.date, time: this.time, clear: true } })
    }
  }
}
</script>
<style type="text/css">
body {
  background-color: #2C3446;
  font-family: 'Open Sans', sans-serif;
}
p {
    margin-top: 10px;
    margin-bottom: 10px;
}
.form {
  background-color: white;
  width: 50%;
  margin: auto;
  padding: 50px;
  
  -webkit-box-shadow: -1px 4px 64px -1px rgba(0,0,0,0.75);
  -moz-box-shadow: -1px 4px 64px -1px rgba(0,0,0,0.75);
  box-shadow: -1px 4px 64px -1px rgba(0,0,0,0.75);
}

.time-picker {
    margin-top: 0 !important;
    margin-bottom: 25px !important;
    width: 10em;
}
.vdp-datepicker {
    width: 10em !important;
    margin: auto !important;
    margin-top: 0 !important;
    margin-bottom: 25px !important;
    padding: 0 !important;
}
.vdp-datepicker:first-child {
    width: 100% !important;
    margin: auto !important;
}
.vdp-datepicker input {
    width: 100% !important;
}
.vue-select-bar {
    width: 50%;
    margin: auto !important;
    margin-bottom: 25px !important;
}
.form input, .form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.app_post_btn {
  background: orange;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 50%;
  border: none;
  cursor: pointer;
}
</style>

