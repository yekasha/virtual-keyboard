const getHour = () => new Date().getHours();
const body = document.querySelector('body');

const times = {
  night: [22, 23, 0, 1, 2, 3],
  morning: [4, 5, 6, 7, 8],
  noon: [9, 10, 11, 12],
  afternoon: [13, 14, 15, 16, 17],
  evening: [18, 19, 20, 21],
};

Object.entries(times).forEach((timescale) => {
  if (timescale[1].includes(getHour())) body.classList = timescale[0];
});
