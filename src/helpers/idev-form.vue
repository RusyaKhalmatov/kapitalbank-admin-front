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
    Button, Card,
    Form, Input, Select, Radio
  } from "ant-design-vue";

  export default {
    name: "idev-form",
    data(){
      return {
        form: this.$form.createForm(this, {...this.formFields}),
        formDisabled: false
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
      }
    }
  }
</script>
