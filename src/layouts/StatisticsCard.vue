<template>
  <b-row>
    <b-col cols="12">
      <b-card no-body>
        <template #header>
          <div class="break-word">
            <h3 class="card__title">
              <span ref="textToCopy" class="text">{{ title }}</span>
              <BtnCopy id="card-title" :text-to-copy="title" />
            </h3>
            <b-tooltip ref="tooltip" triggers="hover" target="card-title">
              {{ $t('common.copyToClipboard') }}
            </b-tooltip>
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
  import BtnCopy from '@/components/partials/BtnCopy';

  export default {
    name: 'StatisticsCard',
    components: {
      BtnCopy,
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      subtitle: {
        type: String,
        default: '',
      },
      fields: {
        type: Array,
        default: () => [],
      },
    },
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
    top: 50%;
    transform: translateY(-50%);
    right: -15px;
    margin-left: 10px;
    font-size: 12px;
    color: #309282;
  }
</style>
