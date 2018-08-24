<template>
  <section class="waterSta">
    <el-row>
      <el-col class="left-part">
        <tree-menu v-model="trendObj"  @changeWaterEle="changeWaterEle"  @changePart="changePart"  @handleNodeClick="handleNodeClick" highlight-current accordion ref="treeMenu"></tree-menu>
      </el-col>
      <el-col class="right-part">
        <div class="right-top">
          <dw-date-picker v-model="dateObject" @btnClick="getTrendData"></dw-date-picker>
        </div>
        <div class="right-middle">
          <div id='lineAndBar' class='mixedChart'></div>
        </div>
        <div class="right-down">
          <template v-if="trendObj.leftTopNav=='water'">
            <el-table :data="waterTableCol" stripe border style="width: 100%;" v-loading="loading">
              <el-table-column prop="target" label="对象名称">
              </el-table-column>
              <el-table-column prop="total" label="累计能耗">
              </el-table-column>
              <el-table-column prop="avg" label="平均值">
              </el-table-column>
              <el-table-column prop="max" label="最大值">
              </el-table-column>
              <el-table-column prop="maxdate" label="最大时间">
              </el-table-column>
            </el-table>
          </template>
          <template v-else>
            <el-table :data="electricTableCol" stripe border style="width: 100%;" v-loading="loading">
              <el-table-column prop="target" label="对象名称">
              </el-table-column>
              <el-table-column prop="total" label="累计能耗">
              </el-table-column>
              <el-table-column prop="avg" label="平均值">
              </el-table-column>
              <el-table-column prop="max" label="最大值">
              </el-table-column>
              <el-table-column prop="maxdate" label="最大时间">
              </el-table-column>
            </el-table>
          </template>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import waterStatistcsJS from "./waterStatistcs.js";

export default waterStatistcsJS;
</script>

<style lang='less'>
.waterSta {
  margin: 0;
  padding: 0;
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
    .right-top {
      padding-top: 2vh;
      height: 10vh;
      overflow: hidden;
      p {
        text-align: center;
        margin: 2vh auto;
      }
      .settime {
        font-size: 14px;
      }
      .el-radio-group {
        margin: 0 2vw;
      }
      .el-button {
        padding: 1.2vh 0.94vw;
        span {
          font-size: 0.875vw;
        }
      }
    }
    .right-middle {
      height: 40vh;
      .mixedChart {
        width: 100%;
        height: 100%;
      }
    }
    .right-down {
      width: 95%;
      margin: 0 auto;
      .el-table {
        font-size: 12px;
      }
      .el-table thead th {
        height: 5vh;
        background: black;
      }
      .el-table td {
        height: 5vh;
      }
      .el-table th > .cell {
        text-align: center;
        background: black;
        color: #fff;
      }
      .el-table .cell {
        line-height: 3.5vh;
        padding-left: 1vw;
        padding-right: 1vw;
      }
    }
  }
}
</style>