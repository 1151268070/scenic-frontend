<template>
  <div class="navigation">
    <div class="move-box">
      <Button size="small" type="text" icon="ios-arrow-back" @click="moveLeft"></Button>
    </div>
    <div class="more-box">
      <Dropdown @on-click="handleMoreClick" placement="bottom-start">
        <Button size="small" type="text" icon="ios-more"></Button>
        <DropdownMenu slot="list" v-if="leftMoreNavs.length > 0">
          <DropdownItem v-for="nav in leftMoreNavs"
                           :key="nav.name"
                           :name="nav.name">
            <span class="ivu-tag-dot-inner" :class="{ 'dot-primary': nav.isOpen }"></span>
            {{ nav.title }}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="scroll-box" ref="scrollBox">
      <div class="tabs" ref="tabs" :style="{ left: tabsLeft + 'px' }">
        <Tag type="dot"
               v-for="(nav, index) in navs"
               :key="nav.name"
               :name="nav.name"
               :color="nav.isOpen ? 'primary' : 'default'"
               :closable="nav.name !== defaultName"
               @click.native="click(index)"
               @on-close="close(nav)"
               ref="navs">
          {{ nav.title }}
        </Tag>
      </div>
    </div>
    <div class="controls">
      <Dropdown @on-click="handleControls">
        <Button size="small" type="text" icon="ios-close-circle-outline"></Button>
        <DropdownMenu slot="list">
          <DropdownItem name="close-all">关闭所有</DropdownItem>
          <DropdownItem name="close-others">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="move-box move-right-box">
      <Button size="small" type="text" icon="ios-arrow-forward" @click="moveRight"></Button>
    </div>
    <div class="more-box more-right-box">
      <Dropdown @on-click="handleMoreClick" placement="bottom-end">
        <Button size="small" type="text" icon="ios-more"></Button>
        <DropdownMenu slot="list" v-if="rightMoreNavs.length > 0">
          <DropdownItem v-for="nav in rightMoreNavs"
                           :key="nav.name"
                           :name="nav.name">
            <span class="ivu-tag-dot-inner" :class="{ 'dot-primary': nav.isOpen }"></span>
            {{ nav.title }}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
  const LOCAL_DATA_KEY = 'wms.navigation.data';
  export default {
    name: "NavigationV2",
    data() {
      return {
        defaultName: 'Home',
        navs: [],
        leftMoreNavs: [],
        rightMoreNavs: [],
        tabsLeft: 0,
        moveStep: 3,
      };
    },
    watch: {
      $route(to, from) {
        this.handle(from, to);
      },
      tabsLeft() {
        this.findMoreNavs();
      },
    },
    methods: {
      handle(from, to) {
        let fromRoute = from;
        let toRoute = to;
        if (toRoute === undefined) {
          toRoute = from;
          fromRoute = undefined;
        }
        if (toRoute.meta.navDisable !== undefined && toRoute.meta.navDisable) {
          return;
        }
        this.handleFrom(fromRoute);
        this.handleTo(toRoute);
        this.storageNavs();
        this.$nextTick(() => {
          this.handlePosition();
          if (fromRoute === undefined) {
            this.findMoreNavs();
          }
        });
      },
      handleFrom(route) {
        if (route === undefined) {
          return;
        }
        const nav = this.getNavIfExists(route.name);
        if (nav === undefined) {
          return;
        }
        if (nav.autoClose !== undefined && nav.autoClose) {
          for (let i = 0; i < this.navs.length; i += 1) {
            if (this.navs[i].name === nav.name) {
              this.navs.splice(i, 1);
              break;
            }
          }
        }
      },
      handleTo(route) {
        let nav = this.getNavIfExists(route.name);
        if (nav === undefined) {
          nav = this.getNavFromRoute(route);
          this.navs.push(nav);
        }
        this.navs.forEach((value, key) => {
          this.navs[key].isOpen = false;
        });
        nav.isOpen = true;
      },
      handlePosition() {
        const box = this.$refs.scrollBox;
        const tabs = this.$refs.tabs;
        if (box.offsetWidth > tabs.offsetWidth) {
          this.tabsLeft = 0;
          return;
        }

        const index = this.getOpenIndex();
        const tab = this.$refs.navs[index].$el;
        const tabPosition = tab.offsetWidth + tab.offsetLeft + this.tabsLeft + 5;
        if (tabPosition > box.offsetWidth) {
          this.tabsLeft -= (tabPosition - box.offsetWidth);
        } else if (tabPosition < tab.offsetWidth) {
          this.tabsLeft = 5 - tab.offsetLeft;
        }
      },
      handleMoreClick(name) {
        const openNav = this.getOpenNav();
        if (openNav.name === name) {
          this.handlePosition();
          return;
        }
        this.open(name);
      },
      click(index) {
        const nav = this.navs[index];
        if (nav.isOpen) {
          return;
        }
        this.open(nav.name);
      },
      close(nav) {
        this.navs = this.navs.filter(value => nav.name !== value.name);
        if (nav.isOpen) {
          this.open(this.defaultName);
        }
      },
      open(name) {
        this.$router.push({ name });
      },
      handleControls(name) {
        if (name === 'close-all') {
          this.closeAll();
        } else {
          this.closeOthers();
        }
        this.storageNavs();
      },
      moveLeft() {
        const box = this.$refs.scrollBox;
        const tabs = this.$refs.tabs;
        if (box.offsetWidth > tabs.offsetWidth) {
          return;
        }

        const beginIndex = this.getLeftIndex();
        if (beginIndex === 0) {
          return;
        }

        let targetIndex = beginIndex - this.moveStep;
        targetIndex = targetIndex < 0 ? 0 : targetIndex;

        const tab = this.$refs.navs[targetIndex].$el;
        this.tabsLeft = 5 - tab.offsetLeft;
      },
      moveRight() {
        const box = this.$refs.scrollBox;
        const tabs = this.$refs.tabs;
        if (box.offsetWidth > tabs.offsetWidth) {
          return;
        }

        const lastIndex = this.navs.length - 1;
        const beginIndex = this.getRightIndex();
        if (beginIndex === lastIndex) {
          return;
        }

        let targetIndex = beginIndex + this.moveStep;
        targetIndex = targetIndex > lastIndex ? lastIndex : targetIndex;

        const tab = this.$refs.navs[targetIndex].$el;
        this.tabsLeft = box.offsetWidth - (tab.offsetLeft + tab.offsetWidth + 5);
      },
      closeAll() {
        this.navs = this.navs.filter(value => value.isDefault);
        const nav = this.getNavIfExists(this.defaultName);
        if (!nav.isOpen) {
          nav.isOpen = true;
          this.open(nav.name);
        }
        this.tabsLeft = 0;
      },
      closeOthers() {
        this.navs = this.navs.filter(value => value.isDefault || value.isOpen);
        this.tabsLeft = 0;
      },
      getNavIfExists(name) {
        let nav;
        for (let i = 0; i < this.navs.length; i += 1) {
          if (this.navs[i].name === name) {
            nav = this.navs[i];
            break;
          }
        }
        return nav;
      },
      getNavFromRoute(route) {
        return {
          name: route.name,
          title: route.meta.title,
          permission: route.meta.permission,
          isDefault: route.name === this.defaultName,
          autoClose: route.meta.navAutoClose,
          isOpen: false,
        };
      },
      getLeftIndex() {
        let index = 0;
        for (let i = 0; i < this.navs.length; i += 1) {
          const tab = this.$refs.navs[i].$el;
          const tabPosition = tab.offsetLeft + tab.offsetWidth + this.tabsLeft;
          if (tabPosition > tab.offsetWidth) {
            index = i;
            break;
          }
        }
        return index;
      },
      getRightIndex() {
        const box = this.$refs.scrollBox;
        let index = this.navs.length - 1;
        for (let i = index; i >= 0; i -= 1) {
          const tab = this.$refs.navs[i].$el;
          const tabPosition = tab.offsetLeft + tab.offsetWidth + this.tabsLeft;
          if (tabPosition < box.offsetWidth) {
            index = i;
            break;
          }
        }
        return index;
      },
      findMoreNavs() {
        const leftIndex = this.getLeftIndex();
        const rightIndex = this.getRightIndex();
        this.leftMoreNavs = this.navs.filter((value, index) => index < leftIndex);
        this.rightMoreNavs = this.navs.filter((value, index) => index > rightIndex);
      },
      setDefaultNav() {
        this.navs.push({
          name: this.defaultName,
          title: '仪表盘',
          permission: 'home',
          isDefault: true,
          autoClose: false,
          isOpen: true,
        });
      },
      getOpenIndex() {
        let index = 0;
        for (let i = 0; i < this.navs.length; i += 1) {
          if (this.navs[i].isOpen) {
            index = i;
            break;
          }
        }
        return index;
      },
      getOpenNav() {
        const index = this.getOpenIndex();
        return this.navs[index];
      },
      loadLocalData() {
        const data = localStorage.getItem(LOCAL_DATA_KEY);
        if (data == null) {
          return;
        }

        let navs;
        try {
          navs = JSON.parse(data);
        } catch (ignored) {
          return;
        }

        this.navs = navs;
      },
      storageNavs() {
        const data = JSON.stringify(this.navs);
        localStorage.setItem(LOCAL_DATA_KEY, data);
      },
    },
    mounted() {
      this.setDefaultNav();
      this.loadLocalData();
      setTimeout(() => {
        this.$nextTick(() => {
          this.handle(this.$route);
        });
      }, 1000);
    },
  };
</script>

<style scoped>
  .navigation {
    position: relative;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    height: 40px;
    clear: both;
  }
  .scroll-box {
    position: absolute;
    height: 38px;
    left: 60px;
    right: 90px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, .1) inset;
    white-space: nowrap;
    overflow: hidden;
    border-left: 1px solid #eeeeee;
    border-right: 1px solid #eeeeee;
  }
  .more-box, .move-box, .controls {
    margin-top: 8px;
  }
  .move-box, .more-box {
    float: left
  }
  .more-right-box, .move-right-box, .controls {
    float: right;
  }
  .tabs {
    position: absolute;
    display: inline-block;
    padding: 1px 5px 0;
    height: 38px;
    transition: left .6s ease;
  }
  .dot-primary {
    background: #2d8cf0;
  }
</style>
