import { debounce } from 'utils/'
import {TreeMenu } from '@/components'
export default {
    name: 'EnergyAlarm-quotaMange',
    components: {TreeMenu},
    data() {
        return {
            customerId: this.$store.getters.getUserinfo.customerId,
            path: this.$route.path,
            trendObj: {
                leftTopNav: 'ele',
                leftTopNavArr: [{ label: "电", name: "ele" }, { label: "水", name: "water" }],
                leftBotNav: 'building',
                leftBotNavArr: [
                    { label: "建筑", name: "building", dataName: 'buildingTree', propsName: 'buildProps', exKeysName: 'defaultBuilding', nodeKey: "equipementStationId", refName: "buildingTree" },
                    { label: "部门", name: "dept", dataName: 'departmentTree', propsName: 'deptProps', exKeysName: 'defaultDepartment', nodeKey: "departmentId", refName: "departmentTree" },
                ],
                buildingId: '',
                departmentId: '',
                defaultBuilding: [],
                defaultDepartment: [],
                buildingTree: [],
                departmentTree: [],
                buildProps: {
                    children: 'childNode',
                    label: 'sename'
                },
                deptProps: {
                    children: 'childNode',
                    label: 'departmentName'
                },
            },
            // leftTopNav: 'ele',
            // leftBotNav: 'building',
            // buildingId: '',
            // departmentId: '',
            // buildingTree: null,
            // departTree: null,
            sename: '',
            departmentName: '',
            // defaultBuilding: [],
            // defaultDepartment: [],
            // buildfirstClick: true,
            // deptfirstClick: true,
            // buildProps: {
            //     children: 'childNode',
            //     label: 'sename'
            // },
            // deptProps: {
            //     children: 'childNode',
            //     label: 'departmentName'
            // },
            choseyear: new Date().getFullYear() + '',
            monthObj: {
                input1: '',
                input2: '',
                input3: '',
                input4: '',
                input5: '',
                input6: '',
                input7: '',
                input8: '',
                input9: '',
                input10: '',
                input11: '',
                input12: '',
            }
        };
    },
    mounted() {
        this.initDebounce();
        this.getTreeData();
    },
    methods: {
        //树形导航点击事件;
        handleNodeClick(data) {
            if (this.trendObj.leftBotNav == 'dept') {
                this.deptfirstClick && this.$refs.treeMenu.$refs.departmentTree[0].$children[0].$el.classList.remove('is-current');
                this.trendObj.departmentId = data.departmentId;
                this.departmentName = data.departmentName;
            } else{
                this.buildfirstClick && this.$refs.treeMenu.$refs.buildingTree[0].$children[0].$el.classList.remove('is-current');
                this.trendObj.buildingId = data.equipementStationId;
                this.sename = data.sename;
            }
            this.getDataFn();
        },
        //获取左侧树形菜单；
        getTreeData() {
            let _self = this;
            let setId = (type, _data) => {
                const idtype = type == 'dept' ? 'departmentId' : 'equipementStationId',
                    treeName = type == 'dept' ? 'departmentTree' : 'buildingTree',
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
                    customerId: this.customerId
                },
                fn(data) {
                    // data && (_self.buildingTree = data);
                    // _self.sename = data[0].sename;
                    // _self.buildingId = data[0].equipementStationId;
                    // _self.checkData();
                    _self.sename = data[0].sename;
                    if (data) {
                        setId('building', data);
                        _self.checkData();
                    }
                }
            });
            this.$$api_energyConsumption_deptTree({
                data: {
                    customerId: this.customerId
                },
                fn(data) {
                    // data && (_self.departTree = data);
                    _self.departmentName = data[0].departmentName;
                    if (data) {
                        setId('dept', data);
                    }
                }
            });
        },
        //配置数据保存；
        setData() {
            let self = this,
                monthValue = [],
                _date = new Date(this.choseyear),
                sendData = {
                    year: _date.getFullYear(),
                    monthValue: monthValue
                };

            for (let mObj in this.monthObj) {
                let _obj = {
                    month: mObj.replace('input', ''),
                    limitValue: Number(this.monthObj[mObj])
                }
                monthValue.push(_obj)
            };
            if (this.trendObj.leftTopNav == 'ele') {
                sendData.objType = 2;
            } else {
                sendData.objType = 1;
            };
            if (this.trendObj.leftBotNav == 'dept') {
                sendData.belongId = Number(this.trendObj.departmentId);
                sendData.belongType = 1;
            } else {
                sendData.belongId = Number(this.trendObj.buildingId);
                sendData.belongType = 2;
            };

            this.$$api_energyAlarm_saveEnergyLimit({
                headers: { 'Content-Type': 'application/json;charset=UTF-8' },
                data: sendData,
                fn() {
                    self.$alert('数据保存成功', {
                        confirmButtonText: '确定',
                    })
                }
            });
        },
        // /**
        //  * 去抖
        //  */
        initDebounce() {
            this.getDataFn = debounce(this.checkData, 500);
        },
        getDataFn() {

        },
        //切换水电
        changeWaterEle() {
            this.checkData();
        },
        //切换部门等
        changePart() {
            this.checkData();
        },
        //查询数据
        checkData() {
            let self = this,
                _date = new Date(this.choseyear),
                sendData = {
                    year: _date.getFullYear()
                };
            if (this.trendObj.leftTopNav == 'ele') {
                sendData.objType = 2;
            } else {
                sendData.objType = 1;
            };
            if (this.trendObj.leftBotNav == 'dept') {
                sendData.belongId = Number(this.trendObj.departmentId);
                sendData.belongType = 1;
            } else {
                sendData.belongId = Number(this.trendObj.buildingId);
                sendData.belongType = 2;
            };
            this.$$api_energyAlarm_queryEnergyLimit({
                data: sendData,
                fn(data) {
                    for (let subValue of data) {
                        self.monthObj['input' + subValue.month] = subValue.limitValue;
                    }
                }
            })
        },
    }
}