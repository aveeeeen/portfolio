<script setup lang="ts">
const isMenuShown = ref(true);

function closeModal() {
  if (isMenuShown.value) {
    isMenuShown.value = false;
  }
}
</script>

<template>
  <div class="flex-vert center- width-guard" @click="closeModal">
    <div class="content-box flex-vert center-">
      <div class="snippet-header">
        <div class="path-like">
          <Skeleton class="path-skeleton" />
        </div>
        <Skeleton class="date-skeleton" />
      </div>
      <main>
        <div class="article-box">
          <Skeleton class="iframe-skeleton" />
        </div>
      </main>
    </div>
  </div>
  <div class="bottom"></div>
  <Footer></Footer>
  <Nav :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
    <Menu></Menu>
  </Nav>
</template>

<style scoped>
.snippet-header {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: var(--space-m) 0;
  width: 100%;
  border-bottom: solid 2px var(--text-color);
}

.path-like {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: var(--space-xs);
  width: 100%;
}

.path-skeleton {
  width: 50%;
  height: 1.5rem;
  border-radius: 6px;
}

.date-skeleton {
  width: 25%;
  height: 1rem;
  border-radius: 6px;
}

main {
  position: relative;
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
  max-width: 800px;
}

.iframe-skeleton {
  width: 100%;
  height: 60svh;
  border-radius: 6px;
  margin-bottom: 30px;
}

.paragraph-skeleton {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 30px;
}

.line-skeleton {
  width: 100%;
  height: 1.2rem;
  border-radius: 6px;
}

.line-skeleton.long {
  width: 95%;
}

.line-skeleton.medium {
  width: 80%;
}

.line-skeleton.short {
  width: 55%;
}

@media (max-width: 800px) {
  .path-skeleton {
    width: 75%;
  }

  .date-skeleton {
    width: 40%;
  }
}
</style>
