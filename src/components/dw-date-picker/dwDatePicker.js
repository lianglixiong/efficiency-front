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
        option: Object
    },
    /**
     * 监控参数
     * @type {Object}
     */
    watch: {},
    data() {
        return {
        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        btnClick() {
            this.$emit('btnClick');
        },
        radioChange() {
            this.$emit('radioChange');
        },
        startDateChange() {
            this.$emit('startDateChange');
        },
        endDateChange() {
            this.$emit('endDateChange');
        },
        show(dpChild) {
            let _show = true;

            if (dpChild.show) {
                _show = dpChild.show(this);
            }

            return _show;
        }
    },
    computed: {
    }
};