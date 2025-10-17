<template>
  <div class="hero-logo">
    <img 
      :src="logoSrc" 
      :alt="logoAlt" 
      class="hero-logo-image"
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
  console.warn('Hero Logo 加载失败，使用默认图标')
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
.hero-logo {
  width: 280px;
  height: 280px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  padding: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-logo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(135deg, #3eaf7c, #2fa46d, #21925d);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: xor;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
}

.hero-logo:hover {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
}

.hero-logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 16px;
  display: block;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.hero-logo:hover .hero-logo-image {
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
}

/* 深色主题下的样式 */
.dark .hero-logo {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dark .hero-logo::before {
  background: linear-gradient(135deg, #3eaf7c, #2fa46d, #21925d);
}

.dark .hero-logo:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .hero-logo {
    width: 240px;
    height: 240px;
  }
}

@media (max-width: 960px) {
  .hero-logo {
    width: 200px;
    height: 200px;
    padding: 16px;
  }
}

@media (max-width: 640px) {
  .hero-logo {
    width: 160px;
    height: 160px;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .hero-logo {
    width: 140px;
    height: 140px;
    padding: 10px;
  }
}
</style>
