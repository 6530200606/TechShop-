<template>
  <div class="page-wrapper">
  </div>
  <footer class="footer bg-dark text-light py-3 mt-auto">
    <!-- ลด padding ที่นี่ -->
    <div class="container">
      <div class="row">
        <!-- Section 1: Project Title -->
        <div class="col-md-12 text-center mb-2">
          <!-- ลด margin ที่นี่ -->
          <h5>โปรเจควิชา: Web Technology and Web Services</h5>
          <h6>ชื่อ Website: TECHSHOP</h6>
        </div>
      </div>

      <!-- Section 2: Course and Instructor Information -->
      <div class="row mt-2">
        <div class="col-md-12 text-center mb-2">
          <!-- ลด margin ที่นี่ -->
          <h5>เสนอ</h5>
          <p>อาจารย์ผู้สอน: โรจฤทธิ์ สว่างแจ้ง</p>
        </div>
      </div>

      <!-- Section 3: Team Members -->
      <div class="row mt-2">
        <div class="col-md-12 text-center mb-2">
          <!-- ลด margin ที่นี่ -->
          <h5>จัดทำโดย:</h5>
          <ul class="list-unstyled">
            <li>1. นายชัยวัฒน์ เศษโถ รหัสนิสิต 6530200606</li>
            <li>2. นายทัตเทพ สาธารณพร รหัสนิสิต 6530200622</li>
            <li>3. นายปุณกัณฑ์ ปุญสิริ รหัสนิสิต 6530200703</li>
          </ul>
        </div>
      </div>

      <!-- Footer bottom row -->
      <div class="row mt-2">
        <div class="col text-center">
          <p>
            © 2024 คณะวิทยาศาสตร์ ศรีราชา สาขาวิทยาการคอมพิวเตอร์
            มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 30vh; /* ความสูงขั้นต่ำเต็มจอ */
}

.content-wrapper {
  flex: 1; /* ให้เนื้อหาขยายตามพื้นที่ที่เหลือ */
}

.footer {
  background-color: #333;
  color: #fff;
  padding: 1rem 0; /* ลด padding ที่นี่ */
  border-top: 3px solid #ffcc00; /* เส้นแบ่งด้านบน */
}

.footer h5,
.footer h6 {
  font-weight: bold;
  margin-bottom: 0.5rem; /* ลด margin ที่นี่ */
  text-transform: uppercase; /* ทำให้ตัวอักษรเป็นตัวพิมพ์ใหญ่ */
  color: #ffcc00; /* สีข้อความ */
  font-size: 1.1rem; /* ลดขนาดข้อความ */
}

.footer p,
.footer ul {
  font-size: 0.9rem; /* ลดขนาดข้อความในพารากราฟและลิสต์ */
  color: #bbb; /* สีข้อความหลัก */
}

.footer ul {
  padding-left: 0;
  list-style: none;
}

.footer ul li {
  margin-bottom: 0.5rem;
  position: relative; /* สำหรับแสดงจุด */
  padding-left: 1.5rem; /* ระยะห่างจากซ้าย */
}

.footer p {
  margin-bottom: 0;
}
</style>
