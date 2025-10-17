<template>
  <div class="VPHome">
    <div class="container">
      <div class="main">
        <h1 class="name">{{ hero.name }}</h1>
        <p class="text">{{ hero.text }}</p>
        <p class="tagline">{{ hero.tagline }}</p>
        <div class="actions">
          <a
            v-for="action in hero.actions"
            :key="action.text"
            :href="action.link"
            :class="['VPButton', action.theme]"
          >
            {{ action.text }}
          </a>
        </div>
      </div>
      <div class="image">
        <HeroLogo />
      </div>
    </div>
    
    <div v-if="features" class="features">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="feature"
      >
        <h2>{{ feature.title }}</h2>
        <p>{{ feature.details }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import HeroLogo from './HeroLogo.vue'

const { frontmatter } = useData()

const hero = frontmatter.value.hero
const features = frontmatter.value.features
</script>

<style scoped>
.VPHome {
  padding: 0;
}

.container {
  display: flex;
  align-items: center;
  gap: 3rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 40vh;
}

.main {
  flex: 1;
  max-width: 600px;
}

.image {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.name {
  background: linear-gradient(120deg, #3ddcff, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 0.8rem;
}

.text {
  font-weight: 800;
  font-size: 1.3rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.8rem;
}

.tagline {
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.VPButton {
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
  border-radius: 6px;
  text-decoration: none;
}

.VPButton.brand {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
}

.VPButton.brand:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(62, 175, 124, 0.3);
}

.VPButton.alt {
  background: transparent;
  border: 2px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.VPButton.alt:hover {
  background: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(62, 175, 124, 0.2);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature {
  text-align: center;
}

.feature h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: var(--vp-c-text-1);
}

.feature p {
  color: var(--vp-c-text-2);
  line-height: 1.5;
  font-size: 0.9rem;
}

/* 深色主题下的样式 */
.dark .name {
  background: linear-gradient(120deg, #3ddcff, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .tagline {
  color: var(--vp-c-text-2);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .container {
    gap: 3rem;
  }
  
  .name {
    font-size: 3rem;
  }
}

@media (max-width: 960px) {
  .container {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 1.5rem;
    min-height: 35vh;
  }
  
  .main {
    max-width: none;
  }
  
  .name {
    font-size: 2.2rem;
  }
  
  .text {
    font-size: 1.1rem;
  }
  
  .features {
    padding: 1.5rem;
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 1rem;
    min-height: 30vh;
  }
  
  .name {
    font-size: 1.8rem;
  }
  
  .text {
    font-size: 1rem;
  }
  
  .actions {
    justify-content: center;
  }
  
  .features {
    padding: 1rem;
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
  
  .feature h2 {
    font-size: 1.1rem;
  }
  
  .feature p {
    font-size: 0.85rem;
  }
}
</style>
