<template>
    <section class="excessAlarm">
        <el-row>
            <el-col class="left-part">
                <tree-menu v-model="trendObj"  @changeWaterEle="changeWaterEle"  @changePart="changePart" highlight-current accordion show-checkbox :check-strictly="true" ref="treeMenu"></tree-menu>
            </el-col>
            <el-col class="right-part">
                <div class="right-top">
                    <dw-date-picker v-model="pageDataObj" @btnClick="sureGo"></dw-date-picker>
                </div>
                <div class="right-down">
                    <template>
                        <el-table v-loading='loading' :data="reportTable" stripe border style="width: 100%;">
                            <el-table-column prop="name" label="对象名称">
                            </el-table-column>
                            <el-table-column prop="overMonth" label="超额月份">
                            </el-table-column>
                            <el-table-column prop="realAndLimit" label="实际使用量/定额量(kWh)">
                            </el-table-column>
                            <el-table-column prop="overValue" label="超标量(kWh)">
                            </el-table-column>
                            <el-table-column prop="proportion" label="超额比例(%)">
                            </el-table-column>
                        </el-table>
                    </template>
                </div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import excessAlarmJS from "./excessAlarm.js";

export default excessAlarmJS;
</script>

<style lang='less'>
.excessAlarm {
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
      height: 6.5vh;
      margin-top: 2vh;
      //   margin-left: 2vw;
      overflow: hidden;
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
      margin: 2vh auto 0;
      .el-table {
        font-size: 12px;
        .cell {
          text-align: center;
        }
        .el-table__body-wrapper {
          overflow-y: auto;
          overflow-x: hidden;
          max-height: 60vh;
        }
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