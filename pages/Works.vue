<template>
  <div @click="closeModal()" class="page">
    <div class="center- flex-vert">
        <div id="projects" class="content-box">
          <h1><a>Projects / Reserch</a></h1>
          <Border></Border>
          <h3>
            図形楽譜を用いた音楽インタフェースのデザインと演奏：画像、GUIを図形楽譜として捉える
          </h3>
          <div class="flex-vert">
            <iframeYT
              url="https://www.youtube.com/embed/torxCXoCfh4?si=IN0-6k9W2skzpAaM"
            ></iframeYT>

            <div v-for="content in contentList">
              <NuxtLink
                v-if="
                  content._path == '/notes/bachelor-research/bachelor-research'
                "
                :to="content._path"
                >解説 / explaination</NuxtLink
              >
            </div>
          </div>
          <h3>
            音楽のライブコーディングのコードと表現のオリジナリティに関する分析
          </h3>
          <ul v-for="content in contentList">
            <li v-if="content.tags.includes('研究')">
              <NuxtLink :to="content._path">{{ content.title }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div id="live-performance" class="content-box">
          <h1><a>Live Performance</a></h1>
          <Border></Border>
          <h2>Live Coding</h2>

          <h3>Myorph Monoliph release streaming event</h3>
          <iframeYT
            url="https://www.youtube.com/embed/db0dgd0V9fA?si=WgdeX5Ak3dGTJI4f"
          ></iframeYT>

          <h2>Electric Catfish</h2>

          <h3>NxPC.Live vol.63</h3>
          <iframeYT
            url="https://www.youtube.com/embed/czN-1l_ykEw?si=uwbVbjUQCA8qPCe2"
          ></iframeYT>

          <h3>NxPC.Live vol.66</h3>
          <iframeYT
            url="https://www.youtube.com/embed/WmLw4oTomhA?si=87Nf0kCIPPy8KkSB"
          ></iframeYT>

          <h3>NxPC.Live vol.68</h3>
          <iframeYT
            url="https://www.youtube.com/embed/-oitKDAsfdc?si=LlvtkmWSKytLLlXq"
          ></iframeYT>

          <h3></h3>
        </div>

        <div id="music" class="content-box">
          <h1><a>Music</a></h1>
          <Border></Border>
          <h2>MEGAREX releases</h2>
          <h3>It's Gonna Be All Right (feat.shully)</h3>
          <iframeSC
            url="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/481794225&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframeSC>

          <h3>Nyctophobia</h3>
          <iframeSC
            url="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/517119543&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframeSC>

          <h3>NEOLOGISM</h3>
          <iframeSC
            url="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/549043875&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframeSC>

          <h3>Start Again</h3>
          <iframeSC
            url="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/660919823&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframeSC>

          <h3>Adolecence (feat.Sennzai)</h3>
          <iframeSC
            url="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/698142220&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframeSC>

          <h3>So into you feat. renko</h3>
          <iframeSC
            url="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/763720114&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframeSC>

          <h3>Texas Energy</h3>
          <iframeSC
            url="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/803811016&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframeSC>

          <h3>Morning Starlight Feat. Kanata.N</h3>
          <iframeSC
            url="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/911655196&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframeSC>

          <h2>Selected Works</h2>

          <h3>Var 15 from Myorph Monoliph compilation</h3>
          <iframeSC
            url="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/917088094&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframeSC>

          <h3>Segregated Aura 3.0 pt.2</h3>
          <iframeSC
            url="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/942924535&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframeSC>

          <h3>
            in the blue shirt - Afternoon Reverie (braven tidalcycles remix)
          </h3>
          <iframeYT
            url="https://www.youtube.com/embed/bw8Fw02QLVQ?si=TP2fSuvRta6owPLJ"
          ></iframeYT>
        </div>
      
        <div id="devs" class="content-box">
          <h1><a>Devs</a></h1>
          <Border></Border>
          <h3>NxPC.Live vol.63</h3>
          <img src="../assets/img/web-devs/hardpia.png" /><img />
          <br>
          <a href="https://nxpclab.info/vol.63/"
            >https://nxpclab.info/vol.63/</a
          >

          <h3>NxPC.Live vol.64</h3>
          <img src="../assets/img/web-devs/proof_of_x.png" /><img />
          <br>
          <a href="https://nxpclab.info/vol.64/"
            >https://nxpclab.info/vol.64/</a
          >

          <h3>NxPC.Live vol.65</h3>
          <img src="../assets/img/web-devs/nagase_somen.png" /><img />
          <br>
          <a href="https://nxpclab.info/vol.65/"
            >https://nxpclab.info/vol.65/</a
          >

          <h3>NxPC.Live vol.66</h3>
          <img src="../assets/img/web-devs/yashimaru.png" /><img />
          <br>
          <a href="https://nxpclab.info/vol.66/"
            >https://nxpclab.info/vol.66/</a
          >

          <h3>NxPC.Live vol.68</h3>
          <img src="../assets/img/web-devs/space_debris.png" /><img />
          <br>
          <a href="https://nxpclab.info/vol.68/"
            >https://nxpclab.info/vol.68/</a
          >
        </div>
      </div>
      <div class="bottom"></div>
  </div>
  <Nav @click.stop="isMenuShown = !isMenuShown" :close="isMenuShown" @isclose="(e) => isMenuShown = e">
    <Menu></Menu>
    <div class="ui-box" style="padding-left: 10px">
      <div class="flex-vert gap-5">
        <a @click.stop="closeModal()" href="#projects">Projects / Research</a>
        <a @click.stop="closeModal()" href="#live-performance">Live Performance</a>
        <a @click.stop="closeModal()" href="#music">Music</a>
        <a @click.stop="closeModal()" href="#devs">Devs</a>
      </div>
    </div>
  </Nav>
  
</template>

<style scoped>
h1 a {
  font-size: 2rem;
  color: var(--text-color);
}

.burger {
  top: 5%;
}
</style>

<script setup>

const contentList = ref(null);
const isMenuShown = ref(false);

onMounted(async () => {
  contentList.value = await queryContent("/notes/")
    .only(["title", "_path", "update", "tags"])
    .where({ tags: { $containsAny: ["研究", "archive"] } })
    .sort({ update: -1, $numeric: true })
    .find();

  console.log(contentList.value);
});

useSeoMeta({
  title: "braveeeeen",
  ogTitle: "protfolio site of braven",
  description: "Works and Development",
  ogDescription: "Works and Development",
  ogUrl: "https://braveeeeen.vercel.app/works",
  ogImage:
    "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
  twitterCard: "summary_large_image",
  twitterImage:
    "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
});

function closeModal() {
  if(isMenuShown.value) {
    isMenuShown.value = false;
  }
}
</script>
