<template>
  <div v-if="dutyId !== 'admin' && dutyId !== 'employee'">
    <ErrorPage />
  </div>
  <div v-else>
    <div class="purchase-details-container">
      <!-- Left Column: Order Details and Products List -->
      <div class="left-column">
        <div class="card">
          <h2>รายละเอียดการสั่งซื้อ</h2>
          <p class="user-name">
            ชื่อ-นามสกุล:
            <strong>{{ order.memName }} {{ order.memSurname }}</strong>
          </p>
          <p class="order-id">
            รหัสการสั่งซื้อ: <strong>{{ order.orderId }}</strong>
          </p>
          <div :class="['check-mark', shipStatusClass(order.shipStatus)]">
            ✔ {{ order.shipStatus }}
          </div>
        </div>

        <div class="card">
          <h3>รายการสินค้า:</h3>
          <ul class="product-list">
            <li v-for="item in cartItems" :key="item.pdId" class="product-item">
              <img :src="item.image" alt="Product image" />
              <div class="product-info">
                <h4>{{ item.pdName }}</h4>
                <p>ประเภท: {{ item.typeName }}</p>
                <p>จำนวน: {{ item.qty }} | ราคา: ฿{{ item.totalPrice }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Column: Summary Information -->
      <div class="right-column">
        <div class="card summary-card">
          <div class="summary-section">
            <h3>ข้อมูลการจัดส่งสินค้า</h3>
          </div>
          <div class="summary-section">
            <p class="highlight">ที่อยู่การจัดส่ง:</p>
            <p>{{ order.shipAddress }}</p>
          </div>
          <div class="summary-section">
            <p class="highlight">เบอร์โทรศัพท์:</p>
            <p>{{ order.memTel }}</p>
          </div>
          <div class="summary-section">
            <p class="highlight">อีเมล:</p>
            <p>{{ order.cusId }}</p>
          </div>
          <div class="summary-section">
            <p class="highlight">วันที่สั่งซื้อสินค้า:</p>
            <p>{{ formatDate(order.PaymentDate) }}</p>
          </div>
          <div class="summary-section qty-section">
            <p class="highlight"><strong>จำนวนสินค้า:</strong></p>
            <p>
              <strong>{{ totalItems }}</strong>
            </p>
          </div>
          <div class="summary-section total-section">
            <p class="highlight"><strong>รวมยอดสุทธิ:</strong></p>
            <p>
              <strong>฿{{ order.price }}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorPage from "../components/error.vue";
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  name: "OrderDetail",
  components: {
    ErrorPage,
  },
  data() {
    return {
      id: null,
      adminEmail: null,
      dutyId: null,
      cusId: null,
      order: [],
      cartItems: [],
    };
  },

  computed: {
    totalItems() {
      return this.cartItems.reduce((acc, item) => acc + item.qty, 0);
    },
  },

  async mounted() {
    window.scrollTo(0, 0);
    await this.chkSession();
    this.id = this.$route.params.orderId;
    console.log("Order ID:", this.id); // เพิ่มบรรทัดนี้
    await this.fetchOrderData();
  },
  methods: {
    async chkSession() {
      await axios
        .get(`http://localhost:3000/admins/getss`)
        .then((res) => {
          this.adminEmail = res.data.email;
          this.dutyId = res.data.dutyId;
          console.log(this.adminEmail);
          console.log(this.dutyId);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async fetchOrderData() {
      axios
        .get(`http://localhost:3000/orders/getOrderDtl/${this.id}`)
        .then((res) => {
          console.log(res.data);
          this.order = res.data;
        })
        .catch((err) => {
          console.error(err);
        });

      axios
        .get(`http://localhost:3000/orders/getProductDtl/${this.id}`)
        .then((res) => {
          this.cartItems = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    shipStatusClass(status) {
      if (status === "จัดส่งสำเร็จ") {
        return "success";
      } else if (status === "อยู่ระหว่างการจัดส่ง") {
        return "warning";
      } else if (status === "กำลังรอการจัดส่ง") {
        return "danger";
      }
      return ""; // คืนค่ากลับหากไม่มีสถานะตรงกัน
    },
    formatDate(dateString) {
      const date = new Date(dateString);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
  },
};
</script>

<style scoped>
.purchase-details-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  padding: 10px;
  max-width: 1200px;
  margin: 30px auto;
  border-radius: 15px; /* ขอบมุมที่โค้งมนขึ้น */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); /* เงาที่ละเอียดอ่อน */
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.left-column .card {
  height: 450px; /* ความสูงสูงสุดสำหรับการ์ดทั้งหมด */
}

.left-column .card:first-child {
  flex-grow: 1; /* ทำให้ Order Details ขยายเต็มพื้นที่ */
  height: 200px; /* กำหนดความสูงขั้นต่ำ */
}

.left-column .card:last-child {
  height: 550px;
  overflow-y: auto; /* ให้แสดง scroll เมื่อเนื้อหามากเกินไป */
}

.card {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease; /* เพิ่มการเปลี่ยนแปลง */
}

.card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px); /* ยกการ์ดเมื่อโฮเวอร์ */
}

.check-mark {
  font-size: 24px;
  font-weight: bold;
}

.check-mark.success {
  color: #28a745; /* สีเขียว */
}

.check-mark.warning {
  color: #ffac07; /* สีเหลือง */
}

.check-mark.danger {
  color: #dc3545; /* สีแดง */
}

.user-name {
  margin-top: 10px; /* เพิ่มช่องว่างระหว่างรายละเอียดกับชื่อ */
}

.product-list {
  list-style-type: none;
  padding: 0;
}

.product-item {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
}

.product-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid #ddd;
}

.product-info h4 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.product-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.summary-card {
  border-radius: 15px;
  padding: 50px 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
}

.summary-section {
  margin-bottom: 20px;
}

.highlight {
  color: #444;
  font-weight: bold;
  font-size: 16px;
}

.qty-section {
  display: flex;
  justify-content: space-between; /* เพื่อให้ข้อความกับค่าห่างกัน */
  align-items: center; /* จัดให้ตรงแนวกลางในแนวตั้ง */
  border-top: 2px solid #333;
  padding-top: 10px;
}

.qty-section p {
  font-size: 18px;
  color: #444;
  margin-top: 30px; /* ลบ margin ที่ไม่ต้องการออก */
}

.total-section {
  display: flex;
  justify-content: space-between; /* เพื่อให้ข้อความกับค่าห่างกัน */
  align-items: center; /* จัดให้ตรงแนวกลางในแนวตั้ง */
  border-top: 2px solid #333;
  padding-top: 10px;
}

.total-section p {
  font-size: 18px;
  color: #444;
  margin-top: 30px; /* ลบ margin ที่ไม่ต้องการออก */
}

h3 {
  margin-bottom: 20px;
  font-size: 22px;
  color: #444;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .purchase-details-container {
    grid-template-columns: 1fr;
  }
}
</style>

