<template>
  <div class="key-caps">
    <div class="key-cap-content">
      <div class="key-cap-btn-group">
        <div class="key-cap-btn key-cap-btn-arrow">
          <span>&#8593;</span>
        </div>
        <div class="key-cap-btn key-cap-btn-arrow">
          <span>&#8595;</span>
        </div>
      </div>
      <p>to navigate</p>
    </div>
    <div class="key-cap-content">
      <div class="key-cap-btn">
        <span>RETURN</span>
      </div>
      <span>to select</span>
    </div>
    <div class="key-cap-content">
      <div class="key-cap-btn">
        <span>ESC</span>
      </div>
      <span>to exit</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavButtons'
}
</script>

<style lang="scss">
  .key-caps {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-top: 10px;

    .key-cap-content {
      display: flex;
      align-items: baseline;
      font-size: 17px;

      .key-cap-btn-group {
        display: flex;
        align-items: baseline;
      }

      .key-cap-btn {
        display: flex;
        padding: 5px 10px;
        margin-right: 5px;
        color: var(--hippie-font-color);
        background-color: var(--hippie-secondary-color);
        border-radius: 5px;

        span {
          font-weight: 700;
        }
      }

      .key-cap-btn-arrow {
        justify-content: center;
        padding: 5px 11px;
      }

    }
  }
</style>
