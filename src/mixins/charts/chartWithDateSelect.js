import { mapState } from 'vuex';

export const timeType = {
  last24Hours: 'last24Hours',
  lastWeek: 'lastWeek',
  lastMonth: 'lastMonth',
  last6Months: 'last6Months',
};

export const periodType = {
  hour: 'hour',
  day: 'day',
  week: 'week',
  month: 'month',
};

export const periodByTime = {
  [timeType.last24Hours]: periodType.hour,
  [timeType.lastWeek]: periodType.day,
  [timeType.lastMonth]: periodType.day,
  [timeType.last6Months]: periodType.week,
};

export default {
  props: {
    initialTime: {
      type: String,
      default: timeType.last24Hours,
    },
  },
  data() {
    return {
      timeType: this.initialTime,
    };
  },
  methods: {
    getDateFrom(value) {
      return {
        [timeType.last24Hours]: this.getDate24HoursAgo,
        [timeType.lastWeek]: this.getDateWeekAgo,
        [timeType.lastMonth]: this.getDateMonthAgo,
        [timeType.last6Months]: this.getDate6MonthsAgo,
      }[value]();
    },
    getDate24HoursAgo() {
      const newDate = new Date();

      newDate.setHours(new Date().getHours() - 24);

      return newDate;
    },
    getDateWeekAgo() {
      const newDate = new Date();

      newDate.setDate(new Date().getDate() - 7);

      return newDate;
    },
    getDateMonthAgo() {
      const newDate = new Date();

      newDate.setMonth(new Date().getMonth() - 1);

      return newDate;
    },
    getDate6MonthsAgo() {
      const newDate = new Date();

      newDate.setMonth(new Date().getMonth() - 6);

      return newDate;
    },
    getSecondsTimestamp(date) {
      return Math.floor(date.getTime() / 1000);
    },
  },
  computed: {
    ...mapState('app', {
      dayFormat: (state) => state.dateFormat.split(' ')[0],
      hourFormat: (state) => state.dateFormat.split(' ')[1],
    }),

    labelsFormat() {
      return {
        [timeType.last24Hours]: this.hourFormat,
        [timeType.lastWeek]: this.dayFormat,
        [timeType.lastMonth]: this.dayFormat,
        [timeType.last6Months]: this.dayFormat,
      }[this.timeType];
    },

    initialOptions() {
      return {
        from: this.getSecondsTimestamp(this.getDateFrom(this.initialTime)),
        to: this.getSecondsTimestamp(new Date()),
        period: periodByTime[this.initialTime],
      };
    },
  },
};
