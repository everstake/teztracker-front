<template>
  <b-row>
    <b-col cols="12">
      <b-card no-body>
        <template #header>
          <div class="break-word">
            <h3>
              <span class="text">{{ title }}</span>
            </h3>
            <span class="subtitle">{{ subtitle }}</span>
          </div>

          <div class="card-divider w-100 mt-3"></div>
        </template>

        <b-card-body>
          <b-row
            v-for="(field, index) in fields"
            :key="index"
            class="item-info ml-1 mr-1"
          >
            <b-col :lg="3">
              <span class="label">{{ field.key }}</span>
            </b-col>
            <b-col :lg="9">
              <span class="value">
                <slot name="value" :field="field">
                  {{ field.value }}
                </slot>
              </span>
            </b-col>
          </b-row>

          <slot name="extra" />
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "StatisticsCard",
  props: {
    title: {
      type: String,
      default: ""
    },
    subtitle: {
      type: String,
      default: ""
    },
    fields: {
      type: Array,
      default: () => []
    }
  }
};
</script>
