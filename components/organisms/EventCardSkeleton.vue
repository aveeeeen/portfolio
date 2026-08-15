<template>
  <div class="event-post">
    <div class="event-content">
      <Skeleton class="h1-skelton"></Skeleton>
      <div class="event-details">
        <Skeleton class="h3-skelton"></Skeleton>
        <Skeleton class="h3-skelton"></Skeleton>
      </div>
    </div>
    <Skeleton class="img-skelton"></Skeleton>
  </div>
</template>

<style scoped>
.h1-skelton {
  height: 1.8rem;
  width: 240px;
  max-width: 100%;
  border-radius: 10px;
}

.h3-skelton {
  height: 1rem;
  width: 120px;
  border-radius: 10px;
}

.img-skelton {
  width: 100%;
  height: 25svh;
  box-sizing: border-box;
  border-radius: 20px;
}

.event-post {
  width: 100%;
  max-width: 1000px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  box-sizing: border-box;
}

.event-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 60px;
  padding: 16px 4px;
  box-sizing: border-box;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

@media (max-width: 800px) {
  .event-content {
    flex-direction: column;
    justify-content: flex-start;
    gap: 16px;
  }
}
</style>
