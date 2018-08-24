
import echarts from 'echarts'
import { debounce, transDate } from 'utils/'
import { DwDatePicker, TreeMenu } from '@/components'
export default {
    name: 'EnergyAnalysis-YearAndMonth',
    components: {TreeMenu},
    data() {
        let today = new Date(),
            _month = today.getMonth() + 1,//月
            _lastMonth = today.getMonth(),//月
            _year = today.getFullYear(),//年
            _date = today.getDate(),//日;;
            formatMonth = _month<10?'0'+_month:_month,
            formatLastMonth = _lastMonth<10?'0'+_lastMonth:_lastMonth;
        return {
            customerId: this.$store.getters.getUserinfo.customerId,
            path: this.$route.path,
            transDateFn: transDate,
            timeChart: null,
            startTime: _year + '-' + (_month < 10 ? '0' + _month : _month) + '-' + '01',
            endTime: _year + '-' + (_month < 10 ? '0' + _month : _month) + '-' + (_date < 10 ? '0' + _date : _date),
            defaultYear: today.getFullYear() + '',
            defaultMonth: today.getFullYear() + '-' + formatMonth,
            compareYear: today.getFullYear() - 1,
            compareMonth: (today.getFullYear() - 1) + '-' + formatMonth,
            compareLink: today.getFullYear() + '-' + formatLastMonth,
            yearBaseCount: '',
            yearCompareCount: '',
            monthBaseCount: '',
            monthCompareCount: '',
            monthLinkCount: '',
            yearOrMonth: 'month',
            trendObj: {
                leftTopNav: 'elect',
                leftTopNavArr: [{ label: "电", name: "elect" }, { label: "水", name: "water" }],
                leftBotNav: 'building',
                leftBotNavArr: [
                    { label: "建筑", name: "building", dataName: 'buildingTree', propsName: 'defaultProps', exKeysName: 'defaultBuilding', nodeKey: "equipementStationId", refName: "buildingTree" },
                    { label: "部门", name: "dept", dataName: 'departmentTree', propsName: 'deptProps', exKeysName: 'defaultDepartment', nodeKey: "departmentId", refName: "departmentTree" },
                    {
                        label: "区域", name: "area", list: [{
                            dataName: 'eleAreaTree', propsName: 'areaProps', exKeysName: 'defaultAreaEle', nodeKey: "id", refName: "eleAreaTree", show(_this) {
                                let type = _this.option.leftTopNav;
                                return type == "elect";
                            }
                        }, {
                            dataName: 'waterAreaTree', propsName: 'areaProps', exKeysName: 'defaultAreaWater', nodeKey: "id", refName: "waterAreaTree", show(_this) {
                                let type = _this.option.leftTopNav;
                                return type == "water";
                            }
                        }]
                    }
                ],
                buildingId: '',
                departmentId: '',
                areaEleId: '',
                areaWaterId: '',
                defaultBuilding: [],
                defaultDepartment: [],
                defaultAreaEle: [],
                defaultAreaWater: [],
                buildingTree: [],
                departmentTree: [],
                eleAreaTree: [],
                waterAreaTree: [],
                defaultProps: {
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
                }
            },
            buildfirstClick: true,
            deptfirstClick: true,
            areafirstClick: true,
            standardCount: '',
            yoyCount: '',
            linkCount: '',
            yoyTrend: '',
            linkTrend: '',
            setChart: {
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#24AB14', '#335EFF', '#FF8D33', '#f4e606'],
                legend: {
                    data: ['同比', '基准', '环比', '温度']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: [
                    {
                        type: 'value',
                        min: 0
                    },
                    {
                        type: 'value',
                        name: '温度',
                        max: 50,
                        axisLabel: {
                            formatter: '{value} °C'
                        },
                        splitLine: {
                            show: false
                        }
                    },
                ],
                series: [
                    {
                        name: '同比',
                        type: 'line',
                        stack: '总量',
                        areaStyle: { normal: {} },
                        data: []
                    },
                    {
                        name: '基准',
                        type: 'line',
                        stack: '总量',
                        areaStyle: { normal: {} },
                        data: []
                    },
                    {
                        name: '环比',
                        type: 'line',
                        stack: '总量',
                        areaStyle: { normal: {} },
                        data: []
                    }, {
                        name: '温度',
                        type: 'line',
                        yAxisIndex: 1,
                        data: []
                    }]
            }
        };
    },
    mounted() {
        this.initDebounce();
        this.getTreeData();
        // 基于准备好的dom，初始化echarts实例
        this.$nextTick(() => {
            this.initEcharts();
        });
    },
    methods: {
        //树形导航点击事件;
        handleNodeClick(data) {
            if (this.trendObj.leftBotNav == 'dept') {
                this.trendObj.deptfirstClick && this.trendObj.$refs.departTree.$children[0].$el.classList.remove('is-current');
                this.trendObj.departmentId = data.departmentId;
            } else if (this.trendObj.leftBotNav == 'building') {
                this.trendObj.buildfirstClick && this.trendObj.$refs.buildingTree.$children[0].$el.classList.remove('is-current');
                this.trendObj.buildingId = data.equipementStationId;
            } else {
                this.trendObj.areafirstClick && this.trendObj.$refs.areaTree.$children[0].$el.classList.remove('is-current')
                if(this.trendObj.leftTopNav=='elect'){
                    this.trendObj.areaEleId = data.id;
                }else if(this.trendObj.leftTopNav=='water'){
                    this.trendObj.areaWaterId = data.id;
                }
            }
            this.getChartData();
        },
        //比对年的时间选择；
        compareY(val) {
            let newTime = val ? new Date(val) : new Date();
            this.compareYear = newTime.getFullYear() - 1
        },
        //比对月的时间选择；
        compareM(val) {
            let newTime = val ? new Date(val) : new Date();
            let month = newTime.getMonth() + 1,lastmonth =newTime.getMonth(), formatMonth = month<10?'0'+month:month,
            formatLastmonth = lastmonth<10?'0'+lastmonth:lastmonth;
            this.compareMonth = (newTime.getFullYear() - 1) + '-' + formatMonth;
            this.compareLink = newTime.getFullYear() + '-' + formatLastmonth
        },
        //比对年月切换事件;
        compareClick(tab, event) {
            this.standardCount = '';
            this.yoyCount = '';
            this.linkCount = '';
            this.yoyTrend = '';
            this.linkTrend = '';
        },
        //获取左侧树形菜单；
        getTreeData() {
            let _self = this;
            let setId = (type, _data, areaType) => {
                const idtype = type == 'dept' ? 'departmentId' : type == "build" ? 'equipementStationId' : "id",
                    treeName = type == 'dept' ? 'departmentTree' : type == "build" ? 'buildingTree' : areaType == 1 ? "eleAreaTree" : "waterAreaTree",
                    idName = type == 'dept' ? 'departmentId' : type == "build" ? 'buildingId' : areaType == 1 ? "areaEleId" : "areaWaterId",
                    defaultName = type == 'dept' ? 'defaultDepartment' : type == "build" ? 'defaultBuilding' : areaType == 1 ? "defaultAreaEle" : "defaultAreaWater",
                    esId = _data[0][idtype];

                _self.trendObj[treeName] = _data;//树型菜单绑定的data
                _self.trendObj[idName] = esId;//选中id
                _self.trendObj[defaultName].push(esId);//第一项id放入默认选中数组
                _self.$nextTick(() => {
                    //添加选中类名
                    _self.$refs.treeMenu.$refs[treeName][0].$children[0].$el.classList.add('is-current');
                });
            }

            this.$$api_energyConsumption_buildingTree({
                data: {
                    customerId: this.customerId
                },
                fn(data) {

                    if (data) {
                        setId('build', data);
                        _self.getChartData();
                    }
                }
            });
            this.$$api_energyConsumption_deptTree({
                data: {
                    customerId: this.customerId
                },
                fn(data) {
                    // data && (_self.departTree = data);
                    if (data) {
                        setId('dept', data);
                    }
                }
            });
            this.$$api_energyConsumption_efficPointTree({
                data: {
                    customerId: this.customerId,
                    scenesType: 1
                },
                fn(data) {
                    setId('area', data, 1);
                }
            });

            this.$$api_energyConsumption_efficPointTree({
                data: {
                    customerId: this.customerId,
                    scenesType: 2
                },
                fn(data) {
                    setId('area', data, 2);
                }
            });
        },
        //获取每个月份的天数；
        mGetDate(year, month) {
            var d = new Date(year, month, 0);
            return d.getDate();
        },
        /**
         * 去抖
         */
        initDebounce() {
            this.getDataFn = debounce(this.getChartData, 500);
        },
        //获取echart表数据；
        getChartData() {
            this.clearChart();
            let self = this,
                compareDate = new Date(),
                compareMonth = compareDate.getMonth()+1,
                formatCompareMonth =  compareMonth<10?'0'+compareMonth:compareMonth,
                sendData = {
                    customerId: this.customerId,
                },
                reqWeather = {
                    city_id: window.sessionStorage.getItem('cityId')
                };
            if (this.trendObj.leftBotNav == 'dept') {
                sendData.deptIds = this.trendObj.departmentId;
            } else if (this.trendObj.leftBotNav == 'building') {
                sendData.equipementStationIds = this.trendObj.buildingId;
            } else {
                
                if (this.trendObj.leftTopNav == 'elect') {
                    sendData.scenesType = 1;
                    sendData.areaIds = this.trendObj.areaEleId;
                } else {
                    sendData.scenesType = 2;
                    sendData.areaIds = this.trendObj.areaWaterId;
                }
            };
            if (this.yearOrMonth == 'year') {
                sendData.date = this.transDateFn(this.defaultYear).defaultYear;
                sendData.yoyDate = this.compareYear;
                sendData.compFlag = 'month';
                if (compareDate.getFullYear() == this.defaultYear) {
                    reqWeather.compFlag = 'month';
                    reqWeather.beginDate = compareDate.getFullYear() + '-01-01';
                    reqWeather.endDate = this.transDateFn(this.endTime).defaultMonth + '-' + compareDate.getDate();
                } else {
                    reqWeather.compFlag = 'month';
                    reqWeather.beginDate = this.transDateFn(this.defaultYear).defaultYear + '-01-01';
                    reqWeather.endDate = this.transDateFn(this.defaultYear).defaultYear + '-12-31';
                }
            } else {
                let _date = new Date(this.defaultMonth),month = _date.getMonth() + 1,
                formatMonth = month<10?'0'+month:month;
                sendData.date = _date.getFullYear() + '-' + formatMonth;
                sendData.yoyDate = this.compareMonth;
                sendData.chainDate = this.compareLink;
                
                if (compareDate.getFullYear() + '-' + formatCompareMonth == sendData.date) {
                    reqWeather.beginDate = this.startTime;
                    reqWeather.endDate = this.transDateFn(compareDate).defaultDate
                } else {
                    reqWeather.beginDate = this.transDateFn(this.defaultMonth).defaultDate;
                    reqWeather.endDate = this.transDateFn(this.defaultMonth).defaultMonth + '-' + this.mGetDate(_date.getFullYear(), formatMonth)
                }
            }
            //返回数据成功的回调；
            let succFn = data => {
                if(data.chainData!=''&&data.standardData!=''&&data.yoyData!=''){
                    let xData = [],
                        yStandared = [], //基准
                        yYoy = [],       //同比
                        yLink = [],      //环比
                        infoType = "",
                        sumType = "",
                        countType = "",
                        tempYS = '',
                        tempYY = '',
                        tempYL = '';

                    if (self.trendObj.leftTopNav == 'elect') {
                        infoType = 'eleInfo';
                        sumType = 'sumEle';
                        countType = "count";
                    } else {
                        infoType = 'waterInfo';
                        sumType = 'sumWater';
                        countType = 'count';
                    }

                    if (this.trendObj.leftBotNav == 'area') {
                        infoType = 'countInfo';
                        sumType = 'sum';
                        countType = 'count';
                    }

                    tempYS = data.standardData[countType][countType],
                    tempYY = data.yoyData[countType][countType],
                    tempYL = data.chainData[countType] && data.chainData[countType][countType];
                    self.standardCount = data.standardData[infoType][sumType];
                    self.yoyCount = data.yoyData[infoType][sumType];
                    self.yoyTrend = data.yoyTrend;

                    if (self.yearOrMonth == 'year') {
                        yYoy = new Array(12);
                        tempYS.forEach(item => {
                            yStandared.push(item[countType])
                        });

                        tempYY.forEach(item => {
                            let update = Number(item.date.split('-')[1]);
                            yYoy[update-1] = item[countType];
                        });

                        for (let index = 0; index < yYoy.length; index++) {
                            if(yYoy[index] == undefined){
                                yYoy[index] = null;
                            }                           
                        }
                    } else {
                        tempYS.forEach(item => {
                            xData.push(item.date)
                            yStandared.push(item[countType])
                        });
                        tempYY.forEach(item => {
                            yYoy.push(item[countType])
                        });
                        tempYL.forEach(item => {
                            yLink.push(item[countType])
                        });

                        self.linkCount = data.chainData[infoType][sumType];
                        self.linkTrend = data.chainTrend;
                    }
                    if (this.yearOrMonth == 'month') {                       
                        self.setChart.xAxis.data = xData;
                    } else {
                        self.setChart.xAxis.data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    }
                    self.setChart.series[0].data = yYoy;
                    self.setChart.series[1].data = yStandared;
                    self.setChart.series[2].data = yLink;
                    xData.length > self.setChart.xAxis.data && (self.setChart.xAxis.data = xData);
                    self.setOption()
                }else{
                    self.setChart.title = {
                        text: '暂无数据',
                        left: 'center',
                        top: 'center',
                        textStyle: {
                            color: 'red'
                        }
                    };
                    self.setChart.series.data =[{name:'暂无数据！'}]
                }
            }

            this.standardCount = '';
            this.yoyCount = '';
            this.linkCount = '';
            this.linkTrend = '';
            this.yoyTrend = '';
            this.setChart.xAxis.data = [];
            this.setChart.series[0].data = [];
            this.setChart.series[1].data = [];
            this.setChart.series[2].data = [];
            if (this.trendObj.leftBotNav == 'building') {
                if (this.trendObj.leftTopNav == 'elect') {
                    this.$$api_energyAnalysis_buildEleCountHis({
                        data: sendData,
                        fn: succFn
                    });
                } else {
                    this.$$api_energyAnalysis_buildWaterCountHis({
                        data: sendData,
                        fn: succFn
                    });
                }
            } else if (this.trendObj.leftBotNav == 'dept') {
                if (this.trendObj.leftTopNav == 'elect') {
                    this.$$api_energyAnalysis_deptEleCountHis({
                        data: sendData,
                        fn: succFn
                    });
                } else {
                    this.$$api_energyAnalysis_deptWaterCountHis({
                        data: sendData,
                        fn: succFn
                    });
                }
            } else {
                this.$$api_energyAnalysis_areaCountHis({
                    data: sendData,
                    fn: succFn
                });
            }
            
            //增加的显示气温的y轴数据请求 
            self.setChart.series[3].data = [];   
            this.$$api_energyAnalysis_getweather({               
                data: reqWeather,
                fn(data) {
                    let yTemp = [], weatherDate = [];
                    data.forEach((item) => {
                        yTemp.push(item.day_temp?item.day_temp.replace(/℃/,""):item.day_temp);
                        weatherDate.push(item.weather_date);
                    })
                    self.setChart.series[3].data = yTemp;
                    weatherDate.length > self.setChart.xAxis.data.length && (self.setChart.xAxis.data = weatherDate);
                    self.setOption();
                }
            });
        },
        //切换水电
        changeWaterEle() {
            this.getChartData();
        },
        //切换部门等
        changePart() {
            this.getChartData();
        },
        //初始化chart图表；
        initEcharts() {
            this.timeChart = echarts.init(document.getElementById('timeChart'));
            this.timeChart.showLoading();
        },
        clearChart() {
            this.timeChart.clear();
            this.timeChart.showLoading();
        },
        setOption(clear) {
            clear && this.timeChart.clear();
            this.timeChart.setOption(this.setChart);
            this.timeChart.hideLoading();
        },
    }
}