import { transDate, debounce } from 'utils/'
import { DwDatePicker, TreeMenu } from '@/components'

export default {
    name: 'EnergyAnalysis-Ranking',
    components: { DwDatePicker, TreeMenu },
    data() {
        let today = new Date(),
            _month = today.getMonth() + 1,//月
            _year = today.getFullYear(),//年
            _date = today.getDate();//日;;
        return {
            transDateFn: transDate,
            loading: false,
            userid: this.$store.getters.getUserinfo.customerId,
            startTime: _year + '/' + _month + '/' + 1,
            endTime: _year + '/' + _month + '/' + _date,
            trendObj: {
                leftTopNav: 'elect',
                leftTopNavArr: [{ label: "电", name: "elect" }, { label: "水", name: "water" }],
                leftBotNav: 'building',
                leftBotNavArr: [
                    { label: "建筑", name: "building", dataName: 'buildingTree', propsName: 'defaultProps', exKeysName: 'defaultBuilding', nodeKey: "equipementStationId", refName: "buildingTree" },
                    { label: "部门", name: "dept", dataName: 'departTree', propsName: 'deptProps', exKeysName: 'defaultDepartment', nodeKey: "departmentId", refName: "departTree" }
                ],
                buildingId: '',
                departmentId: '',
                defaultBuilding: [],
                defaultDepartment: [],
                buildingTree: [],
                departTree: [],
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
            totalAmountLine: '',
            space: '',
            rankingTable: []
        };
    },
    mounted() {
        this.getTreeData();
        this.initDebounce();

    },
    methods: {
        //树形导航点击事件;
        handleNodeClick(data) {
            if (this.trendObj.leftBotNav == 'dept') {
                this.deptfirstClick && this.$refs.treeMenu.$refs.departTree[0].$children[0].$el.classList.remove('is-current');
                this.trendObj.departmentId = data.departmentId;
            } else {
                this.buildfirstClick && this.$refs.treeMenu.$refs.buildingTree[0].$children[0].$el.classList.remove('is-current');
                this.trendObj.buildingId = data.equipementStationId;
            }
            this.getDataFn()
        },

        //获取左侧树型菜单；
        getTreeData() {
            let _self = this;
            //默认选择树型菜单第一项
            let setId = (type, _data) => {
                const idtype = type == 'dept' ? 'departmentId' : 'equipementStationId',
                    treeName = type == 'dept' ? 'departTree' : 'buildingTree',
                    idName = type == 'dept' ? 'departmentId' : 'buildingId',
                    defaultName = type == 'dept' ? 'defaultDepartment' : 'defaultBuilding',
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
                    customerId: this.userid
                },
                fn(data) {
                    if (data) {
                        setId('build', data);
                        _self.getTableData();
                    }

                }
            });
            this.$$api_energyConsumption_deptTree({
                data: {
                    customerId: this.userid
                },
                fn(data) {
                    if (data) {
                        setId('dept', data);
                    }
                }
            });
        },
        /**
         * 去抖
         */
        initDebounce() {
            this.getDataFn = debounce(this.getTableData, 1000);
        },
        getDataFn() {

        },
        //切换水电
        changeWaterEle() {
            this.getTableData();
        },
        //切换部门等
        changePart() {
            this.getTableData();
        },
        /**
         * 请求表格内容
         */
        getTableData() {
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
            this.loading = true;

            let self = this,
                statisticsData = {
                    mode: this.trendObj.leftBotNav,
                    start: this.transDateFn(this.startTime).defaultDate,
                    end: this.transDateFn(this.endTime).defaultDate
                };

            /**
             * 生成实际能耗进度条的比例尺数组
             * @param {Number||String} topNum //实际能耗最大数值
             */
            let buildLineArr = (topNum) => {
                let perNum = topNum / 3,
                    lineArr = [perNum, perNum * 2, topNum],
                    lineSting = "0";

                for (let _num of lineArr) {
                    lineSting += this.space + _num;
                }
                return lineSting;
            };

            //成功的回调
            let succFn = (data) => {
                if (data) {
                    let bla = buildLineArr(data[0].totalAmount);
                    self.rankingTable = data;
                    data[0].totalAmount && (self.totalAmountLine = bla);
                } else {
                    self.rankingTable = [];
                }
                self.loading = false;
            }

            let errorFn = () => {
                self.rankingTable = [];
                self.loading = false;
            }

            if (this.trendObj.leftBotNav == 'dept') {
                statisticsData.departmentId = this.trendObj.departmentId;
            } else {
                statisticsData.buildingId = this.trendObj.buildingId;
            }

            if (this.trendObj.leftTopNav == 'elect') {
                this.$$api_energyAnalysis_eleRank({
                    data: statisticsData,
                    fn: succFn,
                    errFn: errorFn
                });
            } else {
                this.$$api_energyAnalysis_waterRank({
                    data: statisticsData,
                    fn: succFn,
                    errFn: errorFn
                });
            }
        }
    }
}