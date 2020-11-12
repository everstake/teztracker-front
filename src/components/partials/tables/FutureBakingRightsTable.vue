<template>
  <b-table
    responsive
    show-empty
    :items="items"
    :fields="fields"
    :current-page="page"
    :per-page="0"
    borderless
    class="transactions-table"
    :empty-text="$t('common.noData')"
  >
    <template #cell(priority)="row">
      <span>{{ row.item.priority }}</span>
    </template>
    <template #cell(block_0)="row">
        <span class="d-flex align-items-center">
          <!--FIXME: There should be no empty data-->
          <IdentIcon
            v-if="row.item.block_0.delegate"
            :seed="row.item.block_0.delegate"
          />

          <router-link
            class="baker"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_0.delegate },
            }"
          >
            <template v-if="row.item.block_0.delegate_name">
              {{ row.item.block_0.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_0.delegate | longhash }}
            </template>
          </router-link>
  
          <!--FIXME: There should be no empty data-->
          <BtnCopy
            v-if="!row.item.block_0.delegate_name && row.item.block_0.delegate"
            :text-to-copy="row.item.block_0.delegate"
          />
        </span>
    </template>
    <template #cell(block_1)="row">
        <span class="d-flex align-items-center">
          <!--FIXME: There should be no empty data-->
          <IdentIcon
            v-if="row.item.block_1.delegate"
            :seed="row.item.block_1.delegate"
          />

          <router-link
            class="baker"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_1.delegate },
            }"
          >
            <template v-if="row.item.block_1.delegate_name">
              {{ row.item.block_1.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_1.delegate | longhash }}
            </template>
          </router-link>
  
          <!--FIXME: There should be no empty data-->
          <BtnCopy
            v-if="!row.item.block_1.delegate_name && row.item.block_1.delegate"
            :text-to-copy="row.item.block_1.delegate"
          />
        </span>
    </template>
    <template #cell(block_2)="row">
        <span class="d-flex align-items-center">
          <!--FIXME: There should be no empty data-->
          <IdentIcon
            v-if="row.item.block_2.delegate"
            :seed="row.item.block_2.delegate"
          />

          <router-link
            class="baker"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_2.delegate },
            }"
          >
            <template v-if="row.item.block_2.delegate_name">
              {{ row.item.block_2.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_2.delegate | longhash }}
            </template>
          </router-link>
  
          <!--FIXME: There should be no empty data-->
          <BtnCopy
            v-if="!row.item.block_2.delegate_name && row.item.block_2.delegate"
            :text-to-copy="row.item.block_2.delegate"
          />
        </span>
    </template>
    <template #cell(block_3)="row">
        <span class="d-flex align-items-center">
          <!--FIXME: There should be no empty data-->
          <IdentIcon
            v-if="row.item.block_3.delegate"
            :seed="row.item.block_3.delegate"
          />

          <router-link
            class="baker"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_3.delegate },
            }"
          >
            <template v-if="row.item.block_3.delegate_name">
              {{ row.item.block_3.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_3.delegate | longhash }}
            </template>
          </router-link>
  
          <!--FIXME: There should be no empty data-->
          <BtnCopy
            v-if="!row.item.block_3.delegate_name && row.item.block_3.delegate"
            :text-to-copy="row.item.block_3.delegate"
          />
        </span>
    </template>
    <template #cell(block_4)="row">
        <span class="d-flex align-items-center">
          <!--FIXME: There should be no empty data-->
          <IdentIcon
            v-if="row.item.block_4.delegate"
            :seed="row.item.block_4.delegate"
          />

          <router-link
            class="baker"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_4.delegate },
            }"
          >
            <template v-if="row.item.block_4.delegate_name">
              {{ row.item.block_4.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_4.delegate | longhash }}
            </template>
          </router-link>
  
          <!--FIXME: There should be no empty data-->
          <BtnCopy
            v-if="!row.item.block_4.delegate_name && row.item.block_4.delegate"
            :text-to-copy="row.item.block_4.delegate"
          />
        </span>
    </template>
    <template #cell(block_5)="row">
        <span class="d-flex align-items-center">
          <!--FIXME: There should be no empty data-->
          <IdentIcon
            v-if="row.item.block_5.delegate"
            :seed="row.item.block_5.delegate"
          />

          <router-link
            class="baker"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_5.delegate },
            }"
          >
            <template v-if="row.item.block_5.delegate_name">
              {{ row.item.block_5.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_5.delegate | longhash }}
            </template>
          </router-link>
  
          <!--FIXME: There should be no empty data-->
          <BtnCopy
            v-if="!row.item.block_5.delegate_name && row.item.block_5.delegate"
            :text-to-copy="row.item.block_5.delegate"
          />
        </span>
    </template>
    <template #cell(block_6)="row">
        <span class="d-flex align-items-center">
          <!--FIXME: There should be no empty data-->
          <IdentIcon
            v-if="row.item.block_6.delegate"
            :seed="row.item.block_6.delegate"
          />

          <router-link
            class="baker"
            :to="{
              name: 'baker',
              params: { baker: row.item.block_6.delegate },
            }"
          >
            <template v-if="row.item.block_6.delegate_name">
              {{ row.item.block_6.delegate_name }}
            </template>
            <template v-else>
              {{ row.item.block_6.delegate | longhash }}
            </template>
          </router-link>
  
          <!--FIXME: There should be no empty data-->
          <BtnCopy
            v-if="!row.item.block_6.delegate_name && row.item.block_6.delegate"
            :text-to-copy="row.item.block_6.delegate"
          />
        </span>
    </template>
  </b-table>
</template>

<script>
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';

  export default {
    name: 'FutureBakingRightsTable',
    props: {
      items: Array,
      page: Number,
      limit: Number,
      fields: Array,
    },
    components: {
      BtnCopy,
      IdentIcon,
    },
  };
</script>
