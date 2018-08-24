<template>
  <section class="synreport">
    <el-row>
      <el-col class="left-part">
        <tree-menu v-model="trendObj"  @changeWaterEle="changeWaterEle"  @changePart="changePart" highlight-current accordion show-checkbox :check-strictly="true" ref="treeMenu"></tree-menu>
      </el-col>
      <el-col class="right-part">
        <div class="right-top">
          <dw-date-picker v-model="datePickerObj" radioType="m,y" @btnClick="submitSend"></dw-date-picker>
          <el-button type="primary" class="export" @click.native="exportData()">导出</el-button>
        </div>
        <div class="right-down">
          <template>
            <el-table :data="reportTable" :stripe="true" border style="width: 100%;height:64vh;" height="45vh" v-loading="loading">
              <template v-if="trendObj.leftNavType=='2'">
                <el-table-column prop="belongName" label="建筑名称" fixed min-width="100px" class-name="first-header"></el-table-column>
              </template>
              <template v-else>
                <el-table-column prop="belongName" label="部门名称" fixed min-width="100px" class-name="first-header"></el-table-column>
              </template>
              <el-table-column v-for="item in timeArr" :key="item" :label="item">
                <el-table-column label="电(kwh)" :prop="'eleValue'+item" min-width="120px"></el-table-column>
                <el-table-column label="水(t)" :prop="'waterValue'+item" min-width="120px"></el-table-column>
                <el-table-column label="标准煤" :prop="'coalValue'+item" min-width="120px"></el-table-column>
              </el-table-column>
              <el-table-column label="合计" width="auto" max-height='68vh' min-width="360px">
                <el-table-column label="电(kwh)" prop="eleValueAmountTotal" min-width="120px"></el-table-column>
                <el-table-column label="水(t)" prop="waterValueAmountTotal" min-width="120px"></el-table-column>
                <el-table-column label="标准煤" prop="coalValueAmountTotal" min-width="120px"></el-table-column>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import syntheticalReportJS from "./syntheticalReport.js";

export default syntheticalReportJS;
</script>

<style lang='less'>
.synreport {
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
    // .el-tabs--border-card {
    //   border: none;
    //   box-shadow: none;
    // }
    // .el-tabs__header {
    //   width: 100%;
    // }
    // .el-tabs--border-card > .el-tabs__header {
    //   background: #fff;
    //   width: 100%;
    //   border: none;
    //   .el-tabs__item.is-active {
    //     background: #20a0ff;
    //     border-radius: 1vh;
    //     color: #fff;
    //   }
    //   .el-tabs__nav-wrap {
    //     .el-tabs__nav-scroll {
    //       .el-tabs__nav {
    //         border: none;
    //       }
    //     }
    //   }
    //   .el-tabs__item {
    //     height: 4vh;
    //     line-height: 4vh;
    //   }
    // }
    // .el-tabs__nav-wrap {
    //   .el-tabs__nav-scroll {
    //     .el-tabs__nav {
    //       width: 100%;
    //       background: #fff;
    //       border-bottom: 1px solid #ddd;
    //       margin-left: 15%;
    //     }
    //   }
    // }
    // .el-tabs__item {
    //   height: 5vh;
    //   line-height: 5vh;
    //   padding: 0 1vw;
    //   font-size: 2.2vh;
    //   width: 35%;
    //   text-align: center;
    // }
    // .el-tree {
    //   border: none;
    // }
    // .el-tree--highlight-current {
    //   .el-tree-node.is-current > .el-tree-node__content {
    //     color: #20a0ff;
    //     background: #fff;
    //   }
    // }
    // .el-tree-node__content {
    //   line-height: 4vh;
    //   height: 4vh;
    // }
    // .el-tree-node__label {
    //   font-size: 2vh;
    // }
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
      width: 95%;
      height: 6.5vh;
      margin-top: 2vh;
      margin-left: 2vw;
      overflow: hidden;
      .el-radio-group {
        margin-left: 0;
      }
      .el-date-editor.el-input {
        width: 12vw;
        min-width: 160px;
      }
      .el-input__inner {
        height: 5vh;
      }
      .el-button {
        padding: 1.2vh 0.94vw;
        span {
          font-size: 0.875vw;
        }
      }
      .pickdate {
        display: inline-block;
        margin-left: 1vw;
        span {
          font-size: 14px;
        }
        .el-input {
          width: 12vw;
          min-width: 160px;
          input {
            font-size: 0.875vw;
            height: 5vh;
            min-height: 21px;
          }
        }
      }
      .export {
        position: absolute;
        right: 2.5vw;
        top: 2.5vh;
        background-color: #1ebb86;
        border: 1px solid #1ab27f;
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
      margin: 2vh auto 0;
      .el-table {
        font-size: 12px;
        // .el-table__fixed{
        //   box-shadow: none;
        // }
        td {
          height: 5vh;
        }
        .cell {
          text-align: center;
          line-height: 3.5vh;
          padding-left: 0;
          padding-right: 0;
        }
        thead {
          th {
            height: 5vh;
            background: black;
            .cell {
              text-align: center;
              background: black;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>