<template>
  <div class="container box">
      <h2 class="mt-5 mx-3 text-danger"><strong>แจ้งเตือน</strong></h2>
      <div class="alert alert-danger mt-3">
        <div class="d-flex align-items-center">
          <img
            src="../assets/icon/warning.png"
            alt="Warning Image"
            style="max-width: 50px; margin-right: 10px"
          />
          <span class="fw-bold">คุณไม่มีสิทธิ์ดูรายการนี้</span>
        </div>
        <p class="mt-2">
          กรุณาติดต่อผู้ดูแลหรือลองเข้าสู่ระบบด้วยบัญชีที่ถูกต้อง
        </p>
      </div>
      <div class="text-center">
        <p>หากคุณเชื่อว่านี่เป็นความผิดพลาด กรุณาติดต่อฝ่ายสนับสนุน</p>
        <button class="btn btn-primary" @click="goToSupport">
          ติดต่อฝ่ายสนับสนุน
        </button>
      </div>
    </div>
</template>

<script>
export default {
  name: "errorPage"
}
</script>

<style>

</style>