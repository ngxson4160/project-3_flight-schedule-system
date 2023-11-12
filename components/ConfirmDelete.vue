<script lang="ts" setup>
</script>
<template>
  <div class="backdrop"></div>
  <div class="wrapper">
    <h2>Are you sure?</h2>
    <p>This will delete this record permanently. You cannot undo this action.</p>
    <div class="action">
      <input @click="$emit('confirm')" class="delete" type="submit" value="Delete" />
      <input @click="$emit('cancel')" class="cancel" type="submit" value="Cancel" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/css/variable.scss";
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $background-color;
}
.wrapper {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
  background-color: white;
  border-radius: 8px;
  width: auto;
  height: auto;

  p {
    margin-top: 15px;
    font-size: $text-16;
  }

  .action {
    margin-top: 25px;
    margin-left: 60%;
    margin-bottom: 10px;
    .delete {
      margin-right: 10px;
      height: 35px;
      width: 75px;
      border: none;
      border-radius: 5px;
      border-color: $darkRed;
      color: white;
      background-color: $darkRed;
      cursor: pointer;
      font-size: $text-16;

      &:hover {
        background-color: $mediumRed;
      }

      &:active {
        background-color: $darkRed;
      }
    }
    .cancel {
      height: 35px;
      width: 75px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: $text-16;
      background-color: $mediumGrey;

      &:hover {
        background-color: $lightGrey;
      }

      &:active {
        background-color: $mediumGrey;
      }
    }
  }
}
</style>
