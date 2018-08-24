<template>
<section class="energy">
    <el-row>
        <el-col class="left-part">
             <tree-menu v-model="trendObj"  @changeWaterEle="changeWaterEle"  @changePart="changePart"  @handleNodeClick="handleNodeClick" highlight-current accordion ref="treeMenu"></tree-menu>
            </el-col>
            <el-col class="right-part">           
                <div class="right-middle">                        
                    <el-tabs type="border-card" v-model="yearOrMonth"  @tab-click="compareClick">
                        <el-tab-pane label="对比月" name="month">
                            <div class="container-T">
                                <div>
                                    <span>基准日期：</span>
                                    <el-date-picker
                                        v-model="defaultMonth"
                                        type="month"
                                        placeholder="选择日期"
                                        @change="compareM">
                                    </el-date-picker>
                                </div>
                                <div class="secDiv">
                                    <template v-if="trendObj.leftTopNav=='ele'">
                                        <span>用电量：</span>
                                    </template>
                                    <template v-else>
                                        <span>用水量：</span>
                                    </template>
                                    <span class="input-box">{{standardCount}}</span>
                                </div>
                            </div>
                            <div class="container-T cb">
                                <div>
                                    <span>同比日期：</span>
                                    <span class="input-box">{{compareMonth}}</span>
                                </div>
                                <div class="secDiv">
                                    <template v-if="trendObj.leftTopNav=='ele'">
                                        <span>用电量：</span>
                                    </template>
                                    <template v-else>
                                        <span>用水量：</span>
                                    </template>
                                    <span class="input-box">{{yoyCount}}</span>
                                </div>
                                <div class="thirdDiv">
                                    <p>趋势：
                                        <template v-if="yoyTrend > 0" >
                                            <i class="iconfont icon-up" style="color:red;"></i>
                                            <span style="color:red;">{{yoyTrend}}%</span>
                                        </template>
                                        <template v-else-if="yoyTrend < 0" >
                                            <i class="iconfont icon-down" style="color:green;"></i>
                                            <span style="color:green;">{{yoyTrend}}%</span>
                                        </template> 
                                        <template v-else>
                                            <span>{{yoyTrend}}</span>
                                        </template>
                                    </p>
                                </div>
                            </div>
                            <div class="container-T cb">
                                <div>
                                    <span>环比日期：</span>
                                    <span class="input-box">{{compareLink}}</span>
                                </div>
                                <div class="secDiv">
                                    <template v-if="trendObj.leftTopNav=='ele'">
                                        <span>用电量：</span>
                                    </template>
                                    <template v-else>
                                        <span>用水量：</span>
                                    </template>
                                    <span class="input-box">{{linkCount}}</span>
                                </div>
                                <div class="thirdDiv">
                                    <p>趋势：
                                        <template v-if="linkTrend > 0" >
                                            <i class="iconfont icon-up" style="color:red;font-size:18px;"></i>
                                            <span style="color:red;">{{linkTrend}}%</span>
                                        </template>
                                        <template v-else-if="linkTrend < 0" >
                                            <i class="iconfont icon-down" style="color:green;"></i>
                                            <span style="color:green;">{{linkTrend}}%</span>
                                        </template> 
                                        <template v-else>
                                            <span>{{linkTrend}}</span>
                                        </template>
                                    </p>
                                </div>
                            </div>
                            <el-button type="primary" @click="getChartData">确定</el-button>
                        </el-tab-pane>
                        <el-tab-pane label="对比年" name='year'>
                            <div class="container-T">
                                <div>
                                    <span>基准日期：</span>
                                    <el-date-picker
                                        v-model="defaultYear"
                                        type="year"
                                        format="yyyy"
                                        placeholder="选择日期"
                                        @change="compareY">
                                    </el-date-picker>
                                </div>
                                <div class="secDiv">
                                    <template v-if="trendObj.leftTopNav=='ele'">
                                        <span>用电量：</span>
                                    </template>
                                    <template v-else>
                                        <span>用水量：</span>
                                    </template>
                                    <span class="input-box">{{standardCount}}</span>
                                </div>
                            </div>
                            <div class="container-T cb">
                                <div>
                                    <span>同比日期：</span>
                                    <span class="input-box">{{compareYear}}</span>
                                </div>
                                <div class="secDiv">
                                    <template v-if="trendObj.leftTopNav=='ele'">
                                        <span>用电量：</span>
                                    </template>
                                    <template v-else>
                                        <span>用水量：</span>
                                    </template>
                                    <span class="input-box">{{yoyCount}}</span>
                                </div>
                                <div class="thirdDiv">
                                    <p>趋势：
                                        <template v-if="yoyTrend > 0" >
                                            <i class="iconfont icon-up" style="color:red;"></i>
                                            <span style="color:red;">{{yoyTrend}}%</span>
                                        </template>
                                        <template v-else-if="yoyTrend < 0" >
                                            <i class="iconfont icon-down" style="color:green;"></i>
                                            <span style="color:green;">{{yoyTrend}}%</span>
                                        </template> 
                                        <template v-else>
                                            <span>{{yoyTrend}}</span>
                                        </template>                                      
                                    </p>
                                </div>
                            </div>
                            <el-button type="primary" @click="getChartData">确定</el-button>
                        </el-tab-pane>
                        
                    </el-tabs>
                </div>
                <div class="right-down">
                    <div id='timeChart' class='mixedChart'></div>
                </div>
            </el-col>
        </el-row>
    </section>
</template>



<script>
import YearAndMonthJS from "./YearAndMonth.js";

export default YearAndMonthJS;
</script>


<style lang="less">
.energy {
  width: 100%;
  flex: auto;
  .el-row {
    display: flex;
    .grid-content {
      font-size: 0.8vw;
      line-height: 2vh;
      color: #666;
    }
  }
  .left-part {
    width: 20%;
    margin-right: 1.491vh;
}
.right-part {
    flex: auto;
}
.left-part,
.right-part {
    height: 81vh;
    background: #fff;
    overflow: hidden;
    border: 1px solid #ddd;
    box-sizing: border-box;
    .right-middle {
      .el-tabs--border-card {
        width: 95%;
        margin: 2vh auto 0;
        border: none;
        box-shadow: none;
        .el-tabs__header {
          background: transparent;
        }
      }
      .el-tabs__header {
        border-bottom: 1px solid #1072d6;
      }
      .el-tabs__content {
        border-left: 1px solid #1072d6;
        border-right: 1px solid #1072d6;
        border-bottom: 1px solid #1072d6;
        padding: 1vh 1vw;
        border-bottom-left-radius: 1vh;
        border-bottom-right-radius: 1vh;
      }
      .el-tabs__item {
        box-sizing: border-box;
      }
      .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
        border-top: 1px solid #1072d6;
        border-left-color: 1px solid #1072d6;
        background: aliceblue;
        &:first-child {
          border-left: 2px solid #1072d6;
          border-right-color: #1072d6;
          bottom: -1px;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }
        &:last-child {
          border-left-color: #1072d6;
          border-right-color: #1072d6;
          bottom: -1px;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }
      }
      .el-date-editor.el-input{
          width:12.5vw;
      }
      .container-T {
        div {
          display: inline-block;
        }
        .el-input__icon+.el-input__inner{
            font-size: 2vh;
        }
       span {
          font-size: 2vh;
          color: #505459;
        }
        .secDiv {
          margin-left: 4vw;
        }
        .input-box {
          display: inline-block;
          width: 12.5vw;
          height: 4.8vh;
          border: 1px solid #ddd;
          vertical-align: middle;
          line-height: 4.8vh;
          padding-left: 0.5vw;
          color: black;
        }
      }
      .cb {
        margin: 1vh auto;
      }
      .thirdDiv {
        margin-left: 4vw;
        p {
          font-size: 2vh;
          color: #505459;
        }
      }
      .el-button {
        margin-left: 5vw;
        height: 5vh;
        line-height: 0.7;
      }
    }
    .right-down {
      height: 45vh;
      .mixedChart {
        width: 100%;
        height: 100%;
        margin-top: 2vh;
      }
    }
  }
}
</style>
