<template>
  <div class="app-container">
    <div>
      <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" class="screen-btn" @click="screen" />
    </div>
    <div id="con_lf_top_div">
      <div v-for="item in gifts" :key="item.id">
        <div class="box viewport-flip" title="点击翻面" @click="show(item)">
          <div :class="item.show?back:front">
            <div class="prize">{{ item.text }}</div>
          </div>
          <div href="/" :class="item.show?front:back"><img src="http://127.0.0.1:9090/img/bz2.png" style="width:200px" alt="纸牌背面"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { listRaffleDetail } from '@/api/rafflemanagement'
import screenfull from 'screenfull'
export default {
  name: 'PickCardDraw',
  data() {
    return {
      isFullscreen: false,
      fullscreen: true,
      data: '',
      front: 'list flip out',
      back: 'list flip',
      gifts: [],
      pvData: [

      ]
    }
  },
  created() {
  },
  mounted() {
    this.data = this.$route.query
    this.init()
    // this.screen()
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    show(item) {
      item.show = !item.show
    },
    screen() {
      // let element = document.documentElement;//设置后就是我们平时的整个页面全屏效果
      const element = document.getElementById('con_lf_top_div')// 设置后就是   id==con_lf_top_div 的容器全屏
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
      this.isFullscreen = !this.isFullscreen
    },
    async init() {
      const { data } = await listRaffleDetail(this.data)
      this.gifts = []
      this.pvData = data
      this.pvData.forEach(item => {
        let showFlg = false
        if (item.pick === 'Y') {
          showFlg = true
        }
        const gift = {
          id: item.id,
          show: showFlg,
          text: item.prizesName
        }
        this.gifts.push(gift)
      })
    }
  }
}
</script>

<style scoped>
 .in {
        -webkit-animation-timing-function: ease-out;
        -webkit-animation-duration: 350ms;
        animation-timing-function: ease-out;
        animation-duration: 350ms;
    }

    .out {
        -webkit-animation-timing-function: ease-in;
        -webkit-animation-duration: 225ms;
        animation-timing-function: ease-in;
        animation-duration: 225ms;
    }

    .viewport-flip {
        -webkit-perspective: 1000px;
        perspective: 1000px;
        position: absolute;
    }

    .flip {
        -webkit-backface-visibility: hidden;
        -webkit-transform: translateX(0); /* Needed to work around an iOS 3.1 bug that causes listview thumbs to disappear when -webkit-visibility:hidden is used. */
        backface-visibility: hidden;
        transform: translateX(0);
    }

    .flip.out {
        -webkit-transform: rotateY(-90deg) scale(.9);
        -webkit-animation-name: flipouttoleft;
        -webkit-animation-duration: 175ms;
        transform: rotateY(-90deg) scale(.9);
        animation-name: flipouttoleft;
        animation-duration: 175ms;
    }

    .flip.in {
        -webkit-animation-name: flipintoright;
        -webkit-animation-duration: 225ms;
        animation-name: flipintoright;
        animation-duration: 225ms;
    }

    @-webkit-keyframes flipouttoleft {
        from {
            -webkit-transform: rotateY(0);
        }
        to {
            -webkit-transform: rotateY(-90deg) scale(.9);
        }
    }

    @keyframes flipouttoleft {
        from {
            transform: rotateY(0);
        }
        to {
            transform: rotateY(-90deg) scale(.9);
        }
    }

    @-webkit-keyframes flipintoright {
        from {
            -webkit-transform: rotateY(90deg) scale(.9);
        }
        to {
            -webkit-transform: rotateY(0);
        }
    }

    @keyframes flipintoright {
        from {
            transform: rotateY(90deg) scale(.9);
        }
        to {
            transform: rotateY(0);
        }
    }

    .box {
        width: 220px;
        height: 210px;
        padding-top: 30px;
        padding-bottom: 30px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        float: left;
        text-align: center;
    }

    .list {
        position: absolute;
    }

    .prize {
        width: 200px;
        height: 210px;
        text-align: center;
        line-height: 210px;
        border-radius: 5px;
        text-shadow: 1px 1px 1px #ccc;
    }
    .screen-btn{
      margin-bottom: 10px;
      padding: auto;
    }
</style>
