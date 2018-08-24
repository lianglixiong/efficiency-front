import echarts from 'echarts'
import { DwDatePicker, TreeMenu } from '@/components'
import { transDate } from 'utils/'
import qs from 'qs'

export default {
  name: 'ReportManager-AyntheticalReport',
  components: { DwDatePicker, TreeMenu },
  data() {
    let _self = this,
      today = new Date();
    return {
      userid: _self.$store.getters.getUserinfo.customerId,
      loading: false,
      datePickerObj: {
        radio: 'month',
        radioArr: [{ label: "month", content: "按月" }, { label: "year", content: "按年" }],
        startDatePickerArr: [{
          type: "month", vmName: "startMonth", placeholder: "选择日期时间", format: "yyyy 年 MM 月", show(_this) {
            let type = _this.option.radio;
            return type == 'month';
          }
        }, {
          type: "year", vmName: "startYear", placeholder: "选择日期时间", format: "yyyy 年", show(_this) {
            let type = _this.option.radio;
            return type == 'year';
          }
        }],
        endDatePickerArr: [{
          type: "month", vmName: "endMonth", placeholder: "选择日期时间", format: "yyyy 年 MM 月", show(_this) {
            let type = _this.option.radio;
            return type == 'month';
          }
        }, {
          type: "year", vmName: "endYear", placeholder: "选择日期时间", format: "yyyy 年", show(_this) {
            let type = _this.option.radio;
            return type == 'year';
          }
        }],
        startMonth: today.getFullYear() + "/" + (today.getMonth() + 1) + "/01",
        endMonth: today.getFullYear() + "/" + (today.getMonth() + 1) + "/01",
        startYear: today.getFullYear() + '-01',
        endYear: today.getFullYear() + '-01',
      },
      trendObj: {
        leftBotNav: '2',
        leftBotNavArr: [
          { label: "建筑", name: "2", dataName: 'buildingTree', propsName: 'buildProps', exKeysName: 'faultData', nodeKey: "equipementStationId", refName: "buildingTree", checkKey: "faultData" },
          { label: "部门", name: "1", dataName: 'departTree', propsName: 'deptProps', exKeysName: 'faultPart', nodeKey: "departmentId", refName: "departTree", checkKey: "faultPart" }
        ],
        buildingTree: [],
        departTree: [],
        faultData: [],
        faultPart: [],
        buildProps: {
          children: 'childNode',
          label: 'sename'
        },
        deptProps: {
          children: 'childNode',
          label: 'departmentName'
        }
      },
      timeArr: [],
      reportTable: []
    };
  },
  mounted() {
    this.getTreeData();//左侧树形菜单
  },
  methods: {
    //树形导航点击事件;
    handleClick(tab, event) {
      console.log(arguments);
    },
    //获取左侧树形菜单；
    getTreeData() {
      let _self = this;
      this.$$api_energyConsumption_buildingTree({
        data: {
          customerId: this.userid
        },
        fn(data) {
          data && (_self.trendObj.buildingTree = data);
          //设置默认选中节点的数据
          var faultData = [];

          faultData.push(data[0].equipementStationId)

          _self.trendObj.faultData = faultData;

          //渲染页面后，默认第一次获取表格数据
          _self.$nextTick(() => {
            _self.submitSend();
          });
        }
      });
      this.$$api_energyConsumption_deptTree({
        data: {
          customerId: this.userid
        },
        fn(data) {
          data && (_self.trendObj.departTree = data);
          //设置默认选中节点的数据
          var faultPart = [];
          faultPart.push(data[0].departmentId)

          _self.trendObj.faultPart = faultPart;
        }
      });
    },
    //获取建筑物或部门id
    getSiteId() {
      let siteIds = '',
        siteType = this.trendObj.leftBotNav == '1' ? 'departTree' : "buildingTree",
        idName = this.trendObj.leftBotNav == '1' ? 'departmentId' : "equipementStationId";

      this.$refs.treeMenu.$refs[siteType][0].getCheckedNodes().forEach(item => {
        siteIds += (item[idName] + ',');
      });

      siteIds = siteIds.substr(0, siteIds.length - 1);
      return siteIds;
    },
    //获取每个月份的天数；
    mGetDate(year, month) {
      var d = new Date(year, month, 0);
      return d.getDate();
    },
    checkDateType() {
      let _self = this,
        compareDate = new Date(),
        startDate, endDate;
      switch (this.datePickerObj.radio) {
        case "month":
          let _date = new Date(_self.datePickerObj.endMonth);
          if ((transDate(compareDate.getFullYear() + '-' + (compareDate.getMonth() + 1)).defaultMonth)
            == (transDate(_self.datePickerObj.endMonth).defaultMonth)) {
            startDate = transDate(_self.datePickerObj.startMonth).defaultMonth + '-01',
              endDate = transDate().defaultDate;
          } else {
            startDate = transDate(_self.datePickerObj.startMonth).defaultMonth + '-01';
            endDate = transDate(_self.datePickerObj.endMonth).defaultMonth + '-' + _self.mGetDate(_date.getFullYear(), (_date.getMonth() + 1))
          }
          return {
            startDate,
            endDate
          };
        case "year":
          if (compareDate.getFullYear() == transDate(_self.datePickerObj.endYear).defaultYear) {

            startDate = transDate(_self.datePickerObj.startYear).defaultYear + '-01-01';
            endDate = transDate(_self.datePickerObj.endYear).defaultYear + '-' + (compareDate.getMonth() + 1) + '-' + compareDate.getDate();
          } else {

            startDate = transDate(_self.datePickerObj.startYear).defaultYear + '-01-01';
            endDate = transDate(_self.datePickerObj.endYear).defaultYear + '-12-31';
          }
          return {
            startDate,
            endDate
          };
        default:
          break;
      }
    },
    /**
     * 确定按钮函数
     */
    submitSend() {
      let dateObj = this.checkDateType();

      //判断日期选择情况
      if (!dateObj.startDate || !dateObj.endDate) {
        return this.$message({
          duration: '3000',
          message: '请输入完整日期!'
        });
      } else if (dateObj.startDate > dateObj.endDate) {
        return this.$message({
          duration: '3000',
          message: '开始日期不得大于等于结束日期!'
        });
      }

      this.loading = true;

      let _self = this,
        siteIds = this.getSiteId(),
        postObj = {
          belongIds: siteIds,
          belongType: this.trendObj.leftBotNav,
          end: dateObj.endDate,
          start: dateObj.startDate,//转换日期
          type: this.datePickerObj.radio
        };

      //综合报表接口回调函数
      let succFn = (data) => {
        _self.timeArr = [];
        _self.reportTable = [];
        if (data) {
          let times = data[0].baseData;//获取第一位的数组数据
          //遍历数组，获取日期数组，用于生成表格的日期表头
          for (let _time of times) {
            _self.timeArr.push(_time.updateDate);
          }

          //遍历整个返回的data
          for (let _reportObj of data) {
            //生成表格内容数组数据
            let rObj = {
              belongName: _reportObj.belongName,//建筑名称
              eleValueAmountTotal: _reportObj.eleValueAmountTotal,//用电合计
              waterValueAmountTotal: _reportObj.waterValueAmountTotal,//用水合计
              coalValueAmountTotal: _reportObj.coalValueAmountTotal//标准煤合计
            }

            //生成对应日期的用电用水和标准煤数据
            for (let childObj of _reportObj.baseData) {
              rObj['coalValue' + childObj.updateDate] = childObj.coalValue;//标注煤
              rObj['eleValue' + childObj.updateDate] = childObj.eleValue;//用电
              rObj['waterValue' + childObj.updateDate] = childObj.waterValue;//用水
            }

            _self.reportTable.push(rObj);//处理好的数据放入表格绑定的数组内
          }
        }
        _self.loading = false;
      }

      this.$$api_ReportManager_queryStatement({
        data: postObj,
        fn: succFn,
        errFn: () => {
          _self.loading = false;
        }
      });
    },
    //切换水电
    changeWaterEle() {
      this.submitSend();
    },
    //切换部门等
    changePart() {
      this.submitSend();
    },
    //导出报表；    
    exportData() {
      let _self = this,
        siteIds = this.getSiteId(),
        dateObj = this.checkDateType(),
        postObj = {
          belongIds: siteIds,
          belongType: Number(this.trendObj.leftBotNav),
          end: transDate(dateObj.endDate).defaultDate,
          start: transDate(dateObj.startDate).defaultDate,//转换日期
          type: this.datePickerObj.radio
        };
      this.loading = true;
      // window.location.href = `/eff/statement/export?belongIds=${postObj.belongIds}&belongType=${postObj.belongType}&start=${postObj.start}&end=${postObj.end}&type=${postObj.type}`
      this.axios({ // 用axios发送post请求
        method: 'post',
        url: 'statement/export', // 请求地址
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        data: qs.stringify(postObj), // 参数
        responseType: 'arraybuffer' // 表明返回服务器返回的数据类型
      })
        .then((res) => { // 处理返回的文件流
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          let objectUrl = URL.createObjectURL(blob);
          window.location.href = objectUrl;
          this.loading = false;
        }).catch(function (res) { })
    }
  }
}