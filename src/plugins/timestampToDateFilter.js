const timestampToDateFilter = {
    install(Vue, options) {
        Vue.filter('timestampToDate', value => {
            if (value != null) {
                let date = new Date(parseInt(value));
                const dmy = `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}` +
                    `.${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}` +
                    `.${date.getFullYear()}`,
                    time = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}` +
                        `:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}` +
                        `:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;

                return `${dmy}, ${time}`;
            }
            return ''
        });
    }
};

export default timestampToDateFilter;