<template>
  <div class="page center-">
    <div class="">
      <div class="flex-hori margin-left">
        <div class="content-box">
          <h1>About Me</h1>
          <ul>
            <li>Institution -> IAMAS</li>
            <li>I live in Gifu, Japan</li>
            <li>
              Experties : Live Coding, TidalCycles, NIME, Geneaology of Live
              Coding
            </li>
          </ul>
        </div>
        <!-- picture box -->
        <div class="img-box center-vert margin-left">
          <img src="~/assets/img/matsumoto.png" />
        </div>
      </div>

      <!-- description -->
      <div class="">
        <div class="content-box">
          <p>
            初めまして、松本です。また、bravenという名で音楽家として活動しています。
          </p>
          <p>
            現在は、iamas（情報芸術科学大学院大学）に在学しており、そこでライブコーディングによる音楽の技術史と文化史がどのように表現を形成しているかについて研究しています。
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- nav box -->
  <div class="menu">
    <Menu></Menu>
  </div>
</template>

<style>
img {
  width: 20svh;
  height: 20svh;
}

.img-box {
  margin: 10px;
}

.page-margin {
  margin: 80px;
}

ul {
  padding-left: 10%;
}

.center- {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 786px) {
  .page-margin {
    margin: 10px;
  }
}
</style>
