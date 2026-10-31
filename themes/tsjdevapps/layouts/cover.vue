<template>
  <SlideFrame variant="cover">
    <div class="tsj-columns tsj-cover-columns">
      <div><slot /></div>
      <aside class="tsj-cover-art"><slot name="right" /></aside>
    </div>
  </SlideFrame>
</template>
