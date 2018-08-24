export default {
    name: "dw-datePicker",
    model: {
        prop: "option",
        event: "opt"
    },
    /**
     * 接收参数
     * @type {Object}
     */
    props: {
        option: Object,
        accordion: Boolean,
        highlightCurrent: Boolean,
        showCheckbox: Boolean,
        defaultExpandAll: Boolean,
        checkStrictly: Boolean
    },
    /**
     * 监控参数
     * @type {Object}
     */
    watch: {
    },
    data() {
        console.log(this.option)
        return {
        };
    },
    mounted() {
        
    },
    methods: {
        handleNodeClick(data) {
            this.$emit('handleNodeClick', data);
        },
        changeWaterEle() {
            this.$emit('changeWaterEle');
        },
        changePart() {
            this.$emit('changePart');
        },
        show(pane) {
            let _show = true,
            _this = this;

            if (pane.show) {
                _show = pane.show(this);
            }

            return _show;
        }
    },
    computed: {

    }
};