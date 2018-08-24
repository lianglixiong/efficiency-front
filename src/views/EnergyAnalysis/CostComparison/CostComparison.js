
import echarts from 'echarts'
import { DwDatePicker, TreeMenu } from '@/components'
import { transDate, debounce } from 'utils/'

export default {
  name: 'EnergyAnalysis-CostComparison',
  components: { DwDatePicker, TreeMenu },
  data() {
    let _self = this,
      today = new Date(),
      _month = today.getMonth() + 1,//月
      _year = today.getFullYear(),//年
      _date = today.getDate();//日
    return {
      userid: _self.$store.getters.getUserinfo.customerId,
      loading: false,
      costComparePage: null,
      buildingComparePage: null,
      dateObj: {
        radio: 'date',
        radioArr: [{ label: "date", content: "按天" }, { label: "month", content: "按月" }, { label: "year", content: "按年" }],
        startDatePickerArr: [{
          type: "date", vmName: "startTime", placeholder: "选择日期时间", format: "yyyy 年 MM 月 dd 日", show(_this) {
            let type = _this.option.radio;
            return type == 'date' || !type;
          }
        }, {
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
          type: "date", vmName: "endTime", placeholder: "选择日期时间", format: "yyyy 年 MM 月 dd 日", show(_this) {
            let type = _this.option.radio;
            return type == 'date' || !type;
          }
        }, {
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
        startTime: _year + '/' + _month + '/' + 1,
        endTime: _year + '/' + _month + '/' + _date,
        startMonth: _year + '/' + (_month - 1) + "/01",
        endMonth: _year + '/' + _month + "/01",
        startYear: (_year - 1) + '-01',
        endYear: _year + '-01',
      },
      pageDataObj: {
        leftTopNav: 'ele',
        leftTopNavArr: [{ label: "电", name: "ele" }, { label: "水", name: "water" }],
        leftBotNav: 'building',
        leftBotNavArr: [
          { label: "建筑", name: "building", dataName: 'buildingTree', propsName: 'buildProps', exKeysName: 'faultData', checkKey: "faultData", nodeKey: "equipementStationId", refName: "buildingTree" },
          { label: "部门", name: "dept", dataName: 'departTree', propsName: 'deptProps', exKeysName: 'faultPart', checkKey: "faultPart", nodeKey: "departmentId", refName: "departTree" },
          {
            label: "区域", name: "area", list: [{
              dataName: 'eleAreaTree', propsName: 'areaProps', exKeysName: 'faultAreaEle', checkKey: "faultAreaEle", nodeKey: "id", refName: "eleAreaTree", show(_this) {
                let type = _this.option.leftTopNav;
                return type == "ele";
              }
            }, {
              dataName: 'waterAreaTree', propsName: 'areaProps', exKeysName: 'faultAreaWater', checkKey: "faultAreaWater", nodeKey: "id", refName: "waterAreaTree", show(_this) {
                let type = _this.option.leftTopNav;
                return type == "water";
              }
            }]
          }
        ],
        faultData: [],
        faultPart: [],
        faultAreaEle: [],
        faultAreaWater: [],
        buildingTree: [],
        departTree: [],
        eleAreaTree: [],
        waterAreaTree: [],
        buildProps: {
          children: 'childNode',
          label: 'sename'
        },
        deptProps: {
          children: 'childNode',
          label: 'departmentName'
        },
        areaProps: {
          children: 'childrens',
          label: 'name'
        },
        bulidingIds: [],
        departmentIds: [],
        areaIds: []
      },
      chartInit: true,
      path: "",
      lineChart: null,
      buildingTree: null,
      departTree: null,
      areaTree: null,
      faultData: [],
      faultPart: [],
      faultArea: [],
      eleArea: [],
      waterArea: [],
      buildProps: {
        children: 'childNode',
        label: 'sename'
      },
      deptProps: {
        children: 'childNode',
        label: 'departmentName'
      },
      areaProps: {
        children: 'childrens',
        label: 'name'
      },
      costTable: [],
      buildTable: [],
      costChart: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: [],
        series: []
      },
    };
  },
  watch: {
    path(val, oldval) {
      if (!this.chartInit && val.indexOf("EnergyAnalysis") > -1 && oldval != "") {
        this.$nextTick(() => {
          this.initEcharts();
          this.getData();
        });
      }
    }
  },
  computed: {
    //初始化表格数据
    initTable() {
      if (this.$route.path.indexOf("EnergyAnalysis") > -1 && this.$route.path.indexOf("YearAndMonth") == -1 && this.$route.path.indexOf("Fluence") == -1 && this.path != this.$route.path) {
        this.path = this.$route.path;
      }
      if (this.path == '/EnergyAnalysis/CostComparison') {
        return this.costTable;
      } else if (this.path == '/EnergyAnalysis/BuildingContrast') {
        return this.buildTable;
      }
    },
    position() {
      let positionEnd = this.$route.name;
      return '能耗分析 》 ' + positionEnd;
    }
  },
  mounted() {
    this.getTreeData();//左侧树形菜单

    this.initEcharts();// 基于准备好的dom，初始化echarts实例
  },
  methods: {
    //树形导航点击事件;
    handleClick(tab, event) {
    },
    //初始化chart图表；
    initEcharts() {
      this.lineChart = echarts.init(document.getElementById('lineChart'));
      this.chartInit = false;
      this.lineChart.showLoading();
    },
    //echat生成
    setOption() {
      this.lineChart.clear();
      this.lineChart.setOption(this.costChart);
      this.lineChart.hideLoading();
    },
    //获取左侧树形菜单；
    getTreeData() {
      let _self = this;
      this.$$api_energyConsumption_buildingTree({
        data: {
          customerId: this.userid
        },
        fn(data) {
          if (data) {
            _self.pageDataObj.buildingTree = data;
            //设置默认选中节点的数据
            _self.pageDataObj.faultData = [data[0].equipementStationId];
            _self.$nextTick(() => {
              _self.getData();
            });
          }
        }
      });
      this.$$api_energyConsumption_deptTree({
        data: {
          customerId: this.userid
        },
        fn(data) {
          if (data) {
            _self.pageDataObj.departTree = data;
            //设置默认选中节点的数据
            _self.pageDataObj.faultPart = [data[0].departmentId];
          }
        }
      });
      this.$$api_energyConsumption_efficPointTree({
        data: {
          customerId: this.userid,
          scenesType: 1,
        },
        fn(data) {
          if (data) {
            _self.pageDataObj.eleAreaTree = data;
            _self.pageDataObj.faultAreaEle = [data[0].id];
          }
        }
      });
      this.$$api_energyConsumption_efficPointTree({
        data: {
          customerId: this.userid,
          scenesType: 2,
        },
        fn(data) {
          if (data) {
            _self.pageDataObj.waterAreaTree = data;
            _self.pageDataObj.faultAreaWater = [data[0].id];
          }
        }
      });
    },
    //获取echart表数据
    getData() {
      //获取其他条件
      var compFlag = this.dateObj.radio, startTime = this.dateObj.startTime,
        endTime = this.dateObj.endTime, _self = this,
        stName = compFlag == 'date' ? "startTime" : compFlag == 'month' ? "startMonth" : "startYear",
        etName = compFlag == 'date' ? "endTime" : compFlag == 'month' ? "endMonth" : "endYear",
        defaultName = compFlag == 'date' ? "defaultDate" : compFlag == 'month' ? "defaultMonth" : "defaultYear";

      startTime = transDate(this.dateObj[stName])[defaultName];
      endTime = transDate(this.dateObj[etName])[defaultName];

      //获取id
      let equipementStationIds = this.getBuildId(),
        deptIds = this.getPartId(),
        areaIds = this.getAreaId(),
        parms = {
          customerId: this.userid,
          compFlag: compFlag,
          beginDate: startTime,
          endDate: endTime,
        },
        scenesType = this.pageDataObj.leftTopNav == 'water' ? 2 : 1,
        cell, table, tableInfo, echartsInfo, echartsList, price, modelName, dataChange;

      //处理不同接口,不同变量名  
      if (this.path == '/EnergyAnalysis/CostComparison') {
        let setInfo = () => {
          tableInfo = this.pageDataObj.leftTopNav == 'water' ? 'allWaterCostInfo' : "allEleCostInfo";
          echartsInfo = this.pageDataObj.leftTopNav == 'water' ? 'allWaterCost' : "allEleCost";
          echartsList = this.pageDataObj.leftTopNav == 'water' ? 'waterCost' : "eleCost";
        };

        cell = '元';
        table = 'costTable';
        price = 'price';

        if (this.pageDataObj.leftBotNav == 'area') {
          this.api = this.$$api_energyAnalysis_areaCostCompare;
          tableInfo = 'allCostInfo';
          echartsInfo = 'allCost';
          echartsList = 'areaCost';
          dataChange = 3
        } else if (this.pageDataObj.leftBotNav == 'building') {
          dataChange = 0;
          this.api = this.pageDataObj.leftTopNav == 'water' ? this.$$api_energyAnalysis_buildWaterCost : this.$$api_energyAnalysis_buildEleCost;
          setInfo();
        } else if (this.pageDataObj.leftBotNav == 'dept') {
          dataChange = 1;
          this.api = this.pageDataObj.leftTopNav == 'water' ? this.$$api_energyAnalysis_deptWaterCost : this.$$api_energyAnalysis_deptEleCost;
          setInfo();
        }

      } else {
        let setInfo = () => {
          tableInfo = this.pageDataObj.leftTopNav == 'water' ? 'allWaterInfo' : "allEleInfo";
          echartsInfo = this.pageDataObj.leftTopNav == 'water' ? 'allWaterCount' : "allEleCount";
        };

        cell = 'kWh';
        table = 'buildTable';
        price = 'count';
        echartsList = 'count';

        if (this.pageDataObj.leftBotNav == 'area') {
          this.api = this.$$api_energyAnalysis_areaCountCompare;
          tableInfo = 'allCountInfo';
          echartsInfo = 'allCount';
          echartsList = 'countData';
          dataChange = 4
        } else if (this.pageDataObj.leftBotNav == 'building') {
          setInfo();
          dataChange = this.pageDataObj.leftTopNav == 'water' ? 2 : 0;
          this.api = this.pageDataObj.leftTopNav == 'water' ? this.$$api_energyAnalysis_buildingWater : this.$$api_energyAnalysis_buildEle;
        } else if (this.pageDataObj.leftBotNav == 'dept') {
          setInfo();
          dataChange = this.pageDataObj.leftTopNav == 'water' ? 5 : 1;
          this.api = this.pageDataObj.leftTopNav == 'water' ? this.$$api_energyAnalysis_deptWaterCount : this.$$api_energyAnalysis_deptEleCount;
        }

      }

      //data参数添加对应的id属性
      if (this.pageDataObj.leftBotNav == 'building') {
        parms.equipementStationIds = equipementStationIds;
        modelName = 'parkName';
      } else if (this.pageDataObj.leftBotNav == 'dept') {
        parms.deptIds = deptIds;
        modelName = 'deptName';
      } else {
        parms.areaIds = areaIds;
        parms.scenesType = scenesType;
        modelName = 'name';
      }

      this.costChart.xAxis.data = [];
      this.lineChart.showLoading();
      this.loading = true;

      let dateArr = this.checkDateArr(this.dateObj.radio, parms.beginDate, parms.endDate);

      //请求数据,处理数据
      this.api({
        data: parms,
        fn(data) {
          _self.loading && (_self.loading = false);
          _self.costChart.title = {};
          var tempData = data[tableInfo];
          if (dataChange == 1) {
            //增加属性
            tempData.forEach(item => {
              item['parkName'] = item.deptName;
            });
          } else if (dataChange == 2) {
            tempData.forEach(item => {
              item['parkName'] = item.parkName;
              item['sumEle'] = item.sumWater;
              item['avgEle'] = item.avgWater;
              item['maxEle'] = item.maxWater;
              item['maxDate'] = item.maxDate;
            });
          } else if (dataChange == 3) {
            tempData.forEach(item => {
              item['parkName'] = item.name;
            });
          } else if (dataChange == 4) {
            tempData.forEach(item => {
              item['parkName'] = item.name;
              item['sumEle'] = item.sumCount;
              item['avgEle'] = item.avgCount;
              item['maxEle'] = item.maxCount;
              item['maxDate'] = item.maxDate;
            });
          } else if (dataChange == 5) {
            tempData.forEach(item => {
              item['parkName'] = item.deptName;
              item['sumEle'] = item.sumWater;
              item['avgEle'] = item.avgWater;
              item['maxEle'] = item.maxWater;
              item['maxDate'] = item.maxDate;
            });
          }
          _self[table] = tempData;
          _self.costChart.legend.data = _self.costChart.legend.data.slice(0, 1);
          _self.costChart.legend.data[0] = '温度';
          _self.costChart.series = _self.costChart.series.slice(0, 1);
          data[echartsInfo].forEach((item, i) => {
            _self.costChart.legend.data.push(item[modelName]);
            _self.costChart.series.push({
              name: item[modelName],
              type: 'line',
              data: []
            });

            dateArr.forEach((date, ind) => {
              if (JSON.stringify(item[echartsList]).indexOf(date) == -1) {
                data[echartsInfo][i][echartsList].splice(ind, 0, {
                  date: date,
                  price: null
                });
              }
            });

            item[echartsList].forEach(inData => {
              _self.costChart.series[i + 1].data.push(inData[price] ? (inData[price]).toFixed(2) : inData[price]);
            })
          });

          var dataFlag = data[echartsInfo].every(function (item) {
            return item[echartsList].every(function (val) {
              return val.length > 0;
            })
          })
          //数据全为空数组的处理
          if (dataFlag) {
            _self.errFuntion();
          } else {
            //x轴
            var xList = data[echartsInfo][0][echartsList];
            var xData = []
            xList.forEach(item => {
              xData.push(item.date);
            });

            _self.costChart.yAxis[0] = {
              type: 'value',
              boundaryGap: true,
              name: cell,
              axisLabel: {
                formatter: '{value}'
              },
            };
            _self.costChart.yAxis[1] = {
              type: 'value',
              name: '温度',
              axisLabel: {
                formatter: '{value} °C'
              },
              splitLine: {
                show: false
              }
            };
            xData.length > _self.costChart.xAxis.data && (_self.costChart.xAxis.data = xData);
            _self.setOption();
          }
        }, errFn() {
          _self.errFuntion();
          _self[table] = [];
        }
      });

      let weatherData = {
        city_id: this.$store.getters.getUserinfo.weatherId,
        beginDate: startTime,
        endDate: endTime
      };

      if (this.pageDataObj.radio != "date") {
        weatherData.compFlag = compFlag;
      }

      this.$$api_energyAnalysis_getweather({
        data: weatherData,
        fn(data) {
          let yTemp = [],
            weatherDate = [];
          data.forEach((item) => {
            yTemp.push(item.day_temp ? item.day_temp.replace(/℃/, "") : item.day_temp);
            weatherDate.push(item.weather_date);
          })

          weatherDate.length > _self.costChart.xAxis.data.length && (_self.costChart.xAxis.data = weatherDate);
          _self.costChart.series[0] = {
            name: '温度',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: { color: '#f4e606' }
            },
            lineStyle: {
              normal: { type: 'solid', width: 1.5 }
            },
            yAxisIndex: 1,
            data: []
          }
          _self.costChart.series[0].data = yTemp;
          _self.setOption();
        }
      });
    },
    sureGo() {
      this.getData();
    },
    //切换水电
    changeWaterEle() {
      this.getData();
    },
    //切换部门等
    changePart() {
      this.getData();
    },
    //获取建筑物id
    getBuildId() {
      var equipementStationIds = ''
      this.$refs.treeMenu.$refs.buildingTree[0].getCheckedNodes().forEach(item => {
        equipementStationIds += (item.equipementStationId + ',')
      });
      equipementStationIds = equipementStationIds.substr(0, equipementStationIds.length - 1);
      return equipementStationIds;
    },
    //获取部门id
    getPartId() {
      var deptIds = ''
      this.$refs.treeMenu.$refs.departTree[0].getCheckedNodes().forEach(item => {
        deptIds += (item.departmentId + ',')
      });
      deptIds = deptIds.substr(0, deptIds.length - 1);
      return deptIds;
    },
    //获取区域id
    getAreaId() {
      let areaIds = '',
        areaTreeName = this.pageDataObj.leftTopNav == "ele" ? "eleAreaTree" : "waterAreaTree";

      this.$refs.treeMenu.$refs[areaTreeName][0].getCheckedNodes().forEach(item => {
        areaIds += (item.id + ',')
      });
      areaIds = areaIds.substr(0, areaIds.length - 1);
      return areaIds;
    },
    //请求不成功或没有数据时
    errFuntion() {
      this.lineChart.hideLoading();
      this.loading = false;
      this.costChart.series = [];
      this.costChart.title = {
        text: '暂无数据',
        left: 'center',
        top: 'center',
        textStyle: {
          color: 'red'
        }
      };
      this.setOption();
    },
    checkDateArr(type, startDate, endDate) {
      let dLen = "",
        dArr = [],
        date1 = startDate,
        date2 = endDate,
        i = 0;

      if (type == "year") {

        while (!(date1 + i == date2 + 1)) {
          dArr[i] = date1 + i;
          i++;
        }
        return dArr;
      } else if (type == "month") {
        date1 = new Date(date1.toString());
        date2 = new Date(date2.toString());

        while (!(date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() + 1)) {
          dArr[i] = date1.getFullYear() + "-" + ((date1.getMonth() + 1) < 10 ? ('0' + (date1.getMonth() + 1)) : (date1.getMonth() + 1));
          i++;
          date1.setMonth(date1.getMonth() + 1);
        }
        return dArr;
      } else {
        date1 = new Date(date1.toString());
        date2 = new Date(date2.toString());

        let transDate2 = (_d2) => {
          let _d2GetDate = new Date(_d2.getFullYear(), _d2.getMonth() + 1, 0).getDate(),
            _y = _d2.getFullYear(),
            _m = _d2GetDate < _d2.getDate() + 1 ? _d2.getMonth() + 2 : _d2.getMonth() + 1,
            _d = _d2GetDate < _d2.getDate() + 1 ? 1 : _d2.getDate();

          return _y + '-' + _m + '-' + _d;
        }

        let _td2 = transDate2(date2);

        while (!((date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()) === _td2)) {
          dArr[i] = date1.getFullYear() + "-" + ((date1.getMonth() + 1) < 10 ? ('0' + (date1.getMonth() + 1)) : (date1.getMonth() + 1)) + "-"
            + (date1.getDate() < 10 ? ('0' + (date1.getDate())) : (date1.getDate()));
          i++;
          date1.setDate(date1.getDate() + 1);
        }
        return dArr;

      }
    }
  }
}