<template>
  <section class="chart">
    <el-row type="flex">
      <el-col class="left-part">
        <div class="content-top">
          <div class="image-wrap">
            <img src="../../assets/index/index.png" alt="">
          </div>
          <div class="lt-down">
            <el-row type="flex">
              <el-col :span="24">
                <!-- <i class="iconfont icon-mianji1"></i> -->
                <svg class="iconfont">
                    <use xlink:href="#icon-mianji1"></use>
                </svg>
                <strong>{{totalData.acreage}}</strong>
                <span>㎡</span>
              </el-col>
              <el-col :span="24">
                <!-- <i class="iconfont icon-zongnenghao1"></i> -->
                <svg class="iconfont">
                    <use xlink:href="#icon-zongnenghao1"></use>
                </svg>
                <strong>{{totalData.totalAmount}}</strong>
                <span>kgce</span>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="24">
                <!-- <i class="iconfont icon-yongdianliang1"></i> -->
                <svg class="iconfont">
                    <use xlink:href="#icon-yongdianliang1"></use>
                </svg>
                <strong>{{totalData.totalEle}}</strong>
                <span>kWh</span>
              </el-col>
              <el-col :span="24">
                <!-- <i class="iconfont icon-yongshuiliang1"></i> -->
                <svg class="iconfont">
                    <use xlink:href="#icon-yongshuiliang1"></use>
                </svg>
                <strong>{{totalData.totalWater}}</strong>
                <span>t</span>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="content-down">
          <div class="calendar">
            <div class="calendar-head">
              <el-button class="btn-left" @click.native="changDate('prev')">
                <i class="el-icon-arrow-left"></i>
              </el-button>
              <el-button class="btn-right" @click.native="changDate('next')">
                <i class="el-icon-arrow-right"></i>
              </el-button>
              <div class="ch-content">
                <span>{{month+"月&emsp;&emsp;"+year}}</span>
              </div>
            </div>
            <div class="build-chart">
              <div id="chartCalendar" :style="{'width':'100%'}"></div>
            </div>
          </div>
          <el-row type="flex" class="total-list">
            <el-col :span="24">
              <div class="average">
                <div class="daysquare" style="background:#4bcc68">
                  <span>{{itCalendarData}}</span>
                  天
                </div>
                <span>能耗小于平均值</span>
              </div>
              <!-- <div class="total">
                <strong class="blue-color">
                  {{calendarData.yesterdayTotal}}
                </strong>
                <p>昨日累计(kgce)</p>
              </div> -->
               <div class="total">
                <strong class="blue-color">
                  {{calendarData.energySum}}
                </strong>
                <p>本月累计(kgce)</p>
              </div>
            </el-col>
            <!-- <el-col :span="24"> -->
              <!-- <div class="average">
                <div class="daysquare" style="background:#f1c15b">
                  <span>{{etCalendarData}}</span>
                  天
                </div>
                <span>能耗等于平均值</span>
              </div> -->
              <!-- <div class="total">
                <strong class="blue-color">
                  {{calendarData.energySum}}
                </strong>
                <p>本月累计(kgce)</p>
              </div> -->
            <!-- </el-col> -->
            <el-col :span="24">
              <div class="average">
                <div class="daysquare" style="background:#e65758">
                  <span>{{gtCalendarData}}</span>
                  天
                </div>
                <span>能耗大于平均值</span>
              </div>
              <div class="total">
                <strong class="blue-color">
                  {{calendarData.lastMonthEnergyAvg}}
                </strong>
                <p>同比平均(kgce)</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col class="right-part">
        <div class="content-top">
          <div class="top-nav">
            <strong>用能趋势</strong>
            <el-radio-group v-model="selectDate"  @click.native="getTerndCap(false)">
              <el-radio :label="'week'">最近一周</el-radio>
              <el-radio :label="'month'">本月</el-radio>
              <el-radio :label="'custom'">自定义</el-radio>
            </el-radio-group>
            <div v-show="selectDate=='custom'" class="pickdate">
              <el-date-picker v-model="startTime" type="date" format="yyyy 年 MM 月 dd 日"> placeholder="选择日期时间">
              </el-date-picker>
              <span>~</span>
              <el-date-picker v-model="endTime" type="date" format="yyyy 年 MM 月 dd 日"> placeholder="选择日期时间">
              </el-date-picker>
              <el-button type="primary" class="dateBtn" @click.native="getTerndCap(true)">确定</el-button>
            </div>
            <el-radio-group v-model="tabUse" class="usetab" @click.native="getTerndCap(false)">
              <el-radio-button label="electric">用电</el-radio-button>
              <el-radio-button label="water">用水</el-radio-button>
            </el-radio-group>
          </div>
          <div class="build-chart">
            <div id="chartColumn" :style="{'width':'100%'}"></div>
          </div>
        </div>
        <div class="content-down">
          <el-row type="flex">
            <el-col :span="24" class="rd-left">
              <div class="build-chart">
                <div id="chartGauge" :style="{'width':'100%'}"></div>
                <div class="chartGaugeText">
                  <p>前日环比: {{cellData.preValue}} kWh/㎡</p>
                  <p>比值: <span :class="cellData.bgc"><i :class="cellData.icon"></i> {{cellData.ratio}} %</span></p>
                </div>
              </div>
            </el-col>
            <el-col :span="24" class="rd-middle">
              <div class="build-chart">
                <div id="chartPie" :style="{'width':'100%'}"></div>
              </div>
            </el-col>
            <el-col :span="24" class="rd-right">
              <el-row type="flex" align="middle">
                <el-col :span="24" class="left-data">
                  <div class="left-icon">
                    <i class="iconfont icon-electricity"></i>
                  </div>
                  <div>
                    <strong class="blue-color">
                      {{lastMonthData.thisMonthEle||'暂无数据'}}
                    </strong>
                    <div>
                      <span>本月总用电量</span>
                      <span class="unit">(kWh)</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24" class="right-data">
                  <div>
                    <strong class="blue-color">
                      {{lastMonthData.lastMonthEle||'暂无数据'}}
                    </strong>
                    <div>
                      <span>上月总用电量</span>
                      <span class="unit">(kWh)</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row type="flex" align="middle">
                <el-col :span="24" class="left-data">
                  <div class="left-icon">
                    <i class="iconfont icon-used-water"></i>
                  </div>
                  <div>
                    <strong class="blue-color">
                      {{lastMonthData.thisMonthWater||'暂无数据'}}
                    </strong>
                    <div>
                      <span>本月总用水量</span>
                      <span class="unit">(t)</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24" class="right-data">
                  <div>
                    <strong class="blue-color">
                      {{lastMonthData.lastMonthWater||'暂无数据'}}
                    </strong>
                    <div>
                      <span>上月总用水量</span>
                      <span class="unit">(t)</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row type="flex" align="middle">
                <el-col :span="24" class="left-data">
                  <div class="left-icon">
                    <i class="iconfont icon-energy"></i>
                  </div>
                  <div>
                    <strong class="blue-color">
                      {{lastMonthData.thisMonthAmount||'暂无数据'}}
                    </strong>
                    <div>
                      <span>本月用能总量</span>
                      <span class="unit">(kgce)</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24" class="right-data">
                  <div>
                    <strong class="blue-color">
                      {{lastMonthData.lastMonthAmount||'暂无数据'}}
                    </strong>
                    <div>
                      <span>上月用能总量</span>
                      <span class="unit">(kgce)</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import EchartsJs from "./home.js";

export default EchartsJs;
</script>
<style lang='less'>
.flexfun(@dis:inherit,@align:inherit,@justify:inherit,@direction:inherit) {
  display: @dis;
  align-items: @align;
  justify-content: @justify;
  flex-direction: @direction;
}

.chart {
  width: 100%;
  flex: auto;
  .left-part {
    width: 34.542%;
    margin-right: 1.491vh;
  }
  .right-part {
    flex: auto;
  }

  .left-part,
  .right-part {
    height: 85.018vh;
    .content-top {
      height: 44.833%;
      margin-bottom: 1.491vh;
      overflow: hidden;
      background: #fff;
      border: 1px solid #ddd;
      .flexfun(flex,"","",column);
      .image-wrap{
        width: 100%;
        height: 26.335vh;
        img {
          display: block;
          width: 100%;
        }
      }     
    }
    .content-down {
      height: 53.426%;
      background: #fff;
      border: 1px solid #ddd;
      .chartGaugeText{
            position: absolute;
            bottom:0.5vh;
            padding-left:5vw;
            p{
              font-size: 12px;
              .iconfont{
                font-size: 12px;
              }
              span.red{
                color:rgb(230, 87, 88);
              }
              span.blue{
                color:rgb(75, 204, 104)
              }
            }
          }
      .flexfun(flex,"","",column);
      .el-row {
        flex: auto;
      }
      .calendar {
        height: 32vh;
        .flexfun(flex,"","",column);
        .calendar-head {
          height: 12.77%;
          background: #edf4f1;
          font-size:1.127vw;
          button {
            padding: 0;
            height: 100%;
            border: none;
            background: transparent;
            vertical-align: top;
            &.btn-left {
              float: left;
              margin-left: 0.5vw;
            }
            &.btn-right {
              float: right;
              margin-right: 0.5vw;
            }
          }
          .ch-content {
            height: 100%;
            .flexfun(flex,center,center,"");
          }
        }
        .build-chart {
          height: 82.55%;
        }
      }
      .total-list {
        .flexfun(flex,"","",column);
        // height: 0.33vh;
        .el-col {
          flex: 1;
          .flexfun(flex,"","",row);
          .average {
            flex: 1;
            .flexfun(flex,center,"","");
            padding-left: 1vw;
            .daysquare {
              width: 2.75vw;
              height: 2.25vw;
              color: #fff;
              text-align: center;
              margin-right: 0.5vw;
              font-size: 12px;
              .flexfun(flex,center,center,"");
              span {
                font-size: 1.25vw;
              }
            }
            span {
              font-size: 12px;
            }
          }
          .total {
            flex: 1;
            .flexfun(flex,"",center,column);
            text-align: right;
            padding-right: 1.375vw;
            p {
              font-size: 12px;
            }
          }
        }
      }
    }
  }

  .lt-down {
    flex: auto;
    .flexfun(flex,"","",column);
    padding: 1.491vh;
    color: #eae9f9;
    background: #0b082a;
    opacity: 0.9;
    max-height:50%;
    .el-row {
      flex: 1;
      // max-height:25%;
      .el-col {
        .flexfun(flex,center,"","");
        .iconfont {
          width: 1.6vw;
          height: 1.6vw;
          margin-right: 0.5vw;
        }
        // .icon-mianji{
        //   color:#fd5e84;
        // }
        // .icon-zongnenghao{
        //   color:#ddd14d;
        // }
        // .icon-yongdianliang{
        //   color:#0bb596;
        // }
        // .icon-yongshuiliang{
        //   color:#7791ff;
        // }
        strong {
          font-size: 1.125vw;
          margin-right: 0.5vw;
        }
        span {
          font-size: 14px;
        }
      }
    }
  }

  .top-nav {
    padding: 1vw 1.75vw;
    strong {
      font-size: 1.125vw;
      margin-right: 2vw;
      color: #333;
    }
    .el-radio {
      font-size: 0.875vw;
      .el-radio__label {
        font-size: 0.875vw;
      }
      .el-radio__inner {
        width: 0.875vw;
        height: 0.875vw;
      }
    }

    .pickdate {
      display: inline-block;
      .el-input {
        width: 12vw;
        min-width: 160px;
        input {
          font-size: 0.875vw;
          height: 2.667vh;
          min-height: 21px;
        }
      }
    }

    .dateBtn {
      padding: 0.45vh 0.94vw;
      span{
        font-size: 0.875vw;
      }
    }

    .usetab {
      position: absolute;
      right: 2%;
      .el-radio-button__inner {
        padding: 0.6vh 0.94vw;
        font-size: 0.875vw;
      }
    }
  }

  .build-chart {
    flex: auto;
  }

  .rd-left,
  .rd-middle {
    flex: 1;
    .flexfun(flex,"","",column);
    padding: 0 2.875vw;
    .build-chart {
      flex: auto;
    }
    strong {
      line-height: 2.369vw;
      text-align: center;
    }
  }

  .rd-right {
    .flexfun(flex,"","",column);
    flex: 1.2;
    padding: 2.369vw 0.5vw 1.875vw 0.5vw;
    .el-row {
      flex: 1;
      .el-col {
        display: flex;
        .left-icon {
          .flexfun(flex,center,"","");
          margin-right: 0.875vw;
          .iconfont {
            font-size: 1.875vw;
            color: #16b27e;
          }

        }
      }
      .left-data,
      .right-data {
        span {
          font-size: 12px;
          color: #333333;
        }
        .unit {
          color: #999999;
        }
      }
      .left-data {
        flex: 1.3;
      }
      .right-data {
        flex: 1;
        justify-content: left;
      }
    }
  }

  .blue-color {
    color: #0985f3;
    font-size: 1vw;
  }
}
</style>
