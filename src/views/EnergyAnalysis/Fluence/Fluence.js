
import echarts from 'echarts'
import { transDate, debounce } from 'utils/'
import { DwDatePicker, TreeMenu } from '@/components'

export default {
    name: 'EnergyAnalysis-Fluence',
    components: { DwDatePicker, TreeMenu },
    data() {
        let today = new Date(),
            _self = this,
            _month = today.getMonth() + 1,//月
            _year = today.getFullYear(),//年
            _date = today.getDate();//日;;;
        return {
            initChart: true,
            transDateFn: transDate,
            fluenceChart: null,
            customerId: this.$store.getters.getUserinfo.customerId,
            path: this.$route.path,
            startTime: _year + '/' + _month + '/' + 1,
            endTime: _year + '/' + _month + '/' + _date,
            trendObj: {
                leftTopNav: 'ele',
                leftTopNavArr: [{ label: "电", name: "ele" }, { label: "水", name: "water" }],
                leftBotNav: 'park',
                leftBotNavArr: [
                    { label: "建筑", name: "park", dataName: 'buildingTree', propsName: 'defaultProps', exKeysName: 'defaultBuilding', nodeKey: "equipementStationId", refName: "buildingTree" },
                    { label: "部门", name: "dept", dataName: 'departmentTree', propsName: 'deptProps', exKeysName: 'defaultDepartment', nodeKey: "departmentId", refName: "departmentTree" },
                ],
                buildingId: '',
                departmentId: '',
                defaultBuilding: [],
                defaultDepartment: [],
                buildingTree: [],
                departmentTree: [],
                defaultProps: {
                    children: 'childNode',
                    label: 'sename'
                },
                deptProps: {
                    children: 'childNode',
                    label: 'departmentName'
                },
            },
            // leftTopNav: 'ele',
            // leftBotNav: 'park',
            // buildingId: '',
            // departmentId: '',
            // buildingTree: null,
            // departTree: null,
            // sename: '',
            // departmentName: '',
            // defaultBuilding: [],
            // defaultDepartment: [],
            buildfirstClick: true,
            deptfirstClick: true,
            positionName: '',
            resData: '',
            // buildProps: {
            //     children: 'childNode',
            //     label: 'sename'
            // },
            // deptProps: {
            //     children: 'childNode',
            //     label: 'departmentName'
            // },
            setChart: {
                tooltip: {
                    trigger: 'item',
                    formatter(data) {
                        let _val = data.value,
                            srData = '';
                        if (_val) {
                            const _sum = data.data.val,
                                _unit = _self.trendObj.leftTopNav;
                            srData = ":\n" + _sum + (_unit == 'water' ? 't' : '/kwh') + '\n' + _val + '%';
                        }
                        return data.name + srData
                    }
                },
                series: {
                    type: 'sankey',
                    layout: 'none',
                    label: {
                        normal: {
                            formatter(data) {
                                let _val = data.value,
                                    srData = '';
                                if (_val) {
                                    const _sum = data.data.val,
                                        _unit = _self.trendObj.leftTopNav;
                                    srData = _sum + (_unit == 'water' ? 't' : '/kwh');
                                }
                                return data.name + srData;
                            }
                        }
                    },
                    data: [],
                    links: []
                }
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
                this.deptfirstClick && this.$refs.treeMenu.$refs.departmentTree[0].$children[0].$el.classList.remove('is-current');
                this.trendObj.departmentId = data.departmentId;
                this.departmentName = data.departmentName;
            } else {
                this.buildfirstClick && this.$refs.treeMenu.$refs.buildingTree[0].$children[0].$el.classList.remove('is-current');
                this.trendObj.buildingId = data.equipementStationId;
                this.sename = data.sename;
            }
            this.getChartData()
        },
        //获取左侧树形菜单；
        getTreeData() {
            let _self = this;
            //默认选择树型菜单第一项
            let setId = (type, _data) => {
                const idtype = type == 'dept' ? 'departmentId' : 'equipementStationId',
                    treeName = type == 'dept' ? 'departmentTree' : 'buildingTree',
                    idName = type == 'dept' ? 'departmentId' : 'buildingId',
                    defaultName = type == 'dept' ? 'defaultDepartment' : 'defaultBuilding',
                    esId = _data[0][idtype];

                _self.trendObj[treeName] = _data;//树型菜单绑定的data
                _self.trendObj[idName] = esId;//选中id
                _self.trendObj[defaultName].push(esId);//第一项id放入默认选中数组
                _self.positionName = _data[0].sename;
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
                    data && (_self.trendObj.buildingTree = data);
                    _self.trendObj.buildingId = data[0].equipementStationId;
                    _self.sename = data[0].sename;
                    _self.startTime = _self.transDateFn(_self.startTime).defaultDate;
                    _self.endTime = _self.transDateFn(_self.endTime).defaultDate;
                    setId('build', data)
                    _self.getChartData();
                }
            });
            this.$$api_energyConsumption_deptTree({
                data: {
                    customerId: this.customerId
                },
                fn(data) {
                    // data && (_self.departTree = data);
                    if (data) {
                        _self.departmentName = data[0].departmentName;
                        setId('dept', data);
                    }

                }
            });
        },
        /**
        * 去抖
        */
        initDebounce() {
            this.getDataFn = debounce(this.getChartData, 1000);
        },
        getDataFn() {

        },
        //获取echart表数据；
        getChartData() {
            if (!this.startTime || !this.endTime) {
                return this.$message({
                    duration: '2000',
                    message: '请输入完整日期!'
                });
            } else if (this.transDateFn(this.startTime).defaultDate > this.transDateFn(this.endTime).defaultDate) {
                return this.$message({
                    duration: '3000',
                    message: '开始日期不得大于结束日期!'
                });
            }
            let self = this,
                sendData = {
                    customerId: this.customerId,
                    energyFlag: this.trendObj.leftTopNav,
                    group: this.trendObj.leftBotNav,
                    beginDate: this.transDateFn(this.startTime).defaultDate,
                    endDate: this.transDateFn(this.endTime).defaultDate
                };
            if (this.trendObj.leftBotNav == 'dept') {
                sendData.deptIds = this.trendObj.departmentId;
            } else {
                sendData.equipementStationIds = this.trendObj.buildingId;
            };

            this.setChart.series.links = [];
            this.fluenceChart.showLoading();
            this.$$api_energyAnalysis_energyFlow({
                data: sendData,
                fn(data) {
                    if (data.data != '') {
                        self.resData = data.data;
                        let PName = '';
                        if (self.trendObj.leftBotNav == 'park') {
                            PName = self.sename;
                        } else {
                            PName = self.departmentName;
                        }
                        self.setChart.title = {};
                        self.setChart.series.data = [];
                        self.setChart.series.data.push({ name: PName });

                        self.dataDo(data.data, PName);

                    } else {
                        self.setChart.title = {
                            text: '暂无数据',
                            left: 'center',
                            top: 'center',
                            textStyle: {
                                color: 'red'
                            }
                        };
                        self.setChart.series.data = [{ name: '暂无数据！' }]
                    };
                    self.setOption();
                }
            });
        },
        //格式数据
        dataDo(data, PName) {

            if (data && data.length > 0) {
                data.forEach(item => {
                    this.setChart.series.data.push({
                        name: item.name,
                        value: item.ratio,
                        val: item.subSumValue
                    })
                    this.setChart.series.links.push({
                        source: PName,
                        target: item.name,
                        value: item.ratio,
                        val: item.subSumValue
                    })
                    if (item.subList) {
                        this.dataDo(item.subList, item.name);
                    }
                })
            }
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
            this.fluenceChart = echarts.init(document.getElementById('fluenceChart'))
            this.fluenceChart.showLoading();
            this.initChart = false;
        },
        setOption() {
            this.fluenceChart.clear();
            this.fluenceChart.setOption(this.setChart);
            this.fluenceChart.hideLoading();
        },
    }
}