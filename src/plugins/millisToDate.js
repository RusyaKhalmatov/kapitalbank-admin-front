const millisToDate = {
  install(Vue) {
    Vue.filter("millisToDate", value => {
      let date = new Date(value);
      const dmy =
        `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}` +
        `.${
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1
        }` +
        `.${date.getFullYear()}`;

      return `${dmy}`;
    });
  }
};

export default millisToDate;
