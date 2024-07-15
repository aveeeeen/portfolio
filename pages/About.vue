<template>
  <div class="page center-" >
    <div class="relative">
      <div class="flex-hori ">
        <div class="content-box">
          <h1>About Me</h1>
          <ul>
            <li>Taichi Matsumoto</li>
            <li>Artist name: braven</li>
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
          <img class="about-img" src="~/assets/img/matsumoto.png" />
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
          
          <h3>Find me on:</h3>
          <div>
            <div class="grid-parent">
              <a class="grid-child" href="https://twitter.com/braveeeeen">
                <div>
                  <img class="icon" src="../assets/icon/twitter.png"><img>
                <p>twitter</p>
                </div>
              </a>
              <a class="grid-child" href="https://www.instagram.com/neeeeevarb/">
                <div>
                  <img class="icon" src="../assets/icon/insta.png"><img>
                <p>instagram</p>
                </div>
              </a>
              <a class="grid-child" href="mailto:taichimatsumoto360@gmail.com">
                <div>
                  <img class="icon" src="../assets/icon/mail.png"><img>
                <p>e-mail</p>
                </div>
              </a>
              <a class="grid-child" href="https://github.com/aveeeeen/">
                <div>
                  <img class="icon" src="../assets/icon/github.png"><img>
                <p>github</p>
                </div>
              </a>
              <a class="grid-child" href="https://www.youtube.com/@braven6009">
                <div>
                  <img class="icon" src="../assets/icon/youtube.png"><img>
                <p>YouTube</p>
                </div>
              </a>
              <a class="grid-child" href="https://soundcloud.com/braven-music">
                <div>
                  <img class="icon" src="../assets/icon/soundcloud.png"><img>
                <p>SoundCloud</p>
                </div>
              </a>
            </div>
          </div>
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
.about-img {
  width: 35svh;
  height: 35svh;
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


.wrapper{
  margin-top: 10px;
  margin-bottom: 10px;
}

.icon {
  width: 40px;
  height: 40px;
}

.grid-parent{
  display: grid;
  grid-template-columns: repeat(3,1fr);
  max-width: 400px;
  padding: 10px;
  row-gap: 10px;
}

.grid-child{
  max-width: 100px;
}



@media (max-width: 786px) {
  .page-margin {
    margin: 10px;
  }
  .center- {
    display: block;
  }
}
</style>
