<template>
  <div class="container" id="print">
    <div class="row">
      <div class="col-sm-12">
        <div
          class="col-sm-3 invisible"
          id="print"
          style="height: 1px;font-size: 8px;margin-top:10px"
        >
          <center>{{printcontent.shopname}}</center>
          <center>{{printcontent.type}}</center>
          <hr style="height:1px;border:none;border-top:1px dashed black;" />
          <p
            style="margin-bottom: 0px;"
            v-show="printcontent.order_no"
          >消费单号:{{printcontent.order_no}}</p>
          <p style="margin-bottom: 0px;" v-show="printcontent.time">消费日期:{{printcontent.time}}</p>
          <p style="margin-bottom: 0px;" v-show="printcontent.Othertime">{{printcontent.Othertime}}</p>
          <!-- <table border="0" frame="void"> -->
          <div style="width:100%" v-show="printcontent.titleList&&printcontent.titleList.length>0">
            <hr style="height:1px;border:none;border-top:1px dashed black;" />
            <tr v-for="(v,k) in printcontent.titleList" :key="k" class="box">
              <td style="width: 40%">{{v.name}}</td>
              <td style="width: 100px;text-align: center;">{{v.val}}</td>
              <td style="width: 100px;text-align: right;">{{v.val1}}</td>
            </tr>
          </div>
          <!-- </table> -->
          <div style="width:100%" v-show="printcontent.goodsList&&printcontent.goodsList.length>0">
            <hr style="height:1px;border:none;border-top:1px dashed black;" />
            <tr v-for="(v,k) in printcontent.goodsList" :key="k" class="box">
              <td style="width: 40%">{{v.name}}</td>
              <td style="width: 100px;text-align: center;">{{v.val}}</td>
              <td style="width: 100px;text-align: right;">{{v.val1}}</td>
            </tr>
          </div>
          <div
            style="width:100%"
            v-show="printcontent.discontList&&printcontent.discontList.length>0"
          >
            <hr style="height:1px;border:none;border-top:1px dashed black;" />
            <tr v-for="(v,k) in printcontent.discontList" :key="k" class="box">
              <td style="width: 40%">{{v.name}}</td>
              <td style="width: 100px;text-align: center;">{{v.val}}</td>
              <td style="width: 100px;text-align: right;">{{v.val1}}</td>
            </tr>
          </div>
          <div style="width:100%" v-show="printcontent.payList&&printcontent.payList.length>0">
            <hr style="height:1px;border:none;border-top:1px dashed black;" />
            <tr v-for="(v,k) in printcontent.payList" :key="k" class="box">
              <td style="width: 40%">{{v.name}}</td>
              <td style="width: 100px;text-align: center;">{{v.val}}</td>
              <td style="width: 100px;text-align: right;">{{v.val1}}</td>
            </tr>
          </div>
          <div
            style="width:100%"
            v-show="printcontent.memeberinfo&&printcontent.memeberinfo.length>0"
          >
            <hr style="height:1px;border:none;border-top:1px dashed black;" />
            <tr v-for="(v,k) in printcontent.memeberinfo" :key="k" class="box">
              <td style="width: 100%;">{{v.name}}</td>
              <!-- <td style="width: 100px;text-align: center;">{{v.val}}</td>
              <td style="width: 100px;text-align: right;">{{v.val1}}</td>-->
            </tr>
          </div>
          <div
            style="width:100%"
            v-show="printcontent.remarkinfo&&printcontent.remarkinfo.length>0"
          >
            <hr style="height:1px;border:none;border-top:1px dashed black;" />
            <tr v-for="(v,k) in printcontent.remarkinfo" :key="k" class="box">
              <td style="width: 100%;">{{v.name}}</td>
              <!-- <td style="width: 100px;text-align: center;">{{v.val}}</td>
              <td style="width: 100px;text-align: right;">{{v.val1}}</td>-->
            </tr>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import print from "print-js"
export default {
  components: {},
  props: ['printList'],
  data () {
    return {
      printcontent: ''
    }
  },
  methods: {
    print () {
      printJS({
        printable: 'print',
        type: 'html',
        // css: `.box {width: 100%;display: table-row;}`,
        targetStyles: ['*'],
        scanStyles: false
      })
    }
  },
  created () {
    if (!this.printList) {
      return false
    } else {
      this.printcontent = JSON.parse(this.printList)
      console.log(this.printcontent)
    }
  },
  mounted () {
    this.print()
  },
  watch: {},
  computed: {}
}
</script>

<style lang="scss">
// .box {
//   width: 100%;
//   td {
//     width: 30%;
//     &:first-child {
//       text-align: left;
//     }
//     &:last-child {
//       text-align: right;
//     }
//   }
// }
</style>
