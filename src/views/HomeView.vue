<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { spacing, typography, colors, shadows, radii, animations, focusRings } from '@/design/tokens'
import { PhPencilLine, PhDatabase, PhGlobe } from "@phosphor-icons/vue"

const note = ref({
    title: localStorage.getItem('public-note-title') || '',
    content: localStorage.getItem('public-note-content') || ''
})

let debounceTimer = null

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
        <div class="hero">
            <div class="hero-content">
                <h1 class="title">Write with clarity.<br />Share with simplicity.</h1>
                <p class="subtitle">A minimalist note-taking app for focused writing and seamless sharing.</p>
                <button v-if="!auth.isAuthenticated" @click="handleLogin" class="login-btn">
                    Get Started
                </button>
                <button v-else class="login-btn" @click="router.push('/notes')">
                    Go to Notes
                </button>
            </div>
        </div>

        <div class="editor-section">
            <div class="notepad">
                <input v-model="note.title" @input="saveToLocalStorage" type="text" placeholder="Note title..."
                    class="title-input" />
                <textarea v-model="note.content" @input="saveToLocalStorage" placeholder="Start writing..."
                    class="content-input" />
            </div>
            <div class="features">
                <div class="feature">
                    <PhPencilLine :size="32" class="feature-icon" />
                    <h3>Distraction-Free Writing</h3>
                    <p>Focus on your thoughts with our clean, minimal interface.</p>
                </div>
                <div class="feature">
                    <PhDatabase :size="32" class="feature-icon" />
                    <h3>Auto-Saving</h3>
                    <p>Never lose your work with automatic local storage.</p>
                </div>
                <div class="feature">
                    <PhGlobe :size="32" class="feature-icon" />
                    <h3>Share Instantly</h3>
                    <p>One click to share your notes with the world.</p>
                </div>
            </div>
        </div>

        <div class="background-animation">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>
        </div>
    </div>
</template>

<style scoped>
.home {
    min-height: 100vh;
    background: v-bind('colors.neutral[100]');
    overflow: hidden;
    position: relxative;
    z-index: 1;
}

.hero {
    padding: v-bind('spacing["2xl"]') v-bind('spacing.xl');
    text-align: center;
    background: linear-gradient(to bottom, white, v-bind('colors.neutral[100]'));
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    color: v-bind('colors.neutral[800]');
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: v-bind('typography.lineHeights.tight');
    margin-bottom: v-bind('spacing.lg');
}

.subtitle {
    font-size: v-bind('typography.sizes.lg');
    color: v-bind('colors.neutral[500]');
    margin-bottom: v-bind('spacing.xl');
    line-height: v-bind('typography.lineHeights.relaxed');
}

.login-btn {
    padding: v-bind('spacing.md') v-bind('spacing.xl');
    background-color: v-bind('colors.neutral[800]');
    color: white;
    border: none;
    border-radius: v-bind('radii.md');
    font-size: v-bind('typography.sizes.lg');
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.login-btn:hover {
    background-color: v-bind('colors.neutral[700]');
}

.login-btn:active {
    background-color: v-bind('colors.neutral[900]');
}

.editor-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: v-bind('spacing.xl');
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: v-bind('spacing.xl');
}

.notepad {
    background: white;
    border-radius: v-bind('radii.lg');
    box-shadow: v-bind('shadows.lg');
    padding: v-bind('spacing.xl');
    border: 1px solid v-bind('colors.neutral[200]');
}

.title-input {
    width: 100%;
    border: none;
    background: transparent;
    font-size: v-bind('typography.sizes.xl');
    font-weight: 500;
    margin-bottom: v-bind('spacing.lg');
    padding: v-bind('spacing.md');
    color: v-bind('colors.neutral[800]');
    border-radius: v-bind('radii.base');
    transition: v-bind('animations.transitions.smooth');
}

.title-input:focus {
    outline: none;
    background: v-bind('colors.neutral[50]');
    box-shadow: v-bind('focusRings.base');
}

.content-input {
    width: 100%;
    min-height: 400px;
    border: none;
    background: transparent;
    resize: vertical;
    font-family: v-bind('typography.fonts.sans');
    font-size: v-bind('typography.sizes.base');
    line-height: v-bind('typography.lineHeights.relaxed');
    color: v-bind('colors.neutral[600]');
    padding: v-bind('spacing.md');
    border-radius: v-bind('radii.base');
    transition: v-bind('animations.transitions.smooth');
}

.content-input:focus {
    outline: none;
    background: v-bind('colors.neutral[50]');
    box-shadow: v-bind('focusRings.base');
}

.title-input::placeholder,
.content-input::placeholder {
    color: v-bind('colors.neutral[400]');
}

.features {
    display: flex;
    flex-direction: column;
    gap: v-bind('spacing.xl');
    padding: v-bind('spacing.md')
}

.feature {
    text-align: left;
}

.feature-icon {
    fill: v-bind('colors.neutral[600]');
    margin-bottom: v-bind('spacing.sm');
}

.feature h3 {
    font-size: v-bind('typography.sizes.lg');
    font-weight: 500;
    margin-bottom: v-bind('spacing.sm');
    color: v-bind('colors.neutral[700]');
}

.feature p {
    color: v-bind('colors.neutral[500]');
    font-size: v-bind('typography.sizes.base');
    line-height: v-bind('typography.lineHeights.relaxed');
}

/* Background Animation */
.background-animation {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
    opacity: 0.6;
}

.blob {
    position: absolute;
    background: linear-gradient(45deg,
            v-bind('colors.primary[100]'),
            v-bind('colors.primary[200]'));
    filter: blur(40px);
    border-radius: 100px;
    animation: float 20s infinite;
}

.blob-1 {
    width: 400px;
    height: 400px;
    top: -200px;
    right: -100px;
    animation-delay: -2s;
}

.blob-2 {
    width: 300px;
    height: 300px;
    bottom: -150px;
    left: -150px;
    animation-delay: -5s;
}

.blob-3 {
    width: 200px;
    height: 200px;
    bottom: 200px;
    right: 300px;
    animation-delay: -7s;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .editor-section {
        grid-template-columns: 1fr;
        max-width: 800px;
    }

    .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: v-bind('spacing.lg');
    }
}

@media (max-width: 768px) {
    .hero {
        padding: v-bind('spacing.xl') v-bind('spacing.md');
    }

    .title {
        font-size: clamp(1.5rem, 4vw, 2.5rem);
    }

    .editor-section {
        padding: v-bind('spacing.xl') v-bind('spacing.md');
    }

    .notepad {
        padding: v-bind('spacing.md');
    }
}

@media (max-width: 480px) {
    .features {
        grid-template-columns: 1fr;
    }

    .feature {
        text-align: center;
    }
}

/* Animations */
.hero-content {
    animation: slideUp 1s ease-out;
}

.feature {
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}

.feature:nth-child(1) {
    animation-delay: 0.2s;
}

.feature:nth-child(2) {
    animation-delay: 0.4s;
}

.feature:nth-child(3) {
    animation-delay: 0.6s;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes float {
    0% {
        transform: translate(0, 0) rotate(0deg);
    }

    33% {
        transform: translate(30px, -30px) rotate(120deg);
    }

    66% {
        transform: translate(-20px, 20px) rotate(240deg);
    }

    100% {
        transform: translate(0, 0) rotate(360deg);
    }
}
</style>