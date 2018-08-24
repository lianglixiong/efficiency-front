<template>
  <section class="itemSta">
    <div class="right-top" style="display:inline-block">
      <el-radio-group v-model="radio">
        <el-radio v-model="radio" label="week">最近一周</el-radio>
        <el-radio v-model="radio" label="month">本月</el-radio>
        <el-radio v-model="radio" label="custom">自定义</el-radio>
      </el-radio-group>
      <div v-show="radio=='custom'" class="pickdate">
        <el-date-picker v-model="dateObject.customStart" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
        <span>~</span>
        <el-date-picker v-model="dateObject.customEnd" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <el-button type="primary" @click="getDataFn(false)">确定</el-button>
    </div>
    <el-row>
      <el-col class="left-part">
        <tree-menu v-model="trendObj" @changePart="changePart" @handleNodeClick="handleNodeClick" highlight-current accordion ref="treeMenu"></tree-menu>
      </el-col>
      <el-col class="right-part">
        <div class="right-middle">
          <div class="light">
            <div class="light-T">
              <div class="light-icon">
                <i class="iconfont icon-zhaomingyongdian"></i>
                <span>照明用电</span>
              </div>
              <div class="light-text">
                <p class="text">能耗(kwh)</p>
                <p class="num">{{statisticObj.light}}</p>
              </div>
            </div>
          </div>
          <div class="AC">
            <div class="light-T">
              <div class="light-icon">
                <i class="iconfont icon-kongtiaoyongdian"></i>
                <span>空调用电</span>
              </div>
              <div class="light-text">
                <p class="text">能耗(kwh)</p>
                <p class="num">{{statisticObj.ac}}</p>
              </div>
            </div>
          </div>
          <div class="power">
            <div class="light-T">
              <div class="light-icon">
                <i class="iconfont icon-dongliyongdian"></i>
                <span>动力用电</span>
              </div>
              <div class="light-text">
                <p class="text">能耗(kwh)</p>
                <p class="num">{{statisticObj.power}}</p>
              </div>
            </div>
          </div>
          <div class="special">
            <div class="light-T">
              <div class="light-icon">
                <i class="iconfont icon-teshuyongdian"></i>
                <span>特殊能耗</span>
              </div>
              <div class="light-text">
                <p class="text">能耗(kwh)</p>
                <p class="num">{{statisticObj.special}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="right-down">
          <div class="chart-left" id='chartColumn'></div>
          <div class="chart-right" id='chartPie'></div>
        </div>
      </el-col>
    </el-row>
  </section>
</template>


<script>
import ItemStatisticsJs from "./ItemStatistics.js";

export default ItemStatisticsJs;
</script>

<style lang='less'>
.box-style () {
  width: 24.25%;
  height: 100%;
  margin-left: 1%;
  display: inline-block;
}
.icon-style() {
  display: block;
  font-size: 6vh;
  color: white;
  padding-bottom: 1vh;
}
.boxIcon-style() {
  float: left;
  width: 50%;
  text-align: center;
  margin-top: 3.5vh;
}
.boxText-style() {
  float: right;
  width: 50%;
  margin-top: 15%;
}
.p-text() {
  color: white;
  font-size: 12px;
}
.p-num() {
  color: white;
  font-size: 1.5vw;
  font-weight: bold;
}
.itemSta {
  margin: 0;
  padding: 0;
  width: 100%;
  flex: auto;
  .el-row {
    display: flex;
  }
  .right-top {
    display: inline-block;
    position: absolute;
    right: 1vw;
    top: 14vh;
    .pickdate {
      display: inline-block;
    }
    .el-date-editor.el-input {
      width: 12vw;
      min-width: 160px;
    }
    .el-input {
      font-size: 12px;
    }
    .el-input__inner {
      height: 4vh;
    }
    .el-button {
      font-size: 12px;
      line-height: 0.6;
    }
  }
  .left-part {
    width: 20%;
    margin-right: 1.491vh;
    background: #fff;
  }
  .right-part {
    flex: auto;
  }

  .left-part,
  .right-part {
    height: 81vh;
    .right-middle {
      .background(@pos,@from,@to) {
        background: -moz-linear-gradient(@pos, @from, @to);
        .box-style;
        background: -o-linear-gradient(@pos, @from, @to);
        border-radius: 0.2rem;
        background: -webkit-linear-gradient(@pos, @from, @to);
        filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr=@from, endColorStr=@to);
        background: -ms-linear-gradient(@pos, @from, @to);
      }
      display: flex;
      height: 22vh;
      margin-bottom: 2vh;
      margin-top: 2vh;
      clear: both;
      .light {
        margin-left: 0;
        .background(left, #24d87d, #17af62);
      }
      .AC {
        .background(left, #2fc7ff, #12abe3);
      }
      .power {
        .background(left, #ffd65e, #e3b221);
      }
      .special {
        .background(left, #f97373, #e74e4e);
      }
      .light-T {
        height: 85%;
        .light-icon {
          .boxIcon-style;
          i {
            .icon-style;
          }
          span {
            font-size: 2.2vh;
            color: white;
          }
        }
        .light-text {
          .boxText-style;
          .text {
            .p-text;
          }
          .num {
            .p-num;
          }
        }
      }
    }
    .right-down {
      height: 54.9vh;
      .chart-left {
        display: inline-block;
        width: 63%;
        height: 100%;
        border: 1px solid #eee;
        background: #fff !important;
      }
      .chart-right {
        display: inline-block;
        width: 35.5%;
        height: 100%;
        margin-left: 1%;
        border: 1px solid #eee;
        background: #fff !important;
      }
    }
  }
}
</style>