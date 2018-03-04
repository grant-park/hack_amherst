<template>
  <div class="posts">
    <h1>Edit Post</h1>
      <div class="form">
        <div>
          <input type="text" name="name" placeholder="NAME" v-model="name">
        </div>
        <div>
          <input type="text" contact="contact" placeholder="CONTACT" v-model="contact">
        </div>
        <div>
          <textarea rows="15" cols="15" placeholder="DESCRIPTION" v-model="description"></textarea>
        </div>
        <p>Destination</p>
        <v-select taggable v-model="destination" :options="['Boston','New York','Bradley Airport (BDL)','Wesleyan','Brown']"></v-select>
        <p>Origin</p>
        <v-select taggable v-model="origin" :options="['Boston','New York','Bradley Airport (BDL)','Wesleyan','Brown']"></v-select>
        <p>Mode of transportation:</p>
        <v-select taggable v-model="transportation" :options="['VanGO','Valley Transporter','Uber','Lyft','Peter Pan','Greyhound','Megabus']"></v-select>
        <datepicker placeholder="DATE" v-model="date" style="margin:auto;width:28.5%;padding:10px;"></datepicker>
        <p>Leave by:</p>
        <vue-timepicker format="hh:mm a" v-model="time" hide-clear-button style=".form.div{margin:0};"></vue-timepicker>
        <div>
          <button class="app_post_btn" @click="updatePost">Update</button>
        </div>
      </div>
  </div>
</template>

<script>
import PostsService from '@/services/PostsService'
import Datepicker from 'vuejs-datepicker'
import VueTimepicker from 'vue2-timepicker'

export default {
  name: 'editpost',
  components: {
    Datepicker,
    VueTimepicker
  },
  data () {
    return {
      name: '',
      contact: '',
      description: '',
      destination: '',
      origin: '',
      transportation: '',
      date: '',
      time: {
        hh: '08',
        mm: '00',
        a: 'am'
      },
      userKey: ''
    }
  },
  mounted () {
    this.getPost()
  },
  methods: {
    async getPost () {
      const response = await PostsService.getPost({
        id: this.$route.params.id
      })
      this.name = response.data.name
      this.contact = response.data.contact
      this.description = response.data.description
      this.destination = response.data.destination
      this.origin = response.data.origin
      this.transportation = response.data.transportation
      this.date = response.data.date
      this.time = {
        hh: response.data.time.substring(0, 2),
        mm: response.data.time.substring(3, 5),
        a: response.data.time.substring(6, 8)
      }
      this.userKey = response.data.userKey
      // this.$router.push({ name: 'Posts' })
    },
    async updatePost () {
      await PostsService.updatePost({
        id: this.$route.params.id,
        name: this.name,
        contact: this.contact,
        description: this.description,
        destination: this.destination,
        origin: this.origin,
        transportation: this.transportation,
        date: this.date,
        time: this.time.hh + ':' + this.time.mm + ' ' + this.time.a,
        userKey: this.userKey
      })
      this.$swal(
        'Great!',
        `Your post has been updated!`,
        'success'
      )
      this.$router.push({ name: 'Posts' })
    }
  }
}
</script>
<style type="text/css">
.form input, .form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.app_post_btn {
  background: orange;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
</style>

