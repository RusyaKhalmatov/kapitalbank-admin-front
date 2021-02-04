import VDateTimePickerComponent from './VDateTimePickerComponent';

const VDateTimePicker = {
    install: (Vue, options) => {
        Vue.component('VDatetimePicker', VDateTimePickerComponent);
    }
};

export default VDateTimePicker;