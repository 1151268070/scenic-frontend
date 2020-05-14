<template>
  <div>
    <Layout class="layout-wrapper">
      <Sider hide-trigger
               class="sider"
               ref="side"
               collapsible
               :collapsed-width="78"
               v-model="collapsed">
        <side-menu :style="{overflow: 'scroll', height: '100vh'}"
                   :collapsed="collapsed"></side-menu>
      </Sider>
      <Layout class="layout-main">
        <Header :style="{paddingLeft: '0'}">
          <header-user-profile :collapsed="collapsed"
                               @on-change="handleCollpasedChange"></header-user-profile>
        </Header>
        <Breadcrumb class="breadcrumb">
          <BreadcrumbItem v-for="menu in crumb" :key="menu.permission">
            {{ menu.name }}
          </BreadcrumbItem>
        </Breadcrumb>
        <navigation></navigation>
        <Layout class="layout-content">
          <Content class="content-wrapper">
            <Card>
              <template slot="title">
                {{ $route.meta.title === undefined ? "" : $route.meta.title }}
              </template>
              <router-view/>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import SideMenu from './components/SideMenuV2';
  import HeaderUserProfile from './components/HeaderUserProfile';
  import Navigation from './components/NavigationV2';
  import EventBus from '../libs/EventBus';
  export default {
    name: "MainV2",
    data() {
      return {
        collapsed: false,
        value: 0,
        crumb: [],
      }
    },
    components: {
      SideMenu,
      HeaderUserProfile,
      Navigation
    },
    methods: {
      handleSideMenu(crumb) {
        this.crumb = crumb;
      },
      handleCollpasedChange(state) {
        this.collapsed = state;
      },
    },
    mounted() {
      EventBus.$on('side-menu-on-select', this.handleSideMenu);
    },
  };
</script>

<style scoped>
  .layout-wrapper {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }
  .layout-main {
    position: relative;
    background: #fff;
  }
  .layout-main .breadcrumb {
    margin: 10px 10px;
  }
  .layout-main .navigation .tabs {
    margin: 4px 0;
  }
  .layout-content {
    position: absolute;
    width: 100%;
    top: 146px;
    bottom: 0;
    overflow: hidden;
  }
  .content-wrapper {
    padding: 10px;
    overflow: scroll;
  }
</style>
