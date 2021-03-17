<template>
  <a-card
    class="idev-page-card"
  >
    <template slot="title">
      <a-button
        icon="left"
        style="margin-right: 16px"
        @click="$router.push({name: backRouteName})"
        :disabled="formDisabled"
      >Назад</a-button>
      <h1>{{ formTitle }}</h1>
    </template>
    <a-form
      :form="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-form-item
        v-for="(v, key) in formColumns"
        :key="`fi_${key}`"
        :label="hasItem(v,'label',key)"
      >
        <template v-if="v.type === 'text'">
          <a-input
            v-decorator="[
            key,
            { rules: hasItem(v, 'rules', []) }
          ]"
            :disabled="formDisabled"
          />
        </template>
        <template v-if="v.type === 'select'">
          <a-select
            v-decorator="[
              key,
              {
                rules: hasItem(v, 'rules', []),
                defaultValue: hasItem(v,'defaultValue') ? v.defaultValue : false
              }
            ]"
            :disabled="formDisabled"
          >
            <a-select-option
              v-for="l in v.list"
              :value="l.key"
              :key="`so_${l.key}`"
            >{{ l.value }}</a-select-option>
          </a-select>
        </template>
        <template v-if="v.type === 'image'">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :action="v.uploadUrl"
            :show-upload-list="false"
            @change="changeUploadInput($event, key)"
          >
            <img v-if="formFields[key]" :src="formFields[key]" class="avatar" />
            <div v-else>
              <a-icon :type="imgLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </template>
        <template v-else-if="v.type === 'radio'">
          <a-radio-group
            v-decorator="[
            key,
            {
              rules: hasItem(v, 'rules', []),
              initialValue: formFields[key]
            }
          ]"
            :disabled="formDisabled"
          >
            <a-radio
              v-for="l in v.list"
              :value="l.value"
            >{{ l.text }}</a-radio>
          </a-radio-group>
        </template>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button
          type="primary"
          @click="formSubmit"
          icon="check"
          :loading="formDisabled"
        >Сохранить</a-button>
        <a-button
          icon="close"
          style="margin-left: 16px"
          @click="$router.push({name: backRouteName})"
          :loading="formDisabled"
        >Отменить</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
  import {
    Button, Card, Icon,
    Form, Input, Select, Radio, Upload
  } from "ant-design-vue";

  export default {
    name: "idev-form",
    data(){
      return {
        form: this.$form.createForm(this, {...this.formFields}),
        formDisabled: false,
        imgLoading: false
      }
    },
    props: {
      formTitle: String,
      backRouteName: String,
      formFields: {
        type: Object,
        default: () => {}
      },
      updateFields: {
        type: Object,
        default: () => {}
      },
      formColumns: {
        type: Object,
        default: () => {}
      },
      setContent: Function
    },
    watch: {
      updateFields(val){
        if (val) {
          this.form.setFieldsValue(val)
        }
      }
    },
    components: {
      [Form.name]: Form,
      [Form.Item.name]: Form.Item,
      [Input.name]: Input,
      [Select.name]: Select,
      [Select.Option.name]: Select.Option,
      [Radio.name]: Radio,
      [Radio.Group.name]: Radio.Group,
      [Button.name]: Button,
      [Icon.name]: Icon,
      [Upload.name]: Upload,
      [Card.name]: Card
    },
    methods: {
      formSubmit(){
        this.form.validateFields((err, values) => {
          if (!err) {
            this.formDisabled = true
            this.setContent(values)
              .then(() => {
                console.log("SUCCESS")
                this.formDisabled = false
                this.$router.push({name: this.backRouteName})
              })
              .catch(() => {
                console.log("ERROR")
                this.formDisabled = false
              })
          }
        });
      },
      changeUploadInput(info, field_name){
        console.log("INFO: ", info, field_name)
        if (info.file.status === 'uploading') {
          this.imgLoading = true
          return;
        }
        if (info.file.status === 'done') {
          this.getImageBase64(info.file.originFileObj, imageUrl => {
            this.formFields[field_name] = imageUrl
            this.imgLoading = false
          });
        }
      }
    }
  }
</script>
<style>
  .avatar-uploader > .ant-upload {
    width: 100%;
    height: 128px !important;
    max-height: 220px !important;
  }
  .avatar-uploader img{
    max-width: 100%;
    max-height: 220px !important;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
