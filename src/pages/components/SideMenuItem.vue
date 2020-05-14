<template>
  <Submenu :name="menu.permission">
    <template slot="title">
      <b>{{ menu.name }}</b>
    </template>
    <template v-for="child in menu.children">
      <side-menu-item v-if="child.type === resourceTypes.DIRECTORY"
                      :key="child.id" :menu="child"></side-menu-item>
      <MenuItem v-else-if="child.type === resourceTypes.MENU"
                 :key="child.id" :to="child.url" :name="child.permission">
        <!--<i-icon v-if="child.icon.length > 0" :type="child.icon"></i-icon>-->
        <b>{{ child.name }}</b>
      </MenuItem>
    </template>
  </Submenu>
</template>

<script>
  import { ResourceTypeConstant } from '../auth/const';
  export default {
    name: "SideMenuItem",
    props: [
      'menu',
    ],
    data() {
      return {
        resourceTypes: ResourceTypeConstant,
      };
    },
  };
</script>

<style scoped>

</style>
