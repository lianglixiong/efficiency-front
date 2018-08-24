<template>
    <section class="quota">
        <el-row>
            <el-col class="left-part">
                 <tree-menu v-model="trendObj"  @changeWaterEle="changeWaterEle"  @changePart="changePart"  @handleNodeClick="handleNodeClick" highlight-current accordion ref="treeMenu"></tree-menu>
                <!-- <el-tabs v-model="leftTopNav">
                    <el-tab-pane label="电" name="ele"></el-tab-pane>
                    <el-tab-pane label="水" name="water"></el-tab-pane>
                </el-tabs>
                <el-tabs type="border-card" v-model="leftBotNav">
                    <el-tab-pane label="建筑" name='building'>
                        <el-tree :data="buildingTree" :props="buildProps" highlight-current accordion @node-click="handleNodeClick" :default-expanded-keys="defaultBuilding" node-key="equipementStationId" ref="buildingTree" style="height:64.2vh;overflow:auto;"></el-tree>
                    </el-tab-pane>
                    <el-tab-pane label="部门" name="dept">
                        <el-tree :data="departTree" :props="deptProps" highlight-current accordion @node-click="handleNodeClick" :default-expanded-keys="defaultDepartment" node-key="departmentId" style="height:64.2vh;overflow:auto;" ref="departTree"></el-tree>
                    </el-tab-pane>
                </el-tabs> -->
            </el-col>
            <el-col class="right-part">
                <div class="right-top">
                    <template v-if="trendObj.leftBotNav=='building'">
                        <p>{{sename}}定额设置</p>
                    </template>
                    <template v-else>
                        <p>{{departmentName}}定额设置</p>
                    </template>
                   <div class="pickyear">
                        <span>日期</span>
                        <el-date-picker
                            v-model="choseyear"
                            type="year"
                            placeholder="选择年">
                        </el-date-picker>
                        <el-button type="primary" class="check" @click="checkData">查询</el-button>
                        <el-button type="primary" @click="setData">保存</el-button>
                   </div>
                </div>
                <div class="right-down">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <p>1月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input1'></el-input>
                        </el-col>
                        <el-col :span="6">
                            <p>2月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input2'></el-input>
                        </el-col>
                        <el-col :span="6">
                            <p>3月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input3'></el-input>
                        </el-col>
                        <el-col :span="6">
                            <p>4月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input4'></el-input>
                        </el-col>                        
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <p>5月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input5'></el-input>
                        </el-col>
                        <el-col :span="6">
                            <p>6月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input6'></el-input>
                        </el-col>
                        <el-col :span="6">
                            <p>7月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input7'></el-input>
                        </el-col>
                        <el-col :span="6">
                            <p>8月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input8'></el-input>
                        </el-col>                        
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <p>9月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input9'></el-input>
                        </el-col>
                        <el-col :span="6">
                            <p>10月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input10'></el-input>
                        </el-col>
                        <el-col :span="6">
                            <p>11月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input11'></el-input>
                        </el-col>
                        <el-col :span="6">
                            <p>12月</p>
                            <el-input placeholder="请输入值" clearable type="number" v-model='monthObj.input12'></el-input>
                        </el-col>                        
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </section>
</template>



<script>
import quotaMangeJS from "./quotaMange.js";

export default quotaMangeJS;
</script>


<style lang="less">
.quota {
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
    .left-part,.right-part {
        height: 81vh;
        background: #fff;
        overflow: hidden;
        border: 1px solid #ddd;
        box-sizing: border-box;    
    }
    .right-part {
        flex: auto;
        .right-top{
            width: 46vw;
            height:10vh;
            margin-top:2vh;
            margin-left: 1.5vw;
            p{
                font-size: 14px;
                margin-bottom: 3vh;
            }
            .pickyear{
                .el-date-editor.el-input{
                    width: 8vw;
                }
                .el-input__inner{
                    height: 5vh;
                }
                .el-button{
                    height: 5vh;
                    padding: 0 1vw;
                    float:right;
                }
                .check{
                    margin-left: 2vw;
                    float: inherit;
                }
            }
        }
        .right-down{
            width: 50vw;
            margin-left: 1.5vw;
            margin-top:5vh;
            .el-row{
                margin-bottom: 4vh;
                p{
                    font-size: 12px;
                    color:#9bb2d0; 
                    margin-bottom: 0.5vh;
                }
                .el-input{
                    width: 80%;
                }
                .el-input__inner{
                    // width: 80%;
                    height: 4.5vh;
                    font-size: 12px;
                }
            }           
        }
    }
}
</style>
