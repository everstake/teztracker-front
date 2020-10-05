<template>
  <div class="gears">
    <ul class="gear1">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <ul class="gear2">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <ul class="gear3">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Gears',
  };
</script>

<style lang="scss" scoped>
  .gears {
    width: 300px;
    height: 300px;
    position: relative;
    display: inline-block;
  }

  .gear1,
  .gear2,
  .gear3 {
    background: $color-brand;
    border-radius: 50%;
    position: absolute;
  }

  .gear1 {
    width: 120px;
    height: 120px;
    top: 20%;
    left: 20%;
    animation: rotate 8s linear infinite;
  }
  .gear2 {
    width: 80px;
    height: 80px;
    top: 58%;
    left: 56%;
    animation: rotate 6s linear reverse infinite;
  }
  .gear3 {
    width: 40px;
    height: 40px;
    top: 62%;
    left: 10%;
    animation: rotate 4s linear reverse infinite;
  }
  ul li {
    list-style-type: none;
    float: left;
    background-color: $color-brand;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    transform-origin: bottom;
    position: absolute;
    left: 40%;
  }
  .gear1 li {
    top: -20px;
    width: 20px;
    height: 80px;
  }
  .gear2 li {
    top: -18px;
    width: 15px;
    height: 58px;
  }
  .gear3 li {
    top: -20px;
    width: 15px;
    height: 40px;
    margin: 0 -4px;
  }

  ul li:nth-child(1) {
    transform: rotate(0deg);
  }
  ul li:nth-child(2) {
    transform: rotate(30deg);
  }
  ul li:nth-child(3) {
    transform: rotate(60deg);
  }
  ul li:nth-child(4) {
    transform: rotate(90deg);
  }
  ul li:nth-child(5) {
    transform: rotate(120deg);
  }
  ul li:nth-child(6) {
    transform: rotate(150deg);
  }
  ul li:nth-child(7) {
    transform: rotate(180deg);
  }
  ul li:nth-child(8) {
    transform: rotate(210deg);
  }
  ul li:nth-child(9) {
    transform: rotate(240deg);
  }
  ul li:nth-child(10) {
    transform: rotate(270deg);
  }
  ul li:nth-child(11) {
    transform: rotate(300deg);
  }
  ul li:nth-child(12) {
    transform: rotate(330deg);
  }

  .gear2 li:nth-child(1) {
    transform: rotate(0deg);
  }
  .gear2 li:nth-child(2) {
    transform: rotate(40deg);
  }
  .gear2 li:nth-child(3) {
    transform: rotate(80deg);
  }
  .gear2 li:nth-child(4) {
    transform: rotate(120deg);
  }
  .gear2 li:nth-child(5) {
    transform: rotate(160deg);
  }
  .gear2 li:nth-child(6) {
    transform: rotate(200deg);
  }
  .gear2 li:nth-child(7) {
    transform: rotate(240deg);
  }
  .gear2 li:nth-child(8) {
    transform: rotate(280deg);
  }
  .gear2 li:nth-child(9) {
    transform: rotate(320deg);
  }

  .gear3 li:nth-child(1) {
    transform: rotate(30deg);
  }
  .gear3 li:nth-child(2) {
    transform: rotate(90deg);
  }
  .gear3 li:nth-child(3) {
    transform: rotate(150deg);
  }
  .gear3 li:nth-child(4) {
    transform: rotate(210deg);
  }
  .gear3 li:nth-child(5) {
    transform: rotate(270deg);
  }
  .gear3 li:nth-child(6) {
    transform: rotate(330deg);
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
