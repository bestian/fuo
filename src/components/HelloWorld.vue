<template>
  <div class="hello">
    <div class="ui segment container" v-show="!dismiss">
      <h3 class ="ui header"> 使用說明</h3>
      <p>請在網站上登錄您的名字和今天念了幾聲佛號，再按「登錄佛號」按鈕即可。</p>
      <p>每個名字每天只能登錄一次，請在晚上7:30前登錄以便回向，永明佛寺會在晚上7:30-8:00間回向。</p>
      <p>回向是針對疫情和法界與地球揚升到淨土，願大眾福慧增長，人人平安，超生淨土。</p>
      <p>永明佛寺地址：台東縣太麻里鄉華源村南北坑58-1號。永明佛寺電話：<a herf="tel:0937280910">0937280910</a>、<a herf="tel:0982029814">0982029814</a></p>

      <p>目前有<router-link class = "item" to ="/about"><i class ="plus icon"/>
        <span class="fat-only">加總</span></router-link>的功能，您可以輸入關鍵字打自己的名字，查到所有的記錄和加總。</p>

      <p>若您希望在其他佛寺使用類似的軟體，<br/>可以在<i class = "github icon"/>Github上，將本專案創建分叉版(Fork)，自行修改架站。</p>
      <p>原始碼完全公開，請見此：<a href="https://github.com/bestian/number" target="_blank"><i class = "github icon"/>原始碼</a>

      &nbsp;&nbsp;&nbsp;&nbsp;<a class="ui tiny gray button" @click="dismiss = true">不再顯示提示</a></p>
    </div>

    <form class="ui form container" v-show="step == 1 && myTotal">
      <div class="fields">
        <div class="field">
          <label><i class = "calendar icon"/>今天日期：{{date}}</label>
        </div>
        <div class="field">

          <label><i class = "user icon"/>您的姓名/法名：
          <input type="text" name="" v-model = "name"/> </label> 
        
        </div>
        <div class="field">
          <label><i class = "comment icon"/>您今天念了幾聲佛號：</label>
          <input type="number" v-model = "number" />
        </div>
        <div class="field">
          <label><i class = "question icon"/>念佛號原因：</label>
          <input type="text" v-model = "reason" />
        </div>
      </div>

      <div class="field">
        <div class="ui buttons">
          <button class="ui huge green button ani tada" @click="addNumber()"><i class = "upload icon"/>登錄佛號</button>
          <div class="or"></div>
          <button class = "ui huge orange button ani tada" @click ="loginGoogle()" v-if="!user"><i class = "google icon"/>google登入</button>
          <button class = "ui huge blue button ani tada" @click ="logout()" v-else>
            <img id = "r" :src="photoURL" />
            <i class = "sign-out icon"/>登出</button>
        </div>
      </div>
    </form>

    <div class="ui divider" v-show="step == 1"></div>

    <select id="s" class="ui dropdown" v-model="mode" v-show="step == 1">
      <option value="">模式</option>
      <option value="today">今日</option>
      <option value="all">所有</option>
    </select>

    <div class="ui list container left aligned" v-show="mode == 'today' && step == 1">
      <div class="item" v-for = "n in t(s(numbers))" :key="n.n + n.date"> <img class="avatar" :src="par(n.photoURL)" v-show="n.photoURL" :alt="n.n"/> {{n.date}}: {{n.n}}念了<span class="highlight"> {{parseInt(n.number)}} 聲</span>佛號!! </div>
    </div>

    <div class="ui list container left aligned" v-show="mode == 'all' && step == 1">
      <div class="item" v-for = "n in s(numbers)" :key="n.n + n.date"> <img class="avatar" :src="par(n.photoURL)" v-show="n.photoURL" :alt="n.n"/> {{n.date}}: {{n.n}}念了<span class="highlight"> {{parseInt(n.number)}} 聲</span>佛號!! </div>
    </div>

    <div class="ui divider" v-show="step == 1"></div>
    
    <form class="ui form container" v-show="numbers[0] && step == 1 && myTotal">
      <div class="fields">
        <div class="field">
          <label><i class = "calendar icon"/>今天日期：{{date}}</label>
        </div>
        <div class="field">

          <label><i class = "user icon"/>您的姓名/法名：
          <input type="text" name="" v-model = "name"/> </label> 
        
        </div>
        <div class="field">
          <label><i class = "comment icon"/>您今天念了幾聲佛號：</label>
          <input type="number" v-model = "number" />
        </div>
        <div class="field">
          <label><i class = "question icon"/>您念佛號的原因：</label>
          <input type="text" v-model = "reason" />
        </div>
      </div>

      <div class="field">
        <div class="ui buttons">
          <button class="ui huge green button ani tada" @click="addNumber()"><i class = "upload icon"/>登錄佛號</button>
          <div class="or"></div>
          <button class = "ui huge orange button ani tada" @click ="loginGoogle()" v-if="!user"><i class = "google icon"/>google登入</button>
          <button class = "ui huge blue button ani tada" @click ="logout()" v-else>
            <img id = "r" :src="photoURL" />
            <i class = "sign-out icon"/>登出</button>
        </div>
      </div>
    </form>

  </div>
</template>

<script>
import { auth, db } from '../firebase.js'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { ref, onValue, set } from 'firebase/database'

const provider = new GoogleAuthProvider()
provider.addScope('https://www.googleapis.com/auth/userinfo.email')

export default {
  name: 'HelloWorld',
  metaInfo: {
    title: '歡迎'
  },
  props: ['numbers', 'myS', 'myToday', 'myTotoal'],
  data: () => ({
    step: 0,
    date: new Date().getFullYear() + '/' + parseInt(1 + new Date().getMonth()) + '/' + new Date().getDate(),
    mode: 'today',
    number: 0,
    p: '',
    msg: '',
    reason: '',
    key: '',
    edit: '',
    read: 0,
    user: '',
    name: '',
    token: '',
    uid: '',
    provider: '',
    photoURL: '',
    dismiss: false
  }),
  methods: {
    par (u) {
      if (u === 'https://bestian.github.io/number/img/number.jpeg') {
        u = 'https://bestian.github.io/number/img/number.jpg'
      }
      return u
    },
    t: function (list) {
      var ans = list.filter(function (u) {
        return u.date === new Date().getFullYear() + ' /' + parseInt(1 + new Date().getMonth()) + '/' + new Date().getDate()
      })
      return ans
    },
    s: function (list) {
      // console.log(list)
      list = list || []
      var l = list.slice().sort(function (a, b) {
        var arr1 = a.date.split('/')
        var arr2 = b.date.split('/')
        var ans = (parseInt(arr2[0]) * 36500 + parseInt(arr2[1]) * 3000 + parseInt(arr2[2]) * 100) - (parseInt(arr1[0]) * 36500 + parseInt(arr1[1]) * 3000 + parseInt(arr1[2]) * 100) + parseInt(b.time) - parseInt(a.time)
        return ans
      })
      return l
    },
    obj_to_list (obj) {
      const ks = Object.keys(obj)
      const list = ks.map(function (i) {
        return obj[i]
      })
      return list
    },
    addNumber () {
      const vm = this
      var arr = [ ...this.numbers ]
      if (!this.name) {
        alert('請輸入您的大名')
        return
      }
      var o = {
        uid: this.uid || '123',
        n: this.name,
        reason: this.reason,
        photoURL: (this.photoURL && this.photoURL !== 'https://bestian.github.io/number/img/number.jpeg') ? this.photoURL : 'https://bestian.github.io/number/img/number.jpg',
        time: (new Date()).getTime(),
        date: this.date,
        notJoin: this.notJoin,
        number: this.number
      }
      if (this.number && parseInt(this.number) > 0) {
        if (this.numbers.filter(function (o) {
          return o.n === vm.name && o.date === vm.date
        }).length === 0) {
          arr.push(o)
          console.log(arr)
          this.number = 0
          set(ref(db, 'numbers'), arr).then(() => {
            window.alert('登入成功:' + o.n + '今天念了' + o.number + '聲佛號')
            localStorage.name = this.name
          })
        } else {
          window.alert('您今天已登入過，請明天再來')
        }
      } else {
        window.alert('請輸入您今天念了幾聲佛號')
      }
    },
    logout () {
      const vm = this
      auth.signOut().then(function () {
        vm.user = null
        vm.uid = null
        vm.photoURL = null
      })
    },
    loginGoogle () {
      const vm = this
      if (this.isInApp) {
        window.alert('本系統不支援facebook, line等app內部瀏覽，請用一般瀏覽器開啟，方可登入，謝謝')
      } else {
        signInWithPopup(auth, provider).then((result) => {
          // Th`is gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result)
          const token = credential.accessToken
          // The signed-in user info.
          const user = result.user
          vm.user = user
          vm.email = user.providerData[0].email
          vm.token = token
          vm.uid = user.uid
          vm.photoURL = decodeURI(user.photoURL)
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // The email of the user's account used.
          // const email = error.customData.email;
          // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(errorCode)
          console.log(errorMessage)
        })
      // signInWithRedirect(auth, provider)
      }
    }
  },
  mounted () {
    if (localStorage.name) {
      this.name = localStorage.name
    }
    if (localStorage.dismiss) {
      this.dismiss = localStorage.dismiss
    }
    if (localStorage.reason) {
      this.reason = localStorage.reason
    }
  },
  watch: {
    name (newName) {
      localStorage.name = newName
    },
    reason (newReason) {
      localStorage.reason = newReason
    },
    dismiss (newDismiss) {
      localStorage.dismiss = newDismiss
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.ani {
}

.ani:hover {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

@-webkit-keyframes tada {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  10%, 20% {
    -webkit-transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg);
    transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg);
  }

  30%, 50%, 70%, 90% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }

  40%, 60%, 80% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }

  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

@keyframes tada {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    -ms-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  10%, 20% {
    -webkit-transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg);
    -ms-transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg);
    transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg);
  }

  30%, 50%, 70%, 90% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    -ms-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }

  40%, 60%, 80% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    -ms-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }

  100% {
    -webkit-transform: scale3d(1, 1, 1);
    -ms-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

.tada:hover {
  -webkit-animation: tada 4s linear 3;
  animation: tada 4s linear 3;
}

#s {
  font-size: 16px;
}

.fuo {
  width: 33vmin;
  border-radius: 15px;
  position: relative;
  top: 3.8em;
  z-index: -1;
}

</style>
