<template>
  <Dropdown ref="dropdown" @on-click="handleClick"
              :placement="placement">
    <a class="drop-menu-a" type="text"
       :class="{'firstClass': firstClass, 'secondClass': endClass}"
       @mouseover="handleMousemove($event, children)">
      <span v-if="firstClass">
          {{ children.name.substring(0, 2) }}
      </span>
      <span v-else>
          {{ children.name }}
      </span>
    </a>
    <DropdownMenu ref="dropdown" slot="list">
      <template v-for="menu in children.children">
        <collapsed-menu v-if="menu.type === resourceTypes.DIRECTORY"
                        :endClass=true
                        :children="menu" :key="menu.id"></collapsed-menu>
        <DropdownItem v-else-if="menu.type === resourceTypes.MENU"
                         :key="menu.id" :name="menu.url">
          <span class="menu-title">{{menu.name}}</span>
        </DropdownItem>
      </template>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
  import { ResourceTypeConstant } from '../auth/const';
  export default {
    name: "collapsedMenu",
    props: {
      children: {},
      firstClass: Boolean,
      endClass: Boolean,
    },
    data() {
      return {
        placement: 'right-end',
        resourceTypes: ResourceTypeConstant,
      };
    },
    methods: {
      handleClick(name) {
        this.$emit('on-click', name);
      },
      handleMousemove(event, children) {
        const { pageY } = event;
        const height = children.length * 38;
        const isOverflow = pageY + height < window.innerHeight;
        this.placement = isOverflow ? 'right-start' : 'right-end';
      },
    },
    mounted() {
      console.log(this.firstClass);
    }
  };
</script>

<style scoped>
  a.drop-menu-a{
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 14px;
    padding: 14px 24px;
    cursor: pointer;
  }
  a.firstClass{
    color: white !important;
  }
  a.secondClass {
    margin: 0;
    line-height: normal;
    padding: 7px 16px;
    clear: both;
    color: #515a6e !important;
    font-size: 12px!important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    transition: background .2s ease-in-out;
  }
  .mainMenu a.drop-menu-a{
    color: white;
  }
  .menu-title{
    padding-left: 6px;
  }
  .ivu-dropdown .ivu-select-dropdown {
    width: auto!important;
  }
</style>
