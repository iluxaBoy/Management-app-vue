<script setup lang="ts">
import ProjectComponent from '@/components/projectView/ProjectComponent.vue'
import { ref } from 'vue'

const projectId = ref<number>(0)

const project = (id: number) => {
  projectId.value = id
}
</script>

<template>
  <h1>Project ID: {{ projectId }}</h1>
  <ProjectComponent @project="project" />
</template>

<style lang="scss" scoped></style>
