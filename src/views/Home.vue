<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" :numbers="numbers"  :myS = "myS" :myTotal = "myTotal" :myToDay="myToDay" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  props: ['numbers', 'myS', 'myToday', 'myTotoal'],
  components: {
    HelloWorld
  }
}
</script>
