
import echarts from '../../../../node_modules/_echarts@3.8.5@echarts'
import { transDate, debounce,getDay } from 'utils/'
import { TreeMenu } from '@/components'

export default {
    name: 'EnergyConsumption-itemStatistics',
    components: { TreeMenu },
    data() {
        let _self = this,
            today = new Date(),
            month = today.getMonth() + 1,//月
            year = today.getFullYear(),//年
            date = today.getDate();//日
        return {
            transDateFn: transDate,
            customerId: _self.$store.getters.getUserinfo.customerId,
            radio: 'month',
            dateObject: {
                customStart: year + '/' + month + '/01',
                customEnd: year + '/' + month + '/' + date,
                startMonth: year + '-' + month + '-01',
                startWeek: getDay(-6),
                endTime: year + '-' + month + '-' + date,
            },

            trendObj: {
                leftBotNav: 'building',
                leftBotNavArr: [
                    { label: "建筑", name: "building", dataName: 'buildingTree', propsName: 'defaultProps', exKeysName: 'defaultBuilding', nodeKey: "equipementStationId", refName: "buildingTree" },
                    { label: "部门", name: "dept", dataName: 'departmentTree', propsName: 'deptProps', exKeysName: 'defaultDepartment', nodeKey: "departmentId", refName: "departmentTree" }
                ],
                buildingId: '',
                departmentId: '',
                areaId: '',
                defaultBuilding: [],
                defaultDepartment: [],
                defaultArea: [],
                buildingTree: [],
                departmentTree: [],
                areaTree: [],
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
            statisticObj: {
                light: '无数据',
                ac: '无数据',
                power: '无数据',
                special: '无数据'
            },
            initStatisticObj: {
                light: '无数据',
                ac: '无数据',
                power: '无数据',
                special: '无数据'
            },
            setChartsArr: {
                chartColumn: { type: 'bar' },
                chartPie: { type: 'pie' }
            },
            chartObjs: {},
            barOptionSeriesArr: {
                update: [],
                light: [],
                ac: [],
                power: [],
                special: []
            },
            barOption: {
                title: {
                    text: '能耗分析对比'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                color: ['#1dc16e', '#1ab8f3', '#f0c23d', '#ef5f5f'],
                legend: {
                    top: 20,
                    left: 'center',
                    data: ['照明用电', '空调用电', '动力用电', '特殊能耗']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value'
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                series: [
                    {
                        name: '照明用电',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        data: [],
                    },
                    {
                        name: '空调用电',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        data: []
                    },
                    {
                        name: '动力用电',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        data: []
                    },
                    {
                        name: '特殊能耗',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        data: []
                    }
                ]
            },
            pieOption: {
                title: {
                    text: '分项能耗占比',
                    grid: {
                        left: '10%',
                        top: '10%'
                    }
                },
                tooltip: {},
                color: ['#1dc16e', '#1ab8f3', '#f0c23d', '#ef5f5f'],
                legend: {
                    orient: 'vertical',
                    x: 'center',
                    bottom: 'bottom',
                    data: ['照明用电', '空调用电', '动力用电', '特殊能耗']
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '60%'],
                        label: {
                            align: 'center',
                            normal: {
                                formatter: "{b}\n{d}%",
                            }
                        },
                        data: []
                    }
                ]
            }
        };
    },
    mounted() {
        this.initDebounce();
        this.setTreeData();//获取树型菜单数据
        this.getDataFn(true);//获取数据
        this.initEcharts();// 基于准备好的dom，初始化echarts实例
    },
    computed: {
        position() {
            let positionEnd = this.$route.name;
            return '能耗统计 》 ' + positionEnd;
        }
    },
    methods: {
        setTreeData() {
            let _self = this;
            //默认选择树型菜单第一项
            let setId = (type, _data) => {
                const idtype = type == 'dept' ? 'departmentId' : type == "build" ? 'equipementStationId' : "id",
                    treeName = type == 'dept' ? 'departmentTree' : type == "build" ? 'buildingTree' : "areaTree",
                    idName = type == 'dept' ? 'departmentId' : type == "build" ? 'buildingId' : "id",
                    defaultName = type == 'dept' ? 'defaultDepartment' : type == "build" ? 'defaultBuilding' : "defaultArea",
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
                    }
                }
            });

            this.$$api_energyConsumption_deptTree({
                data: {
                    customerId: this.customerId
                },
                fn(data) {
                    if (data) {
                        setId('dept', data);
                    }
                }
            });
        },
        setStartDate() {
            switch (this.radio) {
                case 'custom':
                    this.dateObject.customStart = transDate(this.dateObject.customStart).defaultFullDate;
                    return this.dateObject.customStart;
                case 'month':
                    return this.dateObject.startMonth;
                case 'week':
                    return this.dateObject.startWeek;
                default:
                    break;
            }
        },
        initDebounce() {
            this.getDataFn = debounce(this.initGetDataFn, 1000);
        },
        getDataFn() {

        },
        /**
         * 判断日期选择情况并请求数据
         * @param {Boolean} init //ture为初始化，否则为普通情况
         */
        initGetDataFn(init) {
            //判断日期选择情况
            if (this.radio == 'custom') {

                if (!this.dateObject.customStart || !this.dateObject.customEnd) {
                    return this.$message({
                        duration: '3000',
                        message: '请输入完整日期!'
                    });
                } else if (transDate(this.dateObject.customStart).defaultFullDate >= transDate(this.dateObject.customEnd).defaultFullDate) {
                    return this.$message({
                        duration: '3000',
                        message: '开始日期不得大于等于结束日期!'
                    });
                }
            }

            if (!init) {
                this.clearChart('chartColumn');
                this.clearChart('chartPie');
            }

            this.getTrendData();//获取统计数据
            this.getSubItemContrast()//获取能耗分析对比数据
        },
        /**
         * 获取统计数据
         */
        getTrendData() {
            let _self = this,
                _startDate = this.setStartDate(),
                _endDate = this.radio != 'custom' ? this.dateObject.endTime : this.transDateFn(this.dateObject.customEnd).defaultFullDate,
                statisticsData = {
                    customerId: this.customerId,
                    mode: this.trendObj.leftBotNav,
                    start: _startDate,
                    end: _endDate
                };
                if (this.trendObj.leftBotNav == 'dept') {
                    statisticsData.modeId = this.trendObj.departmentId;
                } else {
                    statisticsData.modeId = this.trendObj.buildingId;
                }

            let setSubItem = (itemObj) => {
               
                switch (itemObj.regionName) {
                    case "照明插座":
                        this.statisticObj.light = itemObj.totalAmount || "无数据";
                        this.pieOption.series[0].data.push({ value: itemObj.totalAmount || "无数据", name: '照明用电' })
                        break;
                    case "空调用电":
                        this.statisticObj.ac = itemObj.totalAmount || "无数据";
                        this.pieOption.series[0].data.push({ value: itemObj.totalAmount || "无数据", name: '空调用电' })
                        break;
                    case "动力用电":
                        this.statisticObj.power = itemObj.totalAmount || "无数据";
                        this.pieOption.series[0].data.push({ value: itemObj.totalAmount || "无数据", name: '动力用电' })
                        break;
                    case "特殊能耗":
                        this.statisticObj.special = itemObj.totalAmount || "无数据";
                        this.pieOption.series[0].data.push({ value: itemObj.totalAmount || "无数据", name: '特殊能耗' })
                        break;
                    default:
                        break;
                }
            };

            this.pieOption.series[0].data = [];
            this.pieOption.title = {
                text: '分项能耗占比',
                top: '2%',
                left: '2%',
                textStyle: {
                    fontSize: 15
                }
            };
            _self.statisticObj = JSON.parse(JSON.stringify(_self.initStatisticObj));


            this.$$api_energyConsumption_subItemSta({
                data: statisticsData,
                fn(data) {
                    if (data) {
                        for (let _obj of data) {
                            setSubItem(_obj);
                        }

                        _self.setChart('chartPie');
                    } else {
                        _self.pieOption.title = {
                            text: '暂无数据',
                            left: 'center',
                            top: 'center',
                            textStyle: {
                                color: 'red'
                            }
                        };
                        _self.setChart('chartPie');
                    }
                },
                errFn() {
                    _self.pieOption.title = {
                        text: '暂无数据',
                        left: 'center',
                        top: 'center',
                        textStyle: {
                            color: 'red'
                        }
                    };
                    _self.setChart('chartPie');
                }
            });

        },
        /**
         * 获取分析对比数据
         */
        getSubItemContrast() {
            let _self = this,
                _startDate = _startDate = this.setStartDate(),
                _endDate = this.radio != 'custom' ? this.dateObject.endTime : this.transDateFn(this.dateObject.customEnd).defaultFullDate,
                statisticsData = {
                    customerId: this.customerId,
                    mode: this.trendObj.leftBotNav,
                    start: _startDate,
                    end: _endDate
                };
                if (this.trendObj.leftBotNav == 'dept') {
                    statisticsData.modeId = this.trendObj.departmentId;
                } else {
                    statisticsData.modeId = this.trendObj.buildingId;
                }

            let setSubItemArr = (itemObj) => {
                switch (itemObj.regionName) {
                    case "照明插座":
                        this.barOptionSeriesArr.light.push(itemObj.totalAmount);
                        break;
                    case "空调用电":
                        this.barOptionSeriesArr.ac.push(itemObj.totalAmount);
                        break;
                    case "动力用电":
                        this.barOptionSeriesArr.power.push(itemObj.totalAmount);
                        break;
                    case "特殊能耗":
                        this.barOptionSeriesArr.special.push(itemObj.totalAmount);
                        break;
                    default:
                        break;
                }
            };

            for (let i = 0, len = this.barOption.series.length; i < len; i++) {
                this.barOption.series[i].data = [];
            }

            for (let boArr in this.barOptionSeriesArr) {
                this.barOptionSeriesArr[boArr] = [];
            }

            this.barOption.xAxis.data = [];
            this.barOption.title = {
                text: '能耗分析对比',
                top: '2%',
                left: '2%',
                textStyle: {
                    fontSize: 15
                }
            };

            this.$$api_energyConsumption_subItemContrast({
                data: statisticsData,
                fn(data) {
                    if (data) {
                        for (let _statiticsObj of data) {
                            let ud = _statiticsObj.updateDate.split(' ')[0];
                            if (!_self.barOptionSeriesArr.update.includes(ud)) {
                                _self.barOptionSeriesArr.update.push(ud);
                            }
                            setSubItemArr(_statiticsObj);
                        }

                        _self.barOption.xAxis.data = _self.barOptionSeriesArr.update;
                        _self.barOption.series[0].data = _self.barOptionSeriesArr.light;
                        _self.barOption.series[1].data = _self.barOptionSeriesArr.ac;
                        _self.barOption.series[2].data = _self.barOptionSeriesArr.power;
                        _self.barOption.series[3].data = _self.barOptionSeriesArr.special;

                        _self.setChart('chartColumn');
                    } else {

                        _self.barOption.title = {
                            text: '暂无数据',
                            left: 'center',
                            top: 'center',
                            textStyle: {
                                color: 'red'
                            }
                        };
                        _self.setChart('chartColumn');
                    }
                },
                errFn() {
                    _self.barOption.title = {
                        text: '暂无数据',
                        left: 'center',
                        top: 'center',
                        textStyle: {
                            color: 'red'
                        }
                    };
                    _self.setChart('chartColumn');
                }
            });
        },
        //树形导航点击事件;
        handleNodeClick(data) {
            if (this.trendObj.leftBotNav == 'dept') {
                this.trendObj.deptfirstClick && this.trendObj.$refs.departTree.$children[0].$el.classList.remove('is-current');
                this.trendObj.departmentId = data.departmentId;
            } else{
                this.trendObj.buildfirstClick && this.trendObj.$refs.buildingTree.$children[0].$el.classList.remove('is-current');
                this.trendObj.buildingId = data.equipementStationId;
            } 
            this.getDataFn();
        },
        //切换地区等
        changePart(){
          this.initGetDataFn();
        },
        //初始化chart图表；
        initEcharts() {
            for (let val in this.setChartsArr) {
                this.chartObjs[val] = echarts.init(document.getElementById(val));
                this.chartObjs[val].showLoading();
            }
        },
        /**
         * 清空对应echart对象的配置并显示loading
         * @param {String} id //echart节点id
         */
        clearChart(id) {
            this.chartObjs[id].clear();
            this.chartObjs[id].showLoading();
        },
        setChart(id, clear) {
            let _option = this.chartType({ type: this.setChartsArr[id].type, name: id });
            clear && this.chartObjs[id].clear();
            this.chartObjs[id].setOption(_option);
            this.chartObjs[id].hideLoading();
        },
        chartType(_obj) {
            switch (_obj.type) {
                case 'bar':
                    return this.barOption;
                case 'gauge':
                    return this.gaugOption;
                case 'pie':
                    return this.pieOption;
                default:
                    break;
            }
        }
    },
    
}