
import echarts from 'echarts'
import { DwDatePicker, TreeMenu } from '@/components'
import { transDate, debounce } from 'utils/'

export default {
    name: 'EnergyConsumption-itemStatistics',
    components: { DwDatePicker, TreeMenu },
    data() {
        let _self = this,
            today = new Date(),
            _month = today.getMonth() + 1,//月
            _year = today.getFullYear(),//年
            _date = today.getDate();//日;
        return {
            transDateFn: transDate,
            customerId: _self.$store.getters.getUserinfo.customerId,
            pickerState: '',
            loading: false,
            dateObject: {
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
                startTime: _year + '/' + _month + '/01',
                endTime: _year + '/' + _month + '/' + _date,
                startMonth: _year + '/' + (_month - 1) + '/01',
                endMonth: _year + '/' + _month + '/01',
                startYear: (_year - 1) + '-01',
                endYear: _year + '-12',
            },
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
            chartInit: true,
            waterSeriesArr: {
                updateDate: [],
                coalAmount: [],
                waterYield: []
            },
            electSeriesArr: {
                updateDate: [],
                activePowerAmount: [],
                co2Amount: [],
                reactivePowerAmount: []
            },
            path: "",
            lineAndBar: null,
            buildfirstClick: true,
            deptfirstClick: true,
            areaElectfirstClick: true,
            areaWaterfirstClick: true,
            waterLine: {
                grid: {
                    left: '6%',
                    right: '6%',
                    bottom: "15%"
                },
                title: {
                    text: '',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#666'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                legend: {
                    top: 10,
                    left: 'center',
                    data: ['标准煤', '用水量']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '水量(t)',
                        min: 0,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '标准煤(kgce)',
                        min: 0,
                        axisLabel: {
                            formatter: '{value}'
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '用水量',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#74beff'
                            }
                        },
                        data: []
                    },
                    {
                        name: '标准煤',
                        type: 'line',
                        itemStyle: {
                            // 普通样式。
                            normal: {
                                // 点的颜色。
                                color: '#27a748'
                            },
                        },
                        symbol: "circle",
                        symbolSize: 6,
                        lineStyle: {
                            normal: {
                                width: 1.2,
                                color: '#27a748',
                                type: 'dashed'
                            }
                        },
                        yAxisIndex: 1,
                        data: []
                    }
                ]
            },
            electricLine: {
                grid: {
                    left: '7%',
                    right: '7.5%',
                    bottom: "15%"
                },
                title: {
                    text: '',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#666'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                legend: {
                    top: 10,
                    left: 'center',
                    data: ['碳排放量', '有功用电量', '无功用电量']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '电量(kWh)',
                        min: 0,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '碳排放量(kg)',
                        min: 0,
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '碳排放量',
                        type: 'line',
                        itemStyle: {
                            // 普通样式。
                            normal: {
                                // 点的颜色。
                                color: '#27a748'
                            },
                        },
                        symbol: "circle",
                        symbolSize: 6,
                        lineStyle: {
                            normal: {
                                width: 1.5,
                                color: '#27a748',
                                type: 'dashed'
                            }
                        },
                        yAxisIndex: 1,
                        data: []
                    },
                    {
                        name: '有功用电量',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#74beff'
                            }
                        },
                        data: []
                    },
                    {
                        name: '无功用电量',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#f78383'
                            }
                        },
                        data: []
                    }
                ]
            },
            initWaterTableCol: [{
                target: '用水量(单位:t)',
                total: '暂无数据',
                avg: '暂无数据',
                max: '暂无数据',
                maxdate: '暂无数据',
                type: 'water'
            }, {
                target: '标准煤(单位:kgce)',
                total: '暂无数据',
                avg: '暂无数据',
                max: '暂无数据',
                maxdate: '暂无数据',
                type: 'coal'
            }],
            waterTableCol: [],
            initElectricTableCol: [{
                target: '用电量(单位:kWh)',
                total: '暂无数据',
                avg: '暂无数据',
                max: '暂无数据',
                maxdate: '暂无数据',
                type: 'active'
            }, {
                target: '碳排放量(单位:kg)',
                total: '暂无数据',
                avg: '暂无数据',
                max: '暂无数据',
                maxdate: '暂无数据',
                type: 'co2'
            }, {
                target: '单位建筑面积用电量(单位:kWh/㎡)',
                total: '暂无数据',
                avg: '暂无数据',
                max: '暂无数据',
                maxdate: '暂无数据',
                type: 'unit'
            }],
            electricTableCol: []
        }
    },
    watch: {
    },
    computed: {
    },
    created() {
        this.clearChart();
    },
    mounted() {
        this.initDebounce();
        this.setTreeData();//获取树型菜单数据

        this.$nextTick(() => {
            // 基于准备好的dom，初始化echarts实例
            this.initEcharts();
        });
    },
    methods: {
        setTreeData() {
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
                        _self.getTrendData();//获取统计数据
                    }
                }
            });

            this.$$api_energyConsumption_deptTree({
                data: {
                    customerId: this.customerId
                },
                fn(data) {
                    setId('dept', data);
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
        initDebounce() {
            this.getTrendData = debounce(this.iniGetTrendData, 1000);
        },
        getTrendData() {

        },
        checkDateType() {
            let _self = this;
            let monthDate = this.getCountDays(this.transDateFn(_self.dateObject.endMonth).defaultDate)
            switch (this.dateObject.radio) {
                case "date":
                    return {
                        startDate: this.transDateFn(_self.dateObject.startTime).defaultDate,
                        endDate: this.transDateFn(_self.dateObject.endTime).defaultDate
                    };
                case "month":
                    return {
                        startDate: this.transDateFn(_self.dateObject.startMonth).defaultDate,
                        endDate: this.transDateFn(_self.dateObject.endMonth).defaultMonth + '-' + monthDate
                    };
                case "year":
                    return {
                        startDate: this.transDateFn(_self.dateObject.startYear).defaultDate,
                        endDate: this.transDateFn(_self.dateObject.endYear).defaultYear + '-12-31'
                    };

                default:
                    break;
            }
        },
        iniGetTrendData() {
            let dateType = this.checkDateType();

            if (!dateType.startDate || !dateType.endDate) {
                return this.$message({
                    duration: '2000',
                    message: '请输入完整日期!'
                });
            } else if (this.dateObject.radio != 'year' && dateType.startDate == dateType.endDate) {
                return this.$message({
                    duration: '3000',
                    message: '除按年外，开始日期和结束日期不能相同!'
                });
            } else if (dateType.startDate > dateType.endDate) {
                return this.$message({
                    duration: '3000',
                    message: '开始日期不得大于结束日期!'
                });
            }

            this.clearChart();
            this.loading = true;

            let _self = this,
                _type = this.dateObject.radio,
                statisticsData = {
                    mode: this.trendObj.leftBotNav,
                    type: _type == 'date' ? 'day' : _type,
                    start: dateType.startDate,
                    end: dateType.endDate
                },
                optionName = this.trendObj.leftTopNav == 'elect' ? 'electricLine' : 'waterLine',
                tableName = this.trendObj.leftTopNav == 'elect' ? 'electricTableCol' : 'waterTableCol',
                initTableName = this.trendObj.leftTopNav == 'elect' ? 'initElectricTableCol' : 'initWaterTableCol',
                seriesName = this.trendObj.leftTopNav == 'elect' ? 'electSeriesArr' : 'waterSeriesArr',
                dateName = this.trendObj.leftTopNav == 'elect' ? 'updateDate' : 'recordDate';

            let initFn = () => {
                _self[optionName].title = {
                    text: '暂无数据',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        color: 'red'
                    }
                };

                _self[optionName].xAxis[0].data = [];

                for (let i = 0, len = _self[optionName].series.length; i < len; i++) {
                    _self[optionName].series[i].data = [];
                }

                _self.setOption();
                _self[tableName] = JSON.parse(JSON.stringify(_self[initTableName]));
            }

            let succFn = data => {
                if (data) {
                    _self[tableName] = JSON.parse(JSON.stringify(_self[initTableName]));

                    for (let _val of _self[tableName]) {
                        let dataType = _val.type;
                        let td = data.tableData[dataType];

                        for (let _key in _val) {
                            td[_key] && (_val[_key] = td[_key]);
                        }
                    }

                    for (let _ind = 0, leng = data.histogramData.length; _ind < leng; _ind++) {
                        let _histogram = data.histogramData[_ind];

                        for (let _key_ in _histogram) {
                            if (_ind == 0) {
                                _self[seriesName][_key_] = [];
                            }
                            _self[seriesName][_key_].push(_histogram[_key_]);
                        }
                    }

                    _self[optionName].title.text = '';
                    _self[optionName].xAxis[0].data = _self[seriesName][dateName];

                    if (_self.trendObj.leftTopNav == 'elect') {
                        _self[optionName].series[0].data = _self[seriesName].co2Amount;
                        _self[optionName].series[1].data = _self[seriesName].activePowerAmount;
                        _self[optionName].series[2].data = _self[seriesName].reactivePowerAmount;
                    } else {
                        _self[optionName].series[0].data = _self[seriesName].waterYield;
                        _self[optionName].series[1].data = _self[seriesName].coalAmount;
                    }

                    _self.setOption();
                } else {
                    initFn();
                }
                _self.loading = false;
            };

            if (this.trendObj.leftBotNav == 'dept') {
                statisticsData.departmentId = this.trendObj.departmentId;
            } else if (this.trendObj.leftBotNav == 'building') {
                statisticsData.buildingId = this.trendObj.buildingId;
            } else if (this.trendObj.leftBotNav == 'area'&&this.trendObj.leftTopNav=='elect') {
                statisticsData.areaId = this.trendObj.areaEleId;
            }else if(this.trendObj.leftBotNav == 'area'&&this.trendObj.leftTopNav=='water'){
                statisticsData.areaId = this.trendObj.areaWaterId;
            }

            if (this.trendObj.leftTopNav == 'elect') {
                this.$$api_energyConsumption_deptBuildingElec({
                    data: statisticsData,
                    fn: succFn,
                    errFn() {
                        initFn();
                        _self.loading = false;
                    }
                });
            } else {
                this.$$api_energyConsumption_deptBuildingWater({
                    data: statisticsData,
                    fn: succFn,
                    errFn() {
                        initFn();
                        _self.loading = false;
                    }
                });
            }
        },
        //树形导航点击事件;
        handleNodeClick(data) {
            // const idtype = this.trendObj.leftBotNav == 'dept' ? 'departmentId' : this.trendObj.leftBotNav == "building" ? 'equipementStationId' : "id",
            //     treeName = this.trendObj.leftBotNav == 'dept' ? 'departmentTree' : this.trendObj.leftBotNav == "building" ? 'buildingTree' : this.trendObj.leftTopNav == 'elect' ? "eleAreaTree" : "waterAreaTree",
            //     idName = this.trendObj.leftBotNav == 'dept' ? 'departmentId' : this.trendObj.leftBotNav == "building" ? 'buildingId' : "areaId",
            //     clickType = this.trendObj.leftBotNav == 'dept' ? 'deptfirstClick' : this.trendObj.leftBotNav == "building" ? 'buildfirstClick' : this.trendObj.leftTopNav == 'elect' ? "areaElectfirstClick" : "areaWaterfirstClick";

            // if (this[clickType]) {
            //     this[clickType] = false;
            //     this.$refs.treeMenu.$refs[treeName][0].$children[0].$el.classList.remove('is-current');
            //     this.trendObj[idName] = data[idtype];
            // }
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

            this.getTrendData();

        },
        //初始化chart图表；
        initEcharts() {
            this.lineAndBar = echarts.init(document.getElementById('lineAndBar'));
            this.lineAndBar.showLoading();
            this.chartInit = false;
        },
        clearChart() {
            this.lineAndBar && this.lineAndBar.clear();
            this.lineAndBar && this.lineAndBar.showLoading();
        },
        setOption(clear) {
            clear && this.clearChart();
            this.lineAndBar.setOption(this.setChart());
            this.lineAndBar.hideLoading();
        },
        setChart() {
            switch (this.trendObj.leftTopNav) {
                case 'water':
                    return this.waterLine;
                case 'elect':
                    return this.electricLine;
            }
        },
        //获取天数
        getCountDays(date) {
            var curDate = new Date(date);
            /* 获取当前月份 */
            var curMonth = curDate.getMonth();
            /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
            curDate.setMonth(curMonth + 1);
            /* 将日期设置为0 */
            curDate.setDate(0);
            /* 返回当月的天数 */
            return curDate.getDate();
        },
        //切换水电
        changeWaterEle() {
            this.iniGetTrendData();
        },
        //切换部门等
        changePart() {
            this.iniGetTrendData();
        },
        noOption() {
            this.lineAndBar.hideLoading();
        }
    },
}