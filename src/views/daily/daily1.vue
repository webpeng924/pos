<template>
  <div id="daily">
    <div class="topView">
      <div class="tView">日结</div>
      <div class="dateView">
        <el-date-picker
          v-model="date"
          type="daterange"
          prefix-icon="a"
          :clearable="false"
          range-separator="-"
          format="yyyy年MM月dd日"
        ></el-date-picker>
      </div>
    </div>
    <div class="contentView">
      <div class="left">
        <div class="headerView">
          <div class="tView">实际营业款</div>
          <div class="amtView">
            ￥&nbsp;
            <span>4011</span>
          </div>
          <button class="btn-detail"></button>
          <button class="btn-audio btn-print">打印小票</button>
        </div>
        <div class="listView">
          <div class="one">
            <div class="item">
              <span class="s1">现金类</span>
              <span>实</span>
              <span>虚</span>
            </div>
            <div class="item">
              <span class="s2">现金</span>
              <span>￥2011</span>
              <span class="s2">2011</span>
            </div>
          </div>
          <div class="one">
            <div class="item">
              <span class="s1">卡付类</span>
              <span>实</span>
              <span>虚</span>
            </div>
            <div class="item">
              <span class="s2">储值账户</span>
              <span>￥39</span>
              <span class="s2">39</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="customerView">
          <div class="tView">客源</div>
          <div class="cView">
            <div class="totalCntView cntItem">
              <div>34</div>
              <div>客数</div>
            </div>
            <div>
              <div class="cntItem">
                <div>12</div>
                <div>新客</div>
              </div>
              <div class="cntItem">
                <div>22</div>
                <div>老客</div>
              </div>
            </div>
            <div>
              <div class="cntItem">
                <div>8</div>
                <div>散客</div>
              </div>
              <div class="cntItem">
                <div>26</div>
                <div>会员</div>
              </div>
            </div>
            <div>
              <div class="cntItem">
                <div>1</div>
                <div>男</div>
              </div>
              <div class="cntItem">
                <div>33</div>
                <div>女</div>
              </div>
            </div>
          </div>
        </div>
        <div class="cardSaleView">
          <div class="tView">会员</div>
          <div class="cView">
            <div class="cardSaleView" style="display:block">
              <div class="textView">
                <label class="label-name">
                  开卡
                  <span>4</span>
                </label>
                <label class="label-amt">￥&nbsp;14560</label>
              </div>
              <div class="chartView">
                <div class="cardSalePropView" style="width: 397px;">100%</div>
              </div>
            </div>
            <div class="cardTopupView" style="display:block">
              <div class="textView">
                <label class="label-name">
                  充值
                  <span>0</span>
                </label>
                <label class="label-amt">￥&nbsp;0</label>
              </div>
              <div class="chartView">
                <div class="cardTopupPropView" style="width: 40px;">0%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="saleInfoView">
          <div class="tView">服务</div>
          <div class="cView">
            <div class="serviceTopView" style="display:block">
              <div class="tView">项目Top&nbsp;5</div>
              <div class="bcView">
                <div class="headerView">
                  <label>类别</label>
                  <label>金额</label>
                  <label>次数</label>
                </div>
                <div class="itemView">
                  <label class="overflowText">美容</label>
                  <label>￥&nbsp;1586</label>
                  <label>9</label>
                  <img
                    src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Sort_1.png"
                    class="img-index"
                  />
                  <!---->
                </div>
                <div class="itemView">
                  <label class="overflowText">美睫</label>
                  <label>￥&nbsp;916.24</label>
                  <label>3</label>
                  <img
                    src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Sort_2.png"
                    class="img-index"
                  />
                  <!---->
                </div>
                <div class="itemView">
                  <label class="overflowText">美足</label>
                  <label>￥&nbsp;812</label>
                  <label>5</label>
                  <img
                    src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Sort_3.png"
                    class="img-index"
                  />
                  <!---->
                </div>
                <div class="itemView">
                  <label class="overflowText">按摩</label>
                  <label>￥&nbsp;534</label>
                  <label>16</label>
                  <!---->
                  <div class="tag-index">4</div>
                </div>
                <div class="itemView">
                  <label class="overflowText">美甲</label>
                  <label>￥&nbsp;496.64</label>
                  <label>8</label>
                  <!---->
                  <div class="tag-index">5</div>
                </div>
              </div>
            </div>
            <div class="productTopView" style="display:block">
              <div class="tView">产品Top&nbsp;5</div>
              <div class="bcView">
                <div class="headerView">
                  <label>类别</label>
                  <label>金额</label>
                  <label>次数</label>
                </div>
                <div class="itemView">
                  <label class="overflowText">美容</label>
                  <label>￥&nbsp;10476.60</label>
                  <label>23</label>
                  <img
                    src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Sort_1.png"
                    class="img-index"
                  />
                  <!---->
                </div>
                <div class="itemView">
                  <label class="overflowText">书本</label>
                  <label>￥&nbsp;80</label>
                  <label>1</label>
                  <img
                    src="https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Sort_2.png"
                    class="img-index"
                  />
                  <!---->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      date: '',
      now: '',
      list: []
    }
  },
  watch: {},
  computed: {},
  methods: {
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    }
  },
  created () {
    const a = new Date() + ''
    this.date = [a, a]
  },
  mounted () { }
}
</script>
<style>
#daily .dateView .el-input__inner {
  border: none;
}
.el-date-editor .el-range-input,
.el-date-editor .el-range-separator {
  font-size: 18px;
}
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: auto;
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
#daily {
  background: #fff
    url(https://static.bokao2o.com/wisdomDesk/images/Def_Bc_ReportTopBc.png)
    70px top / 300px 242px no-repeat;
  background-size: 33% 242px;
  .tView {
    color: #fff;
  }
  .dateView {
    position: absolute;
    right: 0;
    display: flex;
    line-height: 40px;
    height: 40px;
    font-size: 16px;
    color: #8a8a8a;
    cursor: pointer;
    margin-right: 5%;
    padding-right: 25px;
    // background: #fff
    //   url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Next.png) right
    //   center / 28px no-repeat;
  }
  .contentView {
    display: flex;
    height: calc(100% - 85px);
    .left {
      width: 40%;
      height: 100%;
      border-right: 0.5px solid rgba(154, 154, 154, 0.5);
      .headerView {
        position: relative;
        padding: 15px 22px 0 22px;
        height: 157px;
        z-index: 10;
        .tView {
          line-height: 22px;
          margin-bottom: 10px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
        }
        .amtView {
          line-height: 42px;
          font-size: 20px;
          font-family: PingFangSC-Medium;
          color: #fff;
          span {
            font-size: 36px;
            vertical-align: top;
          }
        }
        .btn-detail {
          position: absolute;
          top: 20px;
          right: 0;
          width: 110px;
          height: 116px;
          background: transparent
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Bc_CKXQ.png)
            center / 110px no-repeat;
        }
        .btn-print {
          position: absolute;
          bottom: 0;
          right: 22px;
          width: 90px;
          height: 30px;
          font-size: 13px;
          color: #28282d;
          background: #fff
            url(https://static.bokao2o.com/wisdomDesk/images/Icon_Def_Print_Black.png)
            0 center / 19px no-repeat;
          padding-left: 20px;
        }
      }
      .listView {
        height: calc(100% - 157px);
        overflow: auto;
        padding: 15px;
        .one {
          .item {
            display: flex;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            color: #28282d;
            &:first-child {
              font-size: 17px;
              height: 40px;
              line-height: 40px;
              .s1 {
                flex: 4;
                color: limegreen;
              }
            }
            .s2 {
              color: #8a8a8a;
            }
            span {
              flex: 3;
              &:last-child {
                text-align: right;
              }
            }
          }
        }
      }
    }
    .right {
      width: 60%;
      height: 100%;
      padding: 0 20px;
      > div {
        margin-top: 35px;
      }
      .tView {
        line-height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Semibold;
        color: #28282d;
        padding: 15px 0 15px 30px;
      }
      .customerView > .cView > div {
        border-right: 0.5px solid rgba(220, 220, 220, 0.7);
        &:last-child {
          border: none;
        }
      }

      .customerView .cView {
        padding-left: 50px;
      }
      .cView {
        display: flex;
        text-align: center;
        > div {
          padding: 0 15px;
          flex: 1;
          display: flex;
          > div {
            flex: 1;
            & > div:nth-child(1) {
              margin-bottom: 10px;
              font-weight: 700;
            }
          }
        }

        .totalCntView {
          display: block;
          text-align: left;
          div:nth-child(1) {
            color: #47bf7c;
            font-size: 28px;
            line-height: 28px;
            margin-bottom: 10px;
          }
        }
        .textView {
          padding: 0 35px 0 15px;
          line-height: 22px;
          margin-bottom: 13px;
          color: #28282d;
          display: flex;
          justify-content: space-between;
        }
      }
      .chartView {
        height: 16px;
        border-radius: 4px;
        background: #f4f4f4;
        overflow: hidden;
        text-align: right;
      }
      .chartView > div {
        transition: transform 0.7s, background 0.7s, font-size 0.7s, width 0.7s;
        font-size: 10px;
        color: #fff;
        padding: 0 5px;
        min-width: 40px;
        border-radius: 4px;
        &.cardSalePropView {
          background: #edb339;
        }
        &.cardTopupPropView {
          background: #f44e4e;
        }
      }
      .saleInfoView > .cView > div > .bcView {
        border-radius: 5px;
        background: #f8f8f8;
        padding-bottom: 15px;
        min-height: 270px;
        .headerView {
          display: flex;
          border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
          padding: 15px 0 10px 40px;
          line-height: 20px;
        }
        label {
          flex: 1;
          text-align: center;
          font-size: 14px;
          color: #28282d;
        }
        .itemView {
          position: relative;
          display: flex;
          margin-top: 18px;
          padding-left: 40px;
          line-height: 24px;
          label:nth-child(1) {
            flex: 1.5;
            text-align: left;
          }
          .img-index {
            position: absolute;
            top: 0;
            left: 12px;
            width: 24px;
            height: 24px;
          }
          .tag-index {
            position: absolute;
            top: 2px;
            left: 12px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            font-family: DINAlternate-Bold;
            background: #dddddd;
            border-radius: 50%;
            color: #8a8a8a;
            text-align: center;
          }
        }
      }
      .saleInfoView .cView .tView {
        text-align: left;
        padding: 0;
        line-height: 36px;
        font-size: 14px;
        color: #28282d;
      }
    }
  }
}
</style>
