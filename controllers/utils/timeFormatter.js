const timeFormatter = time => {
  const totalMin = Math.floor((Date.now() = time.getTime()) / (1000 * 60));

  if (totalMin <= 0) {
    return "Just now";
  }
  if (totalMin < 60) {
    if (totalMin === 1) {
      return `${totalMin} minute ago`
    }
    return `${totalMin} minutes ago`
  }
  if (totalMin >= 60 && totalMin < 1440) {
    const totalHrs = Math.floor(totalMin / 60);
    if (totalHrs === 1) {
      return `${totalHrs} hour ago`
    }
    return `${totalHrs} hours ago`
  }
  else {
    return time.toDateString();
  }
}

module.exports = { timeFormatter };