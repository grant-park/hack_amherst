<template>
  <div class="posts">
    <h1 style="color:white;margin-bottom:20px;">Find Matches</h1>
      <div class="form">
        <p>Destination</p>
        <v-select class="vue-select-bar" taggable v-model="destination" :options="['Boston','New York','Bradley Airport (BDL)','Wesleyan','Brown']"></v-select>
        <p style="margin-top:20px;">Leave on:</p>
        <datepicker placeholder="DATE" v-model="date" style="margin:auto;width:28.5%;padding:10px;"></datepicker>
        <p style="margin-top:20px;">Leave by:</p>
        <vue-timepicker format="hh:mm a" v-model="time" hide-clear-button style=".form.div{margin:0};"></vue-timepicker>
        <div>
          <button class="app_post_btn" @click="search">Find matches</button>
        </div>
      </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import VueTimepicker from 'vue2-timepicker'
import Vue from 'vue'
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)

export default {
  name: 'query',
  data () {
    return {
      destination: '',
      date: '',
      time: {
        hh: '08',
        mm: '00',
        a: 'am'
      },
      userKey: null
    }
  },
  components: {
    Datepicker,
    VueTimepicker
  },
  methods: {
    async search () {
      if (this.date === '' || this.destination === '') {
        this.$swal(
          'Uh Oh!',
          `Please fill out all fields!`,
          'error'
        )
        return
      }
      var userKey = Math.random()
      if (this.$cookie.get('user') == null) {
        this.$cookie.set('user', userKey, 365)
      }
      this.$router.push({ name: 'Posts', params: { date: this.date, time: this.time, destination: this.destination } })
    }
  }
}
</script>
<style type="text/css">
.form {
  border-radius: 10px;
  background-color: white;
  width: 50%;
  margin: auto;
  padding: 50px;
  
  -webkit-box-shadow: -1px 4px 64px -1px rgba(0,0,0,0.75);
  -moz-box-shadow: -1px 4px 64px -1px rgba(0,0,0,0.75);
  box-shadow: -1px 4px 64px -1px rgba(0,0,0,0.75);
}
body {
  background-color: #2C3446;
  font-family: 'Open Sans', sans-serif;
}
.time-picker {
    margin-top: 20px;
    margin-bottom: 40px;
}
.vdp-datepicker {
    width: 10em !important;
    margin: auto !important;
    margin-top: 20px !important;
    padding: 0 !important;
}
.vdp-datepicker:first-child {
    width: 50% !important;
    margin: auto !important;
}
.vdp-datepicker input {
    width: 100% !important;
}
.vue-select-bar {
    width: 50%;
    margin: auto !important;
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

