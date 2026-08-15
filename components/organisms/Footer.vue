<template>
  <div class="footer-area">
    <div class="footer-border"></div>
    <footer class="flex-vert center-">
      <div class="footer-box">
        <p>{{ new Date().getFullYear() }} Taichi Matsumoto, <span class="main-text">All rights are not reserved.</span>
          You can freely use, share, or
          modify any content with exception of the following.</p>
        <ol>
          <li>The content which is not made or owned by me.</li>
          <li>The usage is for malicious activities.</li>
        </ol>
        <div class="flex-hori gap-20 footer-links">
          <NuxtLink to="/">Know about who I am.</NuxtLink>
          <NuxtLink to="/works">Works</NuxtLink>
          <NuxtLink to="/events">Events</NuxtLink>
          <NuxtLink to="/notes">Notes and Blogs</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.footer-border {
  width: 100%;
  height: 2px;
  background-color: #aaa;
}

.page-end {
  width: 100svw;
}

.footer-box p {
  color: var(--text-color);
  font-size: 0.8rem;
  line-height: 1.5;
  font-weight: 200;
  color: #eee;
}

.footer-box li {
  color: #eee;
  font-size: 0.8rem;
  line-height: 1.5;
  font-weight: 200;
}

.footer-box ol {
  padding-left: 24px;
}

p>.main-text {
  font-size: 0.9rem;
  font-weight: 400;
  color: #eee;
}

a {
  color: var(--text-color);
  font-size: 0.9rem;
  text-decoration: underline;
  font-weight: 600;
  color: #eee;
}

.footer-box {
  width: 90%;
  max-width: 1400px;
  padding: 24px;
}

.footer-area {
  width: 100%;
  overflow-x: hidden;
  position: relative;
}

.footer-links {
  padding: 64px 0 32px 0;
  justify-content: flex-end;
}

footer {
  height: fit-content;
  width: 100%;
  background-color: #0014FE;
}

@media (max-width: 800px) {
  .footer-box {
    width: fit-content;
  }
}
</style>
