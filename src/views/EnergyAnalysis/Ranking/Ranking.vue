<template>
  <section class="ranking">
    <el-row>
      <el-col class="left-part">
        <tree-menu v-model="trendObj"  @changeWaterEle="changeWaterEle"  @changePart="changePart" @handleNodeClick="handleNodeClick" highlight-current accordion ref="treeMenu"></tree-menu>
      </el-col>
      <el-col class="right-part">
        <div class="right-top">
          <div class="pickdate">
            <span>时间段</span>
            <el-date-picker v-model="startTime" type="date" placeholder="选择日期时间" class="start-time">
            </el-date-picker>
            <span>~</span>
            <el-date-picker v-model="endTime" type="date" placeholder="选择日期时间">
            </el-date-picker>
            <el-button type="primary" @click="getTableData">确定</el-button>
          </div>
        </div>
        <div class="right-down">
          <el-table :data="rankingTable" stripe border style="width: 100%;" v-loading="loading">
            <el-table-column prop="partname" label="对象名称">
            </el-table-column>
            <el-table-column prop="ranking" label="排名" min-width="180px">
              <template slot-scope="scope">
                <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.bt" :show-text="true"></el-progress>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="实际能耗">
            </el-table-column>
            <el-table-column prop="bt" label="百分比">
              <template slot-scope="scope">{{scope.row.bt+'%'}}</template>
            </el-table-column>
            <el-table-column prop="yoy" label="同比">
              <template slot-scope="scope">
                <span :class="scope.row.yoy<0?'down':scope.row.yoy>0?'up' :''">{{scope.row.yoy?scope.row.yoy+"%":'无数据'}}
                  <i :class="scope.row.yoy<0?'iconfont icon-down':scope.row.yoy>0?'iconfont icon-up' :''"></i>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="qoq" label="环比" class="qoq">
              <template slot-scope="scope">
                <span :class="scope.row.qoq<0?'down':scope.row.qoq>0?'up' :''">{{scope.row.qoq?scope.row.qoq+"%":'无数据'}}
                  <i :class="scope.row.qoq<0?'iconfont icon-down':scope.row.qoq>0?'iconfont icon-up' :''"></i>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import RankingJS from "./Ranking.js";

export default RankingJS;
</script>


<style lang="less">
.ranking {
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
    // .el-tabs--border-card > .el-tabs__content {
    //   padding: 15px 0;
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
      height: 6vh;
      overflow: hidden;
      margin-top: 2vh;
      margin-left: 4vh;
      .el-radio-group {
        margin-left: 2vw;
      }
      .el-date-editor.el-input {
        width: 12vw;
        min-width: 160px;
      }
      .el-input {
        font-size: 12px;
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
        & > span {
          font-size: 1.1vw;
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
        .start-time {
          margin-left: 0.5vw;
        }
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
      .down {
        color: #27a412;
      }
      .up {
        color: #dd1a1a;
      }
    }
  }
}
</style>
