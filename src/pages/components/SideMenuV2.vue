<template>
  <div>
    <Menu ref="side-menu" width="auto" v-show="!collapsed" :active-name="activeName" theme="dark"
            :open-names="openNames">
      <template v-for="menu in menus">
        <side-menu-item v-if="menu.type === resourceTypes.DIRECTORY"
                        :key="menu.id" :menu="menu"></side-menu-item>
        <MenuItem v-else-if="menu.type === resourceTypes.MENU"
                   :key="menu.id" :to="menu.url" :name="menu.permission">
          <b>{{ menu.name }}</b>
        </MenuItem>
      </template>
    </Menu>
    <div class="menu-collapsed" v-show="collapsed">
      <template v-for="menu in menus">
        <collapsed-menu v-if="menu.type === resourceTypes.DIRECTORY"
                        :children="menu"
                        :firstClass=true
                        @on-click="handleSelect"
                        :key="menu.id"></collapsed-menu>
        <Tooltip transfer
                   v-else-if="menu.type === resourceTypes.MENU"
                   :content="menu.name"
                   placement="right"
                   :key="menu.id">
          <a @click="handleSelect(menu.url)"
             class="drop-menu-a"
             :key="menu.id">
            {{menu.collapseName}}
          </a>
        </Tooltip>
      </template>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { ResourceTypeConstant } from '../auth/const';
  import SideMenuItem from './SideMenuItem';
  import CollapsedMenu from './collapsedMenu';
  import EventBus from '../../libs/EventBus';
  export default {
    name: "SideMenuV2",
    data() {
      return {
        activeName: 0,
        openNames: [],
        menus: [],
        path: [],
        resourceTypes: ResourceTypeConstant,
      }
    },
    props: {
      collapsed: Boolean,
    },
    components: {
      SideMenuItem,
      CollapsedMenu,
    },
    watch: {
      $route(to) {
        const permission = to.meta.permission;
        if (permission !== undefined) {
          this.findPath(permission);
          this.findOpenNames();
        }
      },
      openNames() {
        this.$nextTick(() => {
          this.$refs['side-menu'].updateOpened();
        });
      },
    },
    methods: {
      findPath(permission) {
        this.path = this.recursionPath(this.menus, permission);
        EventBus.$emit('side-menu-on-select', this.path);
        this.$emit('on-select', this.path);
      },
      findOpenNames() {
        for (let i = 0; i < this.path.length; i += 1) {
          const menu = this.path[i];
          if (menu.type === this.resourceTypes.DIRECTORY) {
            if (!this.inArray(this.openNames, menu.permission)) {
              this.openNames.push(menu.permission);
            }
          }
          if (menu.type === this.resourceTypes.MENU) {
            this.activeName = menu.permission;
          }
        }
      },
      recursionPath(menus, permission) {
        let path = [];
        for (let i = 0; i < menus.length; i += 1) {
          const menu = menus[i];
          if (menu.permission === permission) {
            path.push(menu);
            break;
          } else if (menu.children.length > 0) {
            path = this.recursionPath(menu.children, permission);
            if (path.length > 0) {
              path.unshift(menu);
              break;
            }
          }
        }
        return path;
      },
      inArray(array, value) {
        let result = false;
        for (let i = 0; i < array.length; i += 1) {
          if (array[i] === value) {
            result = true;
            break;
          }
        }
        return result;
      },
      handleSelect(url) {
        this.$router.push(url);
      },
    },
    mounted() {
      Vue.axios.get('/js/menu.json')
        .then((result) => {
          this.menus = result.data.data;
          this.menus.forEach((item, index) => {
            this.menus[index].collapseName = item.name.substring(0, 2);
          });
          console.log(this.menus);
        })
        .finally(() => {
          const permission = this.$route.meta.permission;
          if (permission !== undefined) {
            this.findPath(permission);
            this.findOpenNames();
          }
        });
    },
  };
</script>

<style scoped>
  .menu-collapsed {
    padding-top: 10px;
  }
  .menu-collapsed .ivu-dropdown{
    width: 100%;
  }
  .menu-collapsed .ivu-dropdown-rel a{
    width: 100%;
  }
  .menu-collapsed .ivu-tooltip{
    width: 100%;
  }
  .menu-collapsed .ivu-tooltip-rel{
    width: 100%;
  }
  .menu-collapsed .ivu-tooltip-popper .ivu-tooltip-content .ivu-tooltip-arrow{
    border-right-color: #fff;
  }
  .menu-collapsed .ivu-tooltip-popper .ivu-tooltip-content .ivu-tooltip-inner{
    background: #fff;
    color: #495060;
  }
  a.drop-menu-a{
    display: inline-block;
    width: 100%;
    text-align: center;
    color: white;
    font-size: 14px;
    padding: 14px 24px;
    cursor: pointer;
  }
</style>
