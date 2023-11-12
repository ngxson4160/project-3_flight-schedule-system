<script lang="ts" setup></script>

<template>
  <div class="wrapper">
    <div id="header"><Header></Header></div>
    <div class="inner">
      <div id="silde-bar"><Sidebar /></div>
      <slot id="content"></slot>
    </div>
    <div id="footer"><Footer></Footer></div>
  </div>
</template>

<style scoped lang="scss">
.inner {
  display: flex;
  min-height: 750px;
  #silde-bar {
    flex-basis: 20%;
  }

  #content {
    flex-basis: 80%;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
}

#header {
  text-align: center;
}

#footer {
  text-align: center;
}
</style>
