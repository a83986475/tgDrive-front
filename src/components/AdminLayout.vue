<!-- src/components/AdminLayout.vue -->
<template>
  <el-container class="app-container">
    <el-header class="header">
      <div class="header-logo">
        <div class="logo-container">
          <el-icon class="toggle-sidebar hidden-xs-only" @click="toggleSidebar">
            <Expand v-if="isCollapsed" />
            <Fold v-else />
          </el-icon>
          <el-icon class="logo-icon"><Monitor /></el-icon>
          <span class="logo-text hidden-xs-only" v-show="!isCollapsed">管理页面</span>
        </div>
      </div>
      <div class="header-actions">
        <el-icon class="toggle-mobile-sidebar hidden-sm-and-up" @click="isMobileSidebarOpen = true">
          <Fold />
        </el-icon>
        <el-dropdown @command="handleThemeCommand" trigger="click">
          <span class="el-dropdown-link">
            <el-icon :size="20"><component :is="themeIcon" /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="light" :icon="Sunny">亮色模式</el-dropdown-item>
              <el-dropdown-item command="dark" :icon="Moon">暗色模式</el-dropdown-item>
              <el-dropdown-item command="auto" :icon="Monitor">跟随系统</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown @command="handleUserCommand">
          <el-avatar
            class="user-avatar"
            :size="32"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="main-container">
      <!-- Desktop Sidebar -->
      <el-aside v-if="!isMobile" :width="isCollapsed ? '64px' : '220px'" class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleSelect"
          :collapse="isCollapsed"
          :collapse-transition="false"
        >
          <el-menu-item index="/home">
            <el-icon><HomeFilled /></el-icon>
            <template #title>首页</template>
          </el-menu-item>
          <el-menu-item index="/fileList">
            <el-icon><Folder /></el-icon>
            <template #title>文件列表</template>
          </el-menu-item>
          <el-menu-item index="/changePassword">
            <el-icon><EditPen /></el-icon>
            <template #title>修改密码</template>
          </el-menu-item>
          <el-menu-item index="/">
            <el-icon><Top /></el-icon>
            <template #title>上传文件</template>
          </el-menu-item>
          <el-menu-item index="/backup">
            <el-icon><Download /></el-icon>
            <template #title>备份数据库</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Mobile Sidebar Drawer -->
      <el-drawer
        v-if="isMobile"
        v-model="isMobileSidebarOpen"
        direction="ltr"
        :with-header="false"
        size="220px"
      >
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleSelectAndCloseDrawer"
          :collapse="false"
          :collapse-transition="false"
        >
          <el-menu-item index="/home">
            <el-icon><HomeFilled /></el-icon>
            <template #title>首页</template>
          </el-menu-item>
          <el-menu-item index="/fileList">
            <el-icon><Folder /></el-icon>
            <template #title>文件列表</template>
          </el-menu-item>
          <el-menu-item index="/changePassword">
            <el-icon><EditPen /></el-icon>
            <template #title>修改密码</template>
          </el-menu-item>
          <el-menu-item index="/">
            <el-icon><Top /></el-icon>
            <template #title>上传文件</template>
          </el-menu-item>
          <el-menu-item index="/backup">
            <el-icon><Download /></el-icon>
            <template #title>备份数据库</template>
          </el-menu-item>
        </el-menu>
      </el-drawer>

      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeFilled, Folder, Top, EditPen, Sunny, Moon, Expand, Fold, Download, Monitor, SwitchButton
} from '@element-plus/icons-vue'

type Theme = 'light' | 'dark' | 'auto'

const router = useRouter()
const route = useRoute()

const activeMenu = computed(() => route.path)
const isCollapsed = ref(false)
const theme = ref<Theme>('auto')
const isMobile = ref(false)
const isMobileSidebarOpen = ref(false)

const themeIcon = computed(() => {
  if (theme.value === 'light') return Sunny
  if (theme.value === 'dark') return Moon
  return Monitor
})

const applyTheme = () => {
  if (theme.value === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    document.documentElement.classList.toggle('dark', prefersDark.matches)
  } else {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
  }
}

const handleThemeCommand = (command: Theme) => {
  theme.value = command
  localStorage.setItem('theme', command)
  applyTheme()
}

const systemThemeChangeHandler = (e: MediaQueryListEvent) => {
  if (theme.value === 'auto') {
    document.documentElement.classList.toggle('dark', e.matches)
  }
}

let resizeTimer: ReturnType<typeof setTimeout> | null = null
const checkMobile = () => {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    isMobile.value = window.innerWidth < 768
    if (isMobile.value) {
      isCollapsed.value = true
    } else {
      const savedSidebarState = localStorage.getItem('sidebarState')
      isCollapsed.value = savedSidebarState === 'collapsed'
    }
  }, 150)
}

onMounted(() => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    const savedSidebarState = localStorage.getItem('sidebarState')
    isCollapsed.value = savedSidebarState === 'collapsed'
  } else {
    isCollapsed.value = true
  }

  window.addEventListener('resize', checkMobile)

  const savedTheme = localStorage.getItem('theme') as Theme | null
  theme.value = savedTheme || 'auto'
  applyTheme()

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', systemThemeChangeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
  if (resizeTimer) clearTimeout(resizeTimer)
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', systemThemeChangeHandler)
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebarState', isCollapsed.value ? 'collapsed' : 'expanded')
}

const handleUserCommand = (command: string) => {
  if (command === 'logout') {
    localStorage.removeItem('token')
    router.push('/login')
  }
}

const handleSelect = (index: string) => {
  router.push(index)
}

const handleSelectAndCloseDrawer = (index: string) => {
  handleSelect(index)
  isMobileSidebarOpen.value = false
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--container-bg-color);
  /* 删除 transition：主题切换不需要动画，避免触发全局重绘 */
}

.header-logo, .header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.toggle-sidebar {
  cursor: pointer;
  font-size: 20px;
}

.user-avatar {
  cursor: pointer;
}

.sidebar {
  background-color: var(--container-bg-color);
  border-right: 1px solid var(--border-color);
  overflow: hidden;
  /* 删除 transition: width，宽度动画会触发整个页面 reflow + repaint */
  will-change: width;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
}

.main-content {
  padding: 20px;
  background-color: var(--background-color);
  height: calc(100vh - 60px);
  overflow-y: auto;
}

/* 路由切换动画缩短至 0.15s */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hidden-xs-only {
  display: none !important;
}

.hidden-sm-and-up {
  display: none !important;
}

@media (max-width: 767px) {
  .hidden-xs-only {
    display: none !important;
  }
  .hidden-sm-and-up {
    display: flex !important;
  }

  .header {
    padding: 0 15px;
  }

  .header-logo .logo-text {
    display: none;
  }

  .toggle-mobile-sidebar {
    cursor: pointer;
    font-size: 20px;
    margin-right: 10px;
  }

  .main-content {
    padding: 10px;
  }
}
</style>
