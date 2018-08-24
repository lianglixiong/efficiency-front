import { DwDatePicker, TreeMenu } from '@/components'
import { transDate, debounce } from 'utils/'

export default {
  name: 'ReportManager-AyntheticalReport',
  components: { DwDatePicker, TreeMenu },
  data() {
    let _self = this,
      today = new Date();
    return {
      userid: _self.$store.getters.getUserinfo.customerId,
      pageDataObj: {
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
        startYear: today.getFullYear() + '-01-01',
        endYear: today.getFullYear() + '-12-31'
      },
      trendObj: {
        leftTopNav: 'ele',
        leftTopNavArr: [{ label: "电", name: "ele" }, { label: "水", name: "water" }],
        leftBotNav: 'building',
        leftBotNavArr: [
          { label: "建筑", name: "building", dataName: 'buildingTree', propsName: 'buildProps', exKeysName: 'faultData', nodeKey: "equipementStationId", refName: "buildingTree", checkKey: "faultData" },
          { label: "部门", name: "dept", dataName: 'departTree', propsName: 'deptProps', exKeysName: 'faultPart', nodeKey: "departmentId", refName: "departTree", checkKey: "faultPart" }
        ],
        faultData: [],
        faultPart: [],
        buildingTree: [],
        departTree: [],
        buildProps: {
          children: 'childNode',
          label: 'sename'
        },
        deptProps: {
          children: 'childNode',
          label: 'departmentName'
        }
      },
      loading: true,
      reportTable: []
    };
  },
  computed: {
    position() {
      let positionEnd = this.$route.name;
      return '用能告警 》 ' + positionEnd;
    }
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
          var faultData = []
          data.forEach(item => {
            faultData.push(item.equipementStationId)
          });
          _self.trendObj.faultData = faultData;
          _self.$nextTick(() => {
            _self.getList();
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
          var faultPart = []
          data.forEach(item => {
            faultPart.push(item.departmentId)
          });
          _self.trendObj.faultPart = faultPart;
        }
      });
    },
    sureGo() {
      this.getList();
    },
    //表格数据获取
    getList() {
      this.loading = true;
      var _self = this;
      let belongIds, belongType, mode, type, start, end;
      if (this.trendObj.leftTopNav == 'ele') {
        mode = 1
      } else {
        mode = 2
      }
      if (this.trendObj.leftBotNav == 'building') {
        belongType = 2;
        belongIds = this.getBuildId();
      } else {
        belongType = 1;
        belongIds = this.getPartId();
      }

      type = this.pageDataObj.radio;

      if (type == 'year') {
        start = transDate(this.pageDataObj.startYear).defaultDate;
        end = transDate(this.pageDataObj.endYear).defaultDate;
      } else {
        start = transDate(this.pageDataObj.startMonth).defaultDate;
        end = transDate(this.pageDataObj.endMonth).defaultDate;
      }

      this.$$api_energyAlarm_queryExcessAlarm({
        data: {
          belongIds: belongIds,
          belongType: belongType,
          mode: mode,
          type: 'month',
          start: start,
          end: end
        },
        fn(data) {
          _self.loading = false;
          var tableList = [];
          if (data) {
            data.forEach(item => {
              tableList.push({
                name: item.sename,
                overMonth: item.updateDate,
                realAndLimit: item.realValue + ' / ' + item.limitValue,
                overValue: item.excessValue,
                proportion: item.proportion
              })
            })
            _self.reportTable = tableList;
          } else {
            _self.reportTable = [];
          }
        }
      });
    },
     //切换水电
     changeWaterEle() {
      this.getList();
    },
    //切换部门等
    changePart() {
      this.getList();
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
    }
  }
}