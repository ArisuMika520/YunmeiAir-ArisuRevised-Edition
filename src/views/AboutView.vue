<template>
  <div class="about">
    <h1>关于</h1>
    <p>
      YunmeiX 是一个基于 vue3+vueuse+tailwindcss+tauri
      等技术栈的跨平台第三方云莓智能项目。项目灵感与部分技术来自于<a
        href="https://github.com/zxy19/yunmei_unintelligent_pwa"
        target="_blank"
        >云梅不智能PWA</a
      >。
    </p>
    <p>本项目仓库：<a href="https://github.com/FoskyM/yunmei-x-vue" target="_blank">YunmeiX</a></p>

    <h1>使用</h1>
    <p>
      使用一个现代化的，支持蓝牙的浏览器打开即可（如安卓/PC的Chrome/Edge，IOS
      Bluefy），或者使用编译后的客户端。
    </p>

    <h1>隐私</h1>
    <p>登录请求将通过 https://api.fosky.top/api/yunmei/login 进行处理。</p>
    <p>除此之外，YunmeiX 不会存储您的任何数据， 其他数据将直接在本地处理。</p>

    <h1>链接</h1>
    <p><a href="https://fosky.top" target="_blank">傅四霁个人主页</a></p>
    <p><a href="https://cp.cjlu.cc" target="_blank">计量便民平台</a></p>
  </div>
</template>

<style>
h1 {
  @apply text-4xl font-bold mb-4 pt-10;
}
p {
  line-height: 1.2;
}
a {
  @apply underline;
}
</style>
