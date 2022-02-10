const timeFormatter = (time) => {
	const totalMin = Math.floor((Date.now() - time.getTime()) / (1000 * 60));

	if (totalMin <= 0) {
		const totalSec = Math.floor((Date.now() - time.getTime()) / 1000);

		if (totalSec <= 0) {
			return "1s";
		}
		return `${totalSec}s`;
	}
	if (totalMin < 60) {
		return `${totalMin}min`;
	}
	if (totalMin >= 60 && totalMin < 1440) {
		const totalHrs = Math.floor(totalMin / 60);

		return `${totalHrs}h`;
	} else {
		var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const currentYear = new Date().getFullYear();
		const postYear = time.getFullYear();
		const postDay = days[time.getDay()];
		let postFullDate = time.toDateString();
		postFullDate = postFullDate.replace(`${postDay} `, "");

		if (currentYear === postYear) {
			postFullDate = postFullDate.replace(` ${postYear}`, "");
			return postFullDate;
		}
		return postFullDate;
	}
};

module.exports = { timeFormatter };
