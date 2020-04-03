<template>
  <b-row>
    <b-col cols="12">
      <b-card no-body>
        <template #header>
          <div class="break-word">
            <h3 id="card-title" class="card__title" @click="copyToClipboard()">
              <span ref="textToCopy" class="text">{{ title }}</span>
              <span class="icon"><font-awesome-icon class="icon-primary" :icon="['fas', 'copy']"/></span>
            </h3>
            <b-tooltip ref="tooltip" triggers="hover" target="card-title">Copy to clipboard</b-tooltip>
            <div class="subtitle">{{ subtitle }}</div>
          </div>

          <div class="card-divider w-100 mt-3"></div>
        </template>

        <b-card-body>
          <b-row
            v-for="(field, index) in fields"
            :key="index"
            class="item-info mr-1"
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
  },
  methods: {
    copyToClipboard() {
      const selection = window.getSelection();
      const range = window.document.createRange();
      selection.removeAllRanges();
      range.selectNode(this.$refs.textToCopy);
      selection.addRange(range);
    
      try {
        document.execCommand('copy');
      } catch (err) {
        selection.removeAllRanges();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .subtitle {
    &--capitalize {
      text-transform: capitalize;
    }
  }

  .card__title {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  .icon-primary {
    color: $color-brand;
  }

  .icon {
    position: absolute;
    top: 0;
    right: -15px;
    margin-left: 10px;
    font-size: 12px;
    color: #309282;
  }
</style>
