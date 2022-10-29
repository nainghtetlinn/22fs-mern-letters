import moment from 'moment';

export const formatDate = (start: any) => {
  const startDate = moment(start);
  const todayDate = moment(new Date());
  const duration = moment.duration(todayDate.diff(startDate)).asMilliseconds();
  if (duration > 1000 * 60 * 60 * 24 * 10) {
    return moment(start).format('MMMM Do YYYY'); // October 18th 2022
  } else {
    return moment(start).fromNow(); // 8 days ago
  }
};
