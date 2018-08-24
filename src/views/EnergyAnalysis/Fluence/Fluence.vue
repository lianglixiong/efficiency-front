<template>
<section class="fluence">
    <el-row>
        <el-col class="left-part">
            <tree-menu v-model="trendObj"  @changeWaterEle="changeWaterEle"  @changePart="changePart"  @handleNodeClick="handleNodeClick" highlight-current accordion ref="treeMenu"></tree-menu>
            <!-- <el-tabs v-model="leftTopNav" >
                    <el-tab-pane label="电" name="ele"></el-tab-pane>
                    <el-tab-pane label="水" name="water"></el-tab-pane>
            </el-tabs>
            <el-tabs type="border-card" v-model="leftBotNav">
                <el-tab-pane label="建筑" name='park'>
                    <el-tree :data="buildingTree" :props="buildProps" highlight-current accordion @node-click="handleNodeClick" :default-expanded-keys="defaultBuilding" node-key="equipementStationId" ref="buildingTree" style="height:64.2vh;overflow:auto;"></el-tree>
                </el-tab-pane>
                <el-tab-pane label="部门" name="dept">
                    <el-tree :data="departTree" :props="deptProps" highlight-current accordion @node-click="handleNodeClick" :default-expanded-keys="defaultDepartment" node-key="departmentId" style="height:64.2vh;overflow:auto;" ref="departTree"
                    ></el-tree>
                </el-tab-pane>
            </el-tabs> -->

        </el-col>
        <el-col class="right-part">           
            <div class="right-top">
                <div class="pickdate">
                    <span>时间段</span>
                    <el-date-picker v-model="startTime" type="date" placeholder="选择日期时间">
                    </el-date-picker>
                    <span>~</span>
                    <el-date-picker v-model="endTime" type="date" placeholder="选择日期时间">
                    </el-date-picker>
                    <el-button type="primary" @click="getChartData">确定</el-button>
                </div>
            </div>               
            <div class="right-down">                               
                <div id='fluenceChart' class="mixedChart"></div>               
            </div>
        </el-col>
    </el-row>
</section>
</template>



<script>
import FluenceJS from "./Fluence.js";

export default FluenceJS;
</script>


<style lang="less">
.fluence {
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
    //     .el-tabs--border-card {
    //     border: none;
    //     box-shadow: none;
    //     }
    //     .el-tabs__header {
    //     width: 100%;
    //     }
    //     .el-tabs--border-card>.el-tabs__content{
    //         padding:15px 0;
    //     }
    //     .el-tabs--border-card > .el-tabs__header {
    //     background: #fff;
    //         width:100%;
    //         border:none;
    //     .el-tabs__item.is-active {
    //             background: #20a0ff;
    //             border-radius: 1vh;
    //             color:#fff;
    //         }
    //         .el-tabs__nav-wrap{
    //             .el-tabs__nav-scroll{
    //                 .el-tabs__nav{
    //                     border: none;

    //                 }
    //             }
    //         }
    //         .el-tabs__item{
    //             height: 4vh;
    //             line-height: 4vh;
    //         }
    //     }
    //     .el-tabs__nav-wrap{
    //         .el-tabs__nav-scroll{
    //             .el-tabs__nav{
    //                 width: 100%;
    //                 background: #fff;
    //                 border-bottom: 1px solid #ddd;
    //                 margin-left:15%;
    //             }
    //         }
    //     }
    //     .el-tabs__item {
    //     height: 5vh;
    //     line-height: 5vh;
    //     padding: 0 1vw;
    //     font-size: 2.2vh;
    //     width: 35%;
    //     text-align: center;

    //     }
    //     .el-tree{
    //         border:none;
    //     }
    //     .el-tree--highlight-current {
    //   .el-tree-node.is-current>.el-tree-node__content{
    //         color: #20a0ff;
    //         background: #fff;
    //   }
    // }
    // .el-tree-node__content {
    //   line-height: 4vh;
    //   height: 4vh;
    // }
    //     .el-tree-node__label {
    //         font-size: 2vh;
    //     }
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
            .el-radio-group{
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
                span{
                    font-size: 0.875vw;
                }
            }
            .pickdate {
                display: inline-block;
                margin-left: 1vw;
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
        }
        .right-down {
            height: 66vh;
            margin-top: 2vh;
            .noData{
                text-align: center;
                font-size: 1.5vw;
                color: red;
                font-weight: bold;
                margin-top: -30%;
            }
            .mixedChart {
                width: 100%;
                height: 100%;
            }
            
        }
    }
}
</style>
