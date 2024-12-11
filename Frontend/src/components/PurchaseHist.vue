<template>
  <div v-if="dutyId === 'member'">
    <div class="purchase-history-container">
      <h2 class="mt-5 mx-3"><strong>ประวัติการสั่งซื้อสินค้า</strong></h2>
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>รหัสการสั่งซื้อ</th>
                      <th>วันที่สั่งซื้อ</th>
                      <th>ยอดการสั่งซื้อ</th>
                      <th>สถานะการชำระเงิน</th>
                      <th>สภานะการจัดส่ง</th>
                      <th>ที่อยู่การจัดส่ง</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in orders" :key="order.orderId">
                      <td>{{ order.orderId }}</td>
                      <td>{{ formatDate(order.PaymentDate) }}</td>
                      <td>
                        {{ formatPrice(order.price) }}
                      </td>
                      <td>
                        <span :class="statusClass(order.status)">
                          {{
                            order.status
                              ? "ชำระเงินเสร็จสิ้น"
                              : "รอการดำเนินการ"
                          }}
                        </span>
                      </td>
                      <td>
                        <span :class="shipStatusClass(order.shipStatus)">
                          {{ order.shipStatus }}
                        </span>
                      </td>
                      <td>{{ order.shipAddress }}</td>
                      <td>
                        <router-link
                          :to="{
                            name: 'PurchaseDetail',
                            params: { orderId: order.orderId },
                          }"
                          class="btn btn-outline-info btn-sm"
                        >
                          ดูรายละเอียด
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <ErrorPage />
  </div>
</template>

<script>
import ErrorPage from '../components/error.vue';
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  name: "PurchaseHist",
  components: {
    ErrorPage,
  },
  data() {
    return {
      orders: [],
      memEmail: null,
      dutyId: null,
    };
  },

  async mounted() {
    window.scrollTo(0, 0);
    await this.chkSession();
    await this.getOrderList();
  },

  methods: {
    async chkSession() {
      await axios
        .get(`http://localhost:3000/members/getss`)
        .then((res) => {
          this.memEmail = res.data.email;
          this.dutyId = res.data.duty;
          console.log("dutyId:", this.dutyId);
          console.log(this.memEmail);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async getOrderList() {
      console.log("Get OrderList");
      await axios
        .get(`http://localhost:3000/orders/getOrderById/${this.memEmail}`)
        .then((res) => {
          console.log("Order \n" + res.data);
          this.orders = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },

    formatPrice(price) {
      return `฿${price.toFixed(2)}`;
    },

    statusClass(status) {
      return {
        badge: true,
        "badge-success": status === true,
        "badge-danger": status === false,
      };
    },

    shipStatusClass(status) {
      return {
        badge: true,
        "badge-success": status === "จัดส่งสำเร็จ",
        "badge-warning": status === "อยู่ระหว่างการจัดส่ง",
        "badge-danger": status === "กำลังรอการจัดส่ง",
      };
    },
  },
};
</script>

<style>
.purchase-history-container {
  margin: 20px;
}

.table {
  width: 100%; /* ทำให้ตารางขยายเต็มความกว้าง */
}

.table th,
.table td {
  text-align: center; /* จัดตำแหน่งข้อความในทั้งหัวข้อและข้อมูลให้ตรงกลาง */
  vertical-align: middle; /* จัดแนวกลางแนวตั้ง */
}

.badge {
  padding: 0.5em 1em;
  font-size: 0.9em;
  display: inline-flex; /* ใช้ inline-flex เพื่อจัดตำแหน่ง */
  align-items: center; /* จัดแนวกลางแนวตั้ง */
  justify-content: center; /* จัดแนวกลางแนวนอน */
  width: 145px; /* กำหนดความกว้างที่แน่นอนเพื่อให้ขนาดเท่ากัน */
}

.badge-success {
  background-color: #28a745; /* สีเขียว */
  color: white; /* ข้อความสีขาว */
}

.badge-warning {
  background-color: #ffc107; /* สีเหลือง */
  color: black; /* ข้อความสีดำ */
}

.badge-danger {
  background-color: #dc3545; /* สีแดง */
  color: white; /* ข้อความสีขาว */
}

.card {
  cursor: default; /* ลบ pointer */
}
</style>
