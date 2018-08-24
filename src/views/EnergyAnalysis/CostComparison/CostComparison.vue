<template>
    <section class="costCompare">
        <el-row>
            <el-col class="left-part">
                <tree-menu v-model="pageDataObj"  @changeWaterEle="changeWaterEle"  @changePart="changePart" @handleNodeClick="handleClick" highlight-current accordion show-checkbox :check-strictly="true" ref="treeMenu"></tree-menu>
                <!-- <el-tabs v-model="pageDataObj.leftTopNav" @tab-click="handleClick">
                    <el-tab-pane label="电" name="ele"></el-tab-pane>
                    <el-tab-pane label="水" name="water"></el-tab-pane>
                </el-tabs>
                <el-tabs type="border-card" v-model="pageDataObj.leftBotNav" @tab-click="handleClick" class="botNav">
                    <el-tab-pane label="建筑" name='building'>
                        <el-tree :default-checked-keys="faultData" :default-expand-all='true' :check-strictly="true"  :data="buildingTree" ref="buildingTree" show-checkbox node-key="equipementStationId" :props="buildProps" style="height:64.2vh;overflow:auto"></el-tree>
                    </el-tab-pane>
                    <el-tab-pane label="部门" name="dept">
                        <el-tree :default-checked-keys="faultPart" :default-expand-all='true' :check-strictly="true" :data="departTree" ref="departTree" show-checkbox node-key="departmentId" :props="deptProps" style="height:64.2vh;overflow:auto"></el-tree>
                    </el-tab-pane>
                    <el-tab-pane label="区域" name="area">
                    <el-tree  :default-checked-keys="faultArea" :default-expand-all='true' :check-strictly="true" :data="areaTree" ref="areaTree" show-checkbox node-key="id" :props="areaProps" style="height:64.2vh;overflow:auto;"></el-tree>
                </el-tab-pane>
                </el-tabs> -->
            </el-col>
            <el-col class="right-part">
                <div class="right-top">
                    <dw-date-picker v-model="dateObj" @btnClick="sureGo"></dw-date-picker>
                </div>               
                <div class="right-middle">
                    <div id='lineChart' class='mixedChart'></div>
                </div>
                <div class="right-down">
                    <template v-if="path=='/EnergyAnalysis/CostComparison'">
                        <el-table :data="initTable" stripe border style="width: 100%;" v-loading="loading">
                            <el-table-column prop="parkName" label="对象名称">
                            </el-table-column>
                            <el-table-column prop="sumCost" label="累计费用(元)">
                            </el-table-column>
                            <el-table-column prop="balance" label="差额(元)">
                            </el-table-column>
                            <el-table-column prop="avgCost" label="平均值(元)">
                            </el-table-column>
                            <el-table-column prop="maxCost" label="最大值(元)">
                            </el-table-column>
                            <el-table-column prop="maxDate" label="最大产生时间">
                            </el-table-column>
                        </el-table>
                    </template>
                    <template v-else>
                        <el-table :data="initTable" stripe border style="width: 100%;" v-loading="loading">
                            <el-table-column prop="parkName" label="对象名称">
                            </el-table-column>
                            <el-table-column prop="sumEle" label="累计能耗(kWh)">
                            </el-table-column>
                            <el-table-column prop="avgEle" label="平均值(kWh)">
                            </el-table-column>
                            <el-table-column prop="maxEle" label="最大值(kWh)">
                            </el-table-column>
                            <el-table-column prop="maxDate" label="最大时间">
                            </el-table-column>
                        </el-table>
                    </template>                       
                </div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import CostComparisonJS from "./CostComparison.js";

export default CostComparisonJS;
</script>

<style lang='less'>
.costCompare {
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
    // .botNav{
    //     .el-tabs__item{
    //         width: 25%;
    //     }
    // }
    // .el-tabs--border-card{
    //     border: none;
    //     box-shadow: none;
    // }
    // .el-tabs__header{
    //     width: 100%;
    // }
    // .el-tabs--border-card>.el-tabs__content{
    //     padding:15px 0;
    // }
    // .el-tabs--border-card>.el-tabs__header{
    //     background: #fff;
    //     width:100%;
    //     border:none;
    //     .el-tabs__item.is-active{
    //         background: #20a0ff;
    //         border-radius: 1vh;
    //         color:#fff;
    //     }
    //     .el-tabs__nav-wrap{
    //         .el-tabs__nav-scroll{
    //             .el-tabs__nav{
    //                 border: none;
    //             }
    //         }
    //     }
    //     .el-tabs__item{
    //         height: 4vh;
    //         line-height: 4vh;
    //     }
        
    // }
    // .el-tabs__nav-wrap{
    //         .el-tabs__nav-scroll{
    //             .el-tabs__nav{
    //                 width: 100%;
    //                 background: #fff;
    //                 border-bottom: 1px solid #ddd;
    //                 margin-left:15%;
    //             }
    //         }
    //     }
    // .el-tabs__item {
    //   height: 5vh;
    //   line-height: 5vh;
    //   padding: 0 1vw;
    //   font-size: 2.2vh;
    //   width: 35%;
    //   text-align: center;
    // }
    // .el-tree{
    //     border:none;
    // }
    // .el-tree-node__content{
    //     line-height: 4vh;
    //     height: 4vh;
    // }
    // .el-tree-node__label {
    //     font-size: 1.89vh;
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
      height: 6.5vh;
      margin-top: 2vh;
    //   margin-left: 2vw;
      overflow: hidden;
    //   .el-date-editor.el-input {
    //     width: 12vw;
    //     min-width: 160px;
    //   }
    //   .el-input__inner {
    //     height: 5vh;
    //   }
    //   .el-button {
    //     padding: 1.2vh 0.94vw;
    //     span{
    //         font-size: 0.875vw;
    //     }
    //   }
    //     .pickdate {
    //         display: inline-block;
    //         margin-left: 1vw;
    //         span{
    //             font-size: 14px;
    //         }
    //         .el-input {
    //             width: 12vw;
    //             min-width: 160px;
    //             input {
    //             font-size: 0.875vw;
    //             height: 5vh;
    //             min-height: 21px;
    //             }
    //         }
    //     }
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
       .cell{
           text-align: center;
       }
       .el-table__body-wrapper{
           overflow-y: auto;
           overflow-x: hidden;
           max-height: 20.5vh;
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