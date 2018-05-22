<template>
  <router-link tag="li" class="nav-item nav-dropdown" :to="url" disabled v-if="!url">
    <div class="nav-link nav-dropdown-toggle" @click="handleClick"><i :class="icon"></i> {{name}}</div>
    <ul class="nav-dropdown-items">
      <slot></slot>
    </ul>
  </router-link>
  <router-link tag="li" class="nav-item nav-dropdown" :to="url" v-else>
    <div class="nav-link nav-dropdown-toggle"><i :class="icon"></i> {{name}}</div>
    <div class="b-toggle nav-link nav-dropdown-toggle" @click="handleClick"></div>
    <ul class="nav-dropdown-items">
      <slot></slot>
    </ul>
  </router-link>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick (e) {
      e.preventDefault()
      e.target.parentElement.classList.toggle('open')
    }
  }
}
</script>
<style lang="scss">
  .b-toggle{
    position: absolute !important;
    top: 10px;
    right: 0px;
  }
</style>
