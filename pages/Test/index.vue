<script setup lang="ts">
import { useFetch } from 'nuxt/app';

const router = useRouter();
const { query } = useRoute();

const page = query["page"] ? query["page"] : "1";
const tags = query["tags"] ? query["tags"].map(tag => `&tags=${tag}`).join() : "";
const keyword = query["keyword"] ? `&keyword=${query["keyword"]}` : "";

const pagination = await useFetch("/api/blog/pagination", { method: "get" })
const artilceList = await useFetch(`/api/blog/list-pages?page=${page}${tags}${keyword}`, { method: "get" })

if (artilceList.error) {
  console.log(artilceList.error.value)
}

if (artilceList.status.value === "error") {
  router.push("/notes")
}
console.log(pagination.data.value);
console.log(artilceList.data.value)
</script>

<template>
  <div>
    test
  </div>
  <div v-for="value in artilceList">
    <p>
      {{ value }}
    </p>
  </div>
</template>