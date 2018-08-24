import echarts from '../../../node_modules/_echarts@3.8.5@echarts'
import { transDate, debounce,getDay } from 'utils/'
import { defaultExt } from 'upath';
// import { promises } from 'fs';
// import LeftTop from "./left-top/left-top.vue";

export default {
  name: 'echarts',
  components: {
    // LeftTop

  },
  data() {
    let _self = this,
      today = new Date(),
      _year = today.getFullYear(),
      _month = (today.getMonth()) + 1,
      _date = today.getDate();
    console.log(_self.$store.getters)
    return {
      chart: {},
      setChartArr: {},
      userid: _self.$store.getters.getUserinfo.customerId,
      cityId: _self.$store.getters.getUserinfo.weatherId,
      startTime: "",
      endTime: "",
      weekStart: getDay(-6),
      monthStart: _year + "/" + _month + "/01",
      endDate: _year + "/" + _month + "/" + _date,
      selectDate: "custom",
      dateType: "custom",
      tabUse: 'electric',
      TrendType: "",
      cellData: {
        preValue: '',
        ratio: '',
        icon: '',
        bgc: ''
      },
      month: _month,//日历 月
      year: new Date().getFullYear(),//日历 年
      date: _date,//日历 日
      calendarData: {},//用能日历
      trendCap: {},//用能趋势
      totalData: {
        acreage: '',
        totalAmount: '',
        totalEle: '',
        totalWater: ''
      },
      itCalendarData: 0,
      gtCalendarData: 0,
      etCalendarData: 0,
      lastMonthData: {},
      echartsClear: {},
      barOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          show: false,
          top: '15%',
          bottom: '14%',
          left: '6%',
          right: '5%'
        },
        legend: {
          data: [
            // '用电用水量柱状图', '用电用水量折线图' 
            '温度'
          ],
          color:'yellow'
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: [{
          type: 'value',
          name: '电量',
          axisLabel: {
            formatter: '{value}'
          }
        }, {
          type: "value",
          name: "温度",
          axisLabel: {
            formatter: '{value} °C'
          },
          splitLine: {
            show: false
          }

        }],
        series: [
          {
            name: '用电用水量柱状图',
            type: 'bar',
            itemStyle: {
              normal: { color: '#4996f3' }
            },
            data: []
          },
          // {
          //   name: '用电用水量折线图',
          //   type: 'line',
          //   itemStyle: {
          //     normal: { color: '#221ece' }
          //   },
          //   lineStyle: {
          //     normal: { type: 'dashed', width: 1 }
          //   },
          //   data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          // },
          {
            name: '温度量折线图',
            type: 'line',
            symbolSize: 6,
            itemStyle: {
              normal: { color: '#f4e606' }
            },
            lineStyle: {
              normal: { type: 'solid', width: 1.5 }
            },
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      gaugOption: {
        tooltip: {
          show: false
        },
        title: [{
          text: '单位面积用电',
          left: 'center',
          textStyle: {
            fontSize: '15',
            fontWeight: 'bold',
          },
          top: '5%'
        },
        ],
        series: {
          type: 'gauge',
          min: 0,
          max: '',
          data: {value:''},
          radius: '65%',
          splitNumber: 6,
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 15,
              color: []
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: 10
            },
            formatter: function (value) {
              if (value != parseInt(value)) {
                return value.toFixed(2)
              } else {
                return value;
              }
            }
          },
          detail: { fontSize: 18, offsetCenter: ['0', '60'] },
          splitLine: {           // 分隔线
            length: 20,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              color: 'auto'
            }
          },
        }
      },
      pieOption: {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          // orient: 'vertical',
          bottom: '5',
          data: ['电能耗', '水能耗']
        },
        title: [{
          text: '上月综合能耗组成',
          left: 'center',
          textStyle: {
            fontSize: '15',
            fontWeight: 'bold',
          },
          top: '5%'
        }],
        series: {
          name: '能耗占比',
          type: 'pie',
          radius: ['45%', '60%'],
          center: ['50%', '50%'],
          data: [
            { value: 10, name: '电能耗', itemStyle: { normal: { color: '#57dd9d' } } },
            { value: 5, name: '水能耗', itemStyle: { normal: { color: '#f78383' } } },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
        }
      },
      calendarOption: {
        tooltip: {
          formatter: function (params) {
            return params.value[1].toFixed(2);
          }
        },
        calendar: {
          top: 0,
          left: 'center',
          bottom: 5,
          orient: 'vertical',
          cellSize: '',
          yearLabel: {
            show: false,
            textStyle: {
              fontSize: 30
            }
          },
          dayLabel: {
            firstDay: 1,
            nameMap: 'cn'
          },
          monthLabel: {
            show: false
          },
          range: '',
          splitLine: {
            show: false
          },
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: 4
            }

          }
        },
        series: [{
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 1,
          itemStyle: {
            normal: {
              color: '#d2d2d2'
            }
          },
          label: {
            normal: {
              show: true,
              formatter: function (params) {
                var d = params.value[0];
                return d.getDate;
              },
              textStyle: {
                color: '#fff'
              }
            }
          },
          data: []
        }, {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: []
        }
        ]
      }
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.setChartHeight([
      { name: "chartColumn", type: "bar" },
      { name: "chartGauge", type: "gauge" },
      { name: "chartPie", type: "pie" },
      { name: "chartCalendar", type: "calendar" }]);
    //初始化时间

    this.startTime = getDay(-30);
    this.endTime = getDay(0);

    this.$nextTick(() => {
      this.initEcharts();
      this.getTerndCap();//设置耗能趋势
      this.getCalendarCap(transDate(this.endDate).defaultDate);//设置日历配置
      this.getTotalData();//获取总数据
      this.getAreaAvgEle();//获取单位面积用电
      this.getLastMonthData(); //获取上月总量
      this.getColligateCap();//获取上月总能耗
    });

  },
  computed: {

  },
  methods: {
    changDate(type) {
      if (type == 'prev') {
        if (this.month > 1) {
          this.month = this.month - 1
        } else {
          this.month = '12';
          this.year--;
        }
      } else if (type == 'next') {
        if (this.month < 12) {
          this.month = +this.month + 1
        } else {
          this.month = '1';
          this.year++;
        }
      }

      // this.calendarOption.calendar.range = this.year + "-" + this.month;
      this.getCalendarCap(this.year + "-" + this.month + '-01');
    },
    /**
     * 设置echarts节点高度，ininArr为节点数据数组
     * @param {Array} initArr 
     */
    setChartHeight(initArr) {
      for (const val of initArr) {
        !this.setChartArr[val.name] && (this.setChartArr[val.name] = { type: val.type });
        document.getElementById(val.name).style.height = document.getElementById(val.name).parentNode.clientHeight + 'px';
      }
    },
    /**
     * 初始化echart
     */
    initEcharts() {
      for (let _key in this.setChartArr) {
        this.chart[_key] = echarts.init(document.getElementById(_key));
      }
    },
    /**
     * 设置图标配置
     * @param {String} id 
     */
    setChart(id, date) {
      this.chart[id].clear();
      this.chart[id].setOption(this.chartType({ type: this.setChartArr[id].type, name: id, date }));
      return this.chart[id];
    },
    getTerndCap(submit) {
      this.$nextTick(() => {
        if (this.TrendType != this.tabUse || submit || (this.dateType != this.selectDate && this.selectDate != "custom")) {
          let startTime = "",
            endTime = "";

          if (this.selectDate == "week") {
            startTime = this.weekStart;
            endTime = this.endDate;
          } else if (this.selectDate == "month") {
            startTime = this.monthStart;
            endTime = this.endDate;
          } else {
            startTime = this.startTime;
            endTime = this.endTime;
          }

          this.dateType = this.selectDate;
          this.TrendType = this.tabUse;
          let _self = this;
          endTime = transDate(endTime).defaultDate;
          startTime = transDate(startTime).defaultDate;
          this.chart['chartColumn'].showLoading();

          switch (this.tabUse) {
            case "water":
              this.$$api_homeIndex_waterTrendCap({
                data: {
                  customerId: this.userid,
                  beginDate: startTime,
                  endDate: endTime
                },
                fn(data) {
                  if (data.waterEnergys && data.waterEnergys.length > 0) {
                    var xData = [];
                    var yData = [];
                    var temp = data.waterEnergys;
                    temp.forEach(item => {
                      xData.push(item.date)
                    });
                    temp.forEach(item => {
                      yData.push(item.waterEnergy)
                    });
                    _self.barOption.xAxis.data = xData;
                    _self.barOption.series[0].data = yData;
                    _self.barOption.yAxis[0].name = '水量: t';
                    // var total = ['用水量柱状图', '用水量折线图']
                    // var legend = {data:total};
                    _self.barOption.title = {};
                    _self.barOption.series[0].name = '用水量(柱状图)';
                    _self.barOption.series[1].name = '温度(折线图)';
                    _self.barOption.legend.data = [];
                    _self.barOption.legend.data.push(['用水量柱状图', '温度折线图']);

                  } else {
                    _self.barOption.title = {
                      text: '暂无数据',
                      left: 'center',
                      top: 'center',
                      textStyle: {
                        color: 'red'
                      }
                    };
                    //清空option
                    _self.barOption.series.forEach(item => {
                      item.data = [];
                    });
                  }
                  _self.setChart("chartColumn");
                  _self.chart['chartColumn'].hideLoading();
                }, errFn() {
                  _self.barOption.title = {
                    text: '暂无数据',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                      color: 'red'
                    }
                  };
                  //清空option
                  _self.barOption.series.forEach(item => {
                    item.data = [];
                  });
                  _self.setChart("chartColumn");
                  _self.chart['chartColumn'].hideLoading();
                }
              });
              break;
            case "electric":
              this.$$api_homeIndex_eleTrendCap({
                data: {
                  customerId: this.userid,
                  beginDate: startTime,
                  endDate: endTime
                },
                fn(data) {
                  if (data.eleEnergys && data.eleEnergys.length > 0) {
                    var xData = [];
                    var yData = [];
                    var temp = data.eleEnergys;
                    temp.forEach(item => {
                      xData.push(item.date)
                    });
                    temp.forEach(item => {
                      yData.push(item.eleEnergy)
                    });
                    _self.barOption.xAxis.data = xData;
                    _self.barOption.series[0].data = yData;

                    _self.barOption.yAxis[0].name = '电量: kWh';
                    _self.barOption.series[0].name = '用电量(柱状图)';
                    _self.barOption.series[1].name = '温度(折线图)';
                    _self.barOption.legend.data = [];
                    _self.barOption.title = {};
                    _self.barOption.legend.data.push(['用电量柱状图', '温度折线图']);
                  } else {
                    _self.barOption.title = {
                      text: '暂无数据',
                      left: 'center',
                      top: 'center',
                      textStyle: {
                        color: 'red'
                      }
                    };
                    //清空option
                    _self.barOption.series.forEach(item => {
                      item.data = [];
                    });
                  }
                  // xData.length > _self.barOption.xAxis.data && (_self.barOption.xAxis.data = xData);
                  _self.setChart("chartColumn");
                  _self.chart['chartColumn'].hideLoading();
                }, errFn() {
                  _self.barOption.title = {
                    text: '暂无数据',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                      color: 'red'
                    }
                  };
                  //清空option
                  _self.barOption.series.forEach(item => {
                    item.data = [];
                  });
                  _self.setChart("chartColumn");
                  _self.chart['chartColumn'].hideLoading();
                }

              });
              break;
          }

          let reqWeather = {
            city_id: this.cityId,
            beginDate: startTime,
            endDate: endTime
          };
          _self.$$api_energyAnalysis_getweather({
            data: reqWeather,
            fn(data) {
              let yTemp = [],
              weatherDate = [];
              data.forEach((item) => {
                yTemp.push(item.day_temp ? item.day_temp.replace(/℃/, "") : item.day_temp);
                weatherDate.push(item.weather_date);
              })
              _self.barOption.series[1].data = yTemp;
              weatherDate.length > _self.barOption.xAxis.data.length && (_self.barOption.xAxis.data = weatherDate);
              _self.setChart("chartColumn");
              _self.chart['chartColumn'].hideLoading();
            }
          });
        }
      });
    },
    getCalendarCap(date) {
      this.chart['chartCalendar'].showLoading();
      let _self = this;
      this.$$api_homeIndex_calendarCap({
        data: {
          customerId: this.userid,
          date: date
        },
        fn(data) {
          if (data.eqAvgDate.length > 0 || data.gtAvgDate > 0 || data.ltAvgDate.length > 0) {
            _self.calendarData = data;
            _self.calendarOption.title = {};
            let chartObj = _self.setChart("chartCalendar", date);
            let bdata = chartObj.getOption().series[1].data;
            let eqAvgDate = data.eqAvgDate
            let gtAvgDate = data.gtAvgDate
            let ltAvgDate = data.ltAvgDate
            let adata = []
            eqAvgDate.forEach((item, index) => {
              item.range = 'eq'
              adata.push(item)
            })
            gtAvgDate.forEach((item, index) => {
              item.range = 'gt'
              adata.push(item)
            })
            ltAvgDate.forEach((item, index) => {
              item.range = 'lt'
              adata.push(item)
            })
            for (let i = 0; i < bdata.length; i++) {
              let time1 = bdata[i].value[0];
              for (let j = 0; j < adata.length; j++) {
                let time2 = adata[j].date;
                if (time1 == time2) {
                  let range = adata[j].range;
                  // bdata[i].textStyle.color = '#fff';
                  if (range == 'eq') {
                    bdata[i].itemStyle.normal.color = '#f1c15b';
                  } else if (range == 'gt') {
                    bdata[i].itemStyle.normal.color = '#e65758';
                  } else if (range == 'lt') {
                    bdata[i].itemStyle.normal.color = '#4bcc68'
                  }
                  bdata[i].value[1] = adata[j].totalAmount;
                  break;
                }
              }
            }
            let option = chartObj.getOption();
            option.series[1].data = bdata;
            chartObj.setOption(option);
            _self.chart['chartCalendar'].hideLoading();
            _self.itCalendarData = data.ltAvgDate.length;
            _self.gtCalendarData = data.gtAvgDate.length;
            _self.etCalendarData = data.evAvgDate.length;
          } else {
            _self.chart['chartCalendar'].hideLoading();
            _self.calendarOption.title = {
              text: '暂无数据',
              left: 'center',
              top: 'center',
              textStyle: {
                color: 'red'
              }
            };
            _self.setChart("chartCalendar");
          }

        },
        errFn() {
          _self.chart['chartCalendar'].hideLoading();
          _self.calendarOption.title = {
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: {
              color: 'red'
            }
          };
          _self.setChart("chartCalendar");
        }
      })
    },
    /**
     * 生成日历数组
     * @param {String} setdate 
     */
    getVirtulData(setdate) {
      let newdate = setdate ? new Date(setdate) : new Date(),
        year = newdate.getFullYear(),
        month = newdate.getMonth() + 1;
      var date = +echarts.number.parseDate(year + '-' + (month < 10 ? "0" : "") + month + '-01');
      var end = +echarts.number.parseDate(year + '-' + (month + 1 < 10 ? "0" : "") + (month + 1) + '-01');
      var dayTime = 3600 * 24 * 1000;
      var returnData = {}, heatmapData = [], scatterData = [];
      var _ec = echarts
      let count = 0;
      for (var time = date; time < end; time += dayTime) {
        var obj = {};
        obj.value = [_ec.format.formatTime('yyyy-MM-dd', time), 0]
        var itemStyle = { normal: {} };
        // itemStyle.normal.color = '#edf4f1';
        itemStyle.normal.color = '#d2d2d2';
        obj.itemStyle = itemStyle;

        scatterData.push([_ec.format.formatTime('yyyy-MM-dd', time), ++count]);
        heatmapData.push(obj);
      }
      returnData.scatterData = scatterData;
      returnData.heatmapData = heatmapData;
      return returnData;
    },
    /**
     *判断图表类型，返回对应的配置对象
     * @param {String} type 图表类型
     * @param {String} name 图表id
     */
    chartType(_obj) {
      switch (_obj.type) {
        case 'bar':
          return this.barOption;
        case 'gauge':
          return this.gaugOption;
        case 'pie':
          return this.pieOption;
        case 'calendar':
          let returnData = this.getVirtulData(_obj.date),
            chartHeight = document.getElementById(_obj.name).parentNode.clientHeight,
            chartWidth = document.getElementById(_obj.name).parentNode.clientWidth,
            cellSize = [chartWidth / 7.2, chartHeight / 5];
          this.calendarOption.calendar.top = cellSize[1];
          this.calendarOption.calendar.cellSize = cellSize;
          this.calendarOption.calendar.range = this.year + "-" + this.month;
          this.calendarOption.series[0].data = returnData.scatterData;
          this.calendarOption.series[1].data = returnData.heatmapData;
          // console.log(JSON.stringify(this.calendarOption)) 
          return this.calendarOption;
      }
    },
    //获取总数据
    getTotalData() {
      let _self = this;
      this.$$api_homeIndex_totalData({
        data: {
          customerId: this.userid,
        },
        fn(data) {
          _self.totalData = data;
        }
      })
    },
    //获取单位面积用电
    getAreaAvgEle() {
      this.chart['chartGauge'].showLoading();
      let _self = this;
      this.$$api_homeIndex_areaAvgEle({
        data: {
          customerId: this.userid,
        },
        fn(data) {
          _self.chart['chartGauge'].hideLoading();
          _self.cellData.preValue = data.preValue;
          _self.cellData.ratio = data.ratio;
          if (data.ratio < 0) {
            _self.cellData.icon = 'iconfont icon-down';
            _self.cellData.bgc = 'blue';
          } else {
            _self.cellData.icon = 'iconfont icon-up';
            _self.cellData.bgc = 'red';
          }
          if(data.curValue==0){
            _self.gaugOption.series.data.value = 0;
            _self.gaugOption.title[1] = {};
            _self.gaugOption.series.max = 3; //最大值
            _self.gaugOption.series.axisLine.lineStyle.color = [
              [0.3,'#4bcc68'],
              [0.6,'#f1c15b'],
              [1, '#e65758']
            ]
          }else{
            _self.gaugOption.series.data.value = data.curValue;
            _self.gaugOption.title[1] = {};
            _self.gaugOption.series.max = data.maxValue; //最大值
            _self.gaugOption.series.axisLine.lineStyle.color = [
              [data.normalValue / data.maxValue,'#4bcc68'],
              [data.warnValue / data.maxValue,'#f1c15b'],
              [1, '#e65758']
            ]
          }
          _self.setChart("chartGauge");
        }, errFn() {
          _self.chart['chartGauge'].hideLoading();
          _self.gaugOption.title[1]={
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: {
              color: 'red'
            }
          };
          _self.setChart("chartGauge");
        }
      })
    },
    //获取上月总量
    getLastMonthData() {
      let _self = this;
      this.$$api_homeIndex_lastMonthData({
        data: {
          customerId: this.userid,
        },
        fn(data) {
          _self.lastMonthData = data;
        }
      })
    },
    //获取上月总能耗
    getColligateCap() {
      this.chart['chartPie'].showLoading();
      let _self = this;
      this.$$api_homeIndex_colligateCap({
        data: {
          customerId: this.userid,
        },
        fn(data) {
          _self.pieOption.series.data[0].value = data.eleEnergyValue;
          _self.pieOption.series.data[1].value = data.waterEnergyValue;
          _self.pieOption.title[1] = {}
          _self.setChart("chartPie");
          _self.chart['chartPie'].hideLoading();
        }, errFn() {
          _self.chart['chartPie'].hideLoading();
          _self.pieOption.title.push({
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: {
              color: 'red'
            }
          });
          _self.setChart("chartPie");
        }
      })
    }
  }
}
