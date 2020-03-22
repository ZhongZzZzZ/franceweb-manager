<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ language === 'Chinese' ? '中文':'法文' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="language" style="padding: 10px;">
          <el-radio label="Chinese">
            中文
          </el-radio>
          <el-radio label="French">
            法文
          </el-radio>
        </el-radio-group>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: 'Chinese'
    }
  },
  computed: {
    language: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
