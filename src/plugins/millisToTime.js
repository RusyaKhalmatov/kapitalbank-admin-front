const millisToTime ={
    install(Vue) {
        Vue.filter('millisToTime', value => {
            let date = new Date(value);
            const time = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}` +
                    `:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}` +
                    `:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;

            return `${time}`;
        });
    }
};
export default millisToTime;