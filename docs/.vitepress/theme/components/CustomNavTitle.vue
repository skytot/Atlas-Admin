<template>
  <div class="custom-nav-title">
    <div class="title-section">
      <h1 class="main-title">Atlas Admin Docs</h1>
      <p class="sub-title">大型管理平台脚手架</p>
    </div>
    <div class="logo-section">
      <img 
        :src="logoSrc" 
        :alt="logoAlt" 
        class="nav-logo"
        @error="handleLogoError"
      />
    </div>
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
  event.target.style.display = 'none'
}
</script>

<style scoped>
.custom-nav-title {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.main-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
}

.sub-title {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
  margin-top: 2px;
  color: var(--vp-c-text-2);
  transition: color 0.3s ease;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-logo {
  height: 40px;
  width: auto;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.nav-logo:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-nav-title {
    gap: 12px;
  }
  
  .nav-logo {
    height: 32px;
  }
  
  .main-title {
    font-size: 16px;
  }
  
  .sub-title {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .custom-nav-title {
    gap: 8px;
  }
  
  .nav-logo {
    height: 28px;
  }
  
  .main-title {
    font-size: 14px;
  }
  
  .sub-title {
    font-size: 10px;
  }
}
</style>
