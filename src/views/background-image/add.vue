<template>
  <form-fields />
</template>

<script>
  export default {
    name: "add",
    components: {
      formFields: () => import('./__fileds')
    }
  }
</script>
