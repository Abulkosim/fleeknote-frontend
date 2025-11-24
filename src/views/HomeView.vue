<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { spacing, typography, colors, radii, animations } from '@/design/tokens'
import { PhPencilLine, PhRocket, PhSparkle } from "@phosphor-icons/vue"

const note = ref({
    title: localStorage.getItem('public-note-title') || '',
    content: localStorage.getItem('public-note-content') || ''
})

let debounceTimer: number | null = null

const auth = useAuthStore()
const router = useRouter()

function saveToLocalStorage() {
    if (debounceTimer) clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
        localStorage.setItem('public-note-title', note.value.title)
        localStorage.setItem('public-note-content', note.value.content)
    }, 1000)
}

function handleLogin() {
    router.push('/login')
}

watch(note, saveToLocalStorage, { deep: true })
</script>

<template>
    <div class="home">
        <section class="hero">
            <div class="hero-content">
                <div class="hero-text">
                    <h1 class="hero-title">
                        <span class="title-line">Write with clarity</span>
                    </h1>
                    <p class="hero-subtitle">
                        A modern workspace for your thoughts.
                        <br>
                        Simple, fast, and beautifully designed.
                    </p>
                    <div class="cta-section">
                        <button v-if="!auth.isAuthenticated" @click="handleLogin" class="cta-button primary">
                            Start writing for free
                        </button>
                        <button v-else class="cta-button primary" @click="router.push('/notes')">
                            Open workspace
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section class="demo-section">
            <div class="demo-container">
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon-wrapper">
                            <PhPencilLine :size="24" class="feature-icon" />
                        </div>
                        <h3 class="feature-title">Distraction-free</h3>
                        <p class="feature-description">Clean interface that gets out of your way</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon-wrapper">
                            <PhRocket :size="24" class="feature-icon" />
                        </div>
                        <h3 class="feature-title">Lightning fast</h3>
                        <p class="feature-description">Instant saving and seamless performance</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon-wrapper">
                            <PhSparkle :size="24" class="feature-icon" />
                        </div>
                        <h3 class="feature-title">Share easily</h3>
                        <p class="feature-description">One click to share with the world</p>
                    </div>
                </div>

                <div class="demo-content">
                    <div class="demo-editor">
                        <div class="editor-header">
                            <div class="editor-controls">
                                <div class="control-dot"></div>
                                <div class="control-dot"></div>
                                <div class="control-dot"></div>
                            </div>
                        </div>
                        <div class="editor-body">
                            <input 
                                v-model="note.title" 
                                @input="saveToLocalStorage" 
                                type="text" 
                                placeholder="Untitled" 
                                class="demo-title"
                            />
                            <textarea 
                                v-model="note.content" 
                                @input="saveToLocalStorage" 
                                placeholder="Start writing..."
                                class="demo-content"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.home {
    min-height: 100vh;
    background: white;
    position: relative;
}

.hero {
    padding: calc(2 * v-bind('spacing["2xl"]')) 0;
    background: linear-gradient(180deg, #fafafa 0%, white 100%);
}

.hero-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 v-bind('spacing.xl');
    text-align: center;
}

.hero-text {
    max-width: 640px;
    margin: 0 auto;
    animation: fadeInUp 0.8s ease-out;
}

.hero-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 700;
    line-height: v-bind('typography.lineHeights.tight');
    margin-bottom: v-bind('spacing.lg');
    letter-spacing: -0.03em;
}

.title-line {
    display: block;
    color: v-bind('colors.neutral[900]');
}

.hero-subtitle {
    font-size: v-bind('typography.sizes.xl');
    color: v-bind('colors.neutral[600]');
    line-height: v-bind('typography.lineHeights.relaxed');
    margin-bottom: v-bind('spacing["2xl"]');
    font-weight: 400;
}

.cta-section {
    animation: fadeInUp 0.8s ease-out 0.2s both;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    padding: v-bind('spacing.md') v-bind('spacing["2xl"]');
    font-size: v-bind('typography.sizes.lg');
    font-weight: 600;
    border-radius: v-bind('radii.md');
    border: none;
    cursor: pointer;
    transition: v-bind('animations.transitions.smooth');
    text-decoration: none;
}

.cta-button.primary {
    background: v-bind('colors.neutral[900]');
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cta-button.primary:hover {
    background: v-bind('colors.neutral[800]');
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.cta-button.primary:active {
    transform: translateY(-1px);
}

.demo-section {
    padding: 0 0 v-bind('spacing["2xl"]');
    background: white;
}

.demo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 v-bind('spacing.xl');
}

.demo-content {
    margin-top: v-bind('spacing["2xl"]');
    animation: fadeInUp 0.8s ease-out 0.4s both;
}

.demo-editor {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border: 1px solid v-bind('colors.neutral[200]');
    border-radius: v-bind('radii.lg');
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    transition: v-bind('animations.transitions.smooth');
}

.demo-editor:hover {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}

.editor-header {
    padding: v-bind('spacing.md') v-bind('spacing.lg');
    background: v-bind('colors.neutral[50]');
    border-bottom: 1px solid v-bind('colors.neutral[200]');
}

.editor-controls {
    display: flex;
    gap: v-bind('spacing.sm');
}

.control-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: v-bind('colors.neutral[300]');
    transition: v-bind('animations.transitions.base');
}

.control-dot:first-child {
    background: #ff5f57;
}

.control-dot:nth-child(2) {
    background: #ffbd2e;
}

.control-dot:nth-child(3) {
    background: #28ca42;
}

.editor-body {
    padding: v-bind('spacing["2xl"]');
}

.demo-title {
    width: 100%;
    border: none;
    background: transparent;
    font-size: v-bind('typography.sizes["2xl"]');
    font-weight: 700;
    color: v-bind('colors.neutral[900]');
    margin-bottom: v-bind('spacing.lg');
    line-height: v-bind('typography.lineHeights.tight');
}

.demo-title:focus {
    outline: none;
}

.demo-title::placeholder {
    color: v-bind('colors.neutral[400]');
    font-weight: 400;
}

.demo-content {
    width: 100%;
    min-height: 300px;
    border: none;
    background: transparent;
    font-family: v-bind('typography.fonts.sans');
    font-size: v-bind('typography.sizes.lg');
    line-height: v-bind('typography.lineHeights.relaxed');
    color: v-bind('colors.neutral[700]');
    resize: none;
}

.demo-content:focus {
    outline: none;
}

.demo-content::placeholder {
    color: v-bind('colors.neutral[400]');
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: v-bind('spacing.xl');
}

.feature-card {
    padding: v-bind('spacing.xl');
    background: white;
    border: 1px solid v-bind('colors.neutral[200]');
    border-radius: v-bind('radii.lg');
    text-align: center;
    transition: v-bind('animations.transitions.smooth');
    animation: fadeInUp 0.6s ease-out both;
}

.feature-card:nth-child(1) {
    animation-delay: 0.6s;
}

.feature-card:nth-child(2) {
    animation-delay: 0.7s;
}

.feature-card:nth-child(3) {
    animation-delay: 0.8s;
}

.feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    border-color: v-bind('colors.neutral[300]');
}

.feature-icon-wrapper {
    width: 56px;
    height: 56px;
    margin: 0 auto v-bind('spacing.lg');
    display: flex;
    align-items: center;
    justify-content: center;
    background: v-bind('colors.neutral[100]');
    border-radius: v-bind('radii.lg');
    transition: v-bind('animations.transitions.smooth');
}

.feature-card:hover .feature-icon-wrapper {
    background: v-bind('colors.neutral[200]');
    transform: scale(1.1);
}

.feature-icon {
    color: v-bind('colors.neutral[600]');
    transition: v-bind('animations.transitions.smooth');
}

.feature-card:hover .feature-icon {
    color: v-bind('colors.neutral[800]');
}

.feature-title {
    font-size: v-bind('typography.sizes.xl');
    font-weight: 600;
    color: v-bind('colors.neutral[900]');
    margin-bottom: v-bind('spacing.sm');
}

.feature-description {
    font-size: v-bind('typography.sizes.lg');
    color: v-bind('colors.neutral[600]');
    line-height: v-bind('typography.lineHeights.relaxed');
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .hero {
        padding: v-bind('spacing.xl') 0;
    }
    
    .hero-content,
    .demo-container {
        padding: 0 v-bind('spacing.md');
    }
    
    .hero-title {
        font-size: clamp(2rem, 8vw, 3rem);
    }
    
    .hero-subtitle {
        font-size: v-bind('typography.sizes.lg');
    }
    
    .demo-section {
        padding: v-bind('spacing.xl') 0;
    }
    
    .editor-body {
        padding: v-bind('spacing.lg');
    }
    
    .features-grid {
        grid-template-columns: 1fr;
        gap: v-bind('spacing.lg');
    }
    
    .feature-card {
        padding: v-bind('spacing.lg');
    }
}

@media (max-width: 480px) {
    .cta-button {
        padding: v-bind('spacing.md') v-bind('spacing.xl');
        font-size: v-bind('typography.sizes.base');
    }
    
    .demo-title {
        font-size: v-bind('typography.sizes.xl');
    }
    
    .demo-content {
        font-size: v-bind('typography.sizes.base');
    }
}
</style>