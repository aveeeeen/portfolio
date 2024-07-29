<template>
  <div class="burger-circle">
    <div>
      <svg
        id="darkmode"
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
          <g id="darkmode-icon" fill-rule="evenodd">
            <path
              d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,20.5 L12,3.5 C16.6944204,3.5 20.5,7.30557963 20.5,12 C20.5,16.6944204 16.6944204,20.5 12,20.5 Z"
            ></path>
          </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
#darkmode {
  width: 2rem;
  height: 2rem;
  display: block;
}

#darkmode-icon{
  fill: var(--text-color);
}

.burger-circle {
  background-color: var(--ui-bg-color);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
