<template>
  <div class="theme-logo">
    <img 
      :src="logoSrc" 
      :alt="logoAlt" 
      class="logo-image"
      @error="handleLogoError"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

const logoSrc = computed(() => {
  return isDark.value ? '/logo-dark.svg' : '/logo.svg'
})

const logoAlt = 'Atlas Admin'

const handleLogoError = (event) => {
  console.warn('Logo 加载失败，使用默认图标')
  // 如果深色主题 logo 加载失败，尝试使用浅色主题 logo
  if (isDark.value && event.target.src.includes('logo-dark.svg')) {
    event.target.src = '/logo.svg'
  }
  // 如果浅色主题 logo 加载失败，尝试使用深色主题 logo
  else if (!isDark.value && event.target.src.includes('logo.svg')) {
    event.target.src = '/logo-dark.svg'
  }
}
</script>

<style scoped>
.theme-logo {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background: transparent;
  padding: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-logo:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 16px;
  display: block;
  transition: all 0.3s ease;
}

/* 深色主题下的样式 */
.dark .theme-logo {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.dark .theme-logo:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

/* 响应式设计 */
@media (max-width: 960px) {
  .theme-logo {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 640px) {
  .theme-logo {
    width: 120px;
    height: 120px;
  }
}
</style>
