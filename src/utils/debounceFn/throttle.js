/**
 * 节流函数
 * @param {Function} func 被调用的函数
 * @param {Number} wait 时间间隔
 * @param {Object} options {leading:true,trailing:true}
 */
export default function (func, wait, options) {
	/* options的默认值
	 *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
	 *  options.leading = true;
	 *   表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
	 *  options.trailing = true;
	 *   延时执行func函数。
	 */
	var context, args, result;
	var timeout = null;
	var previous = 0;
	if (!options) options = {};
	var later = function () {
		previous = options.leading === false ? 0 : Date.now();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};
	return function () {
		var now = Date.now();
		if (!previous && options.leading === false) previous = now;

		var remaining = wait - (now - previous);
		context = this;
		args = arguments;

		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			//options.trailing=true时，延时执行func函数
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
};