<template>
  <div :class="'dw-el-datepicker'">
    <el-radio-group v-if="option.radio" v-model="option.radio" @change="radioChange">
      <el-radio v-for="radio in option.radioArr" :key="radio.id" :label="radio.label">{{radio.content}}</el-radio>
    </el-radio-group>
    <span class="settime">时间段</span>
    <el-date-picker v-for="startDP in option.startDatePickerArr" :key="startDP.id" v-show="show(startDP)" v-model="option[startDP.vmName]" :type="startDP.type" :placeholder="startDP.placeholder" :format="startDP.format" @change="startDateChange">
    </el-date-picker>
    <span v-if="option.endDatePickerArr">~</span>
    <el-date-picker v-for="endDP in option.endDatePickerArr" :key="endDP.id" v-show="show(endDP)" v-model="option[endDP.vmName]" :type="endDP.type" :placeholder="endDP.placeholder" :format="endDP.format" @change="startDateChange">
    </el-date-picker>
    <el-button type="primary" @click="btnClick">确定</el-button>
  </div>
</template>

<script>
import dwDatePickerJS from "./dwDatePicker.js";

export default dwDatePickerJS;
</script>

<style lang="less">
.dw-el-datepicker {
  .settime {
    font-size: 14px;
  }
  .el-radio-group {
    margin: 0 2vw;
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
}
</style>



