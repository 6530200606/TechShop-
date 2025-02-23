<template>
  <div v-if="dutyId !== 'admin' && dutyId !== 'employee'">
    <ErrorPage />
  </div>
  <div v-else>
    <div class="purchase-history-container">
      <h2 class="mt-5 mx-3 mb-3"><strong>จัดการคำสั่งซื้อ</strong></h2>

      <!-- Filter Buttons -->
      <div class="status-filter">
        <button
          v-for="status in statuses"
          :key="status"
          @click="filterOrders(status)"
          :class="{ 'filter-button': true, active: activeStatus === status }"
        >
          {{ status }}
        </button>
      </div>

      <!-- Filter Input Fields -->
      <div class="filter-container">
        <input
          type="text"
          class="form-control search-input"
          placeholder="รหัสการสั่งซื้อ"
          v-model="searchText"
        />
        <select class="form-control" v-model="selectedPaymentStatus">
          <option value="">ทั้งหมด</option>
          <option value="true">ชำระเงินแล้ว</option>
          <option value="false">ยังไม่ชำระเงิน</option>
        </select>
        <select class="form-control" v-model="selectedFulfillmentStatus">
          <option value="">สถานะการจัดส่ง</option>
          <option value="จัดส่งสำเร็จ">จัดส่งสำเร็จ</option>
          <option value="อยู่ระหว่างการจัดส่ง">อยู่ระหว่างการจัดส่ง</option>
          <option value="กำลังรอการจัดส่ง">กำลังรอการจัดส่ง</option>
        </select>
        <button class="btn btn-primary btn-search" style="width: 25%" @click="applyFilters">
          ค้นหา
        </button>
      </div>

      <!-- Order Table -->
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
                      <th>ลูกค้า</th>
                      <th>สถานะการชำระเงิน</th>
                      <th>สถานะการจัดส่ง</th>
                      <th>ยอดการสั่งซื้อ</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in filteredOrders" :key="order.orderId">
                      <td>{{ order.orderId }}</td>
                      <td>{{ formatDate(order.PaymentDate) }}</td>
                      <td>{{ order.memName }} {{ order.memSurname }}</td>
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
                        <div class="custom-dropdown">
                          <select
                            v-model="order.shipStatus"
                            @change="
                              updateShipStatus(order.orderId, order.shipStatus)
                            "
                            :class="[
                              'status-dropdown',
                              shipStatusClass(order.shipStatus),
                            ]"
                          >
                            <option value="จัดส่งสำเร็จ">จัดส่งสำเร็จ</option>
                            <option value="อยู่ระหว่างการจัดส่ง">
                              อยู่ระหว่างการจัดส่ง
                            </option>
                            <option value="กำลังรอการจัดส่ง">
                              กำลังรอการจัดส่ง
                            </option>
                          </select>
                          <span class="dropdown-arrow">▼</span>
                        </div>
                      </td>
                      <td>{{ formatPrice(order.price) }}</td>
                      <td>
                        <router-link
                          :to="{
                            name: 'OrderDetail',
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
</template>

<script>
import axios from "axios";
import ErrorPage from "../components/error.vue";
axios.defaults.withCredentials = true;
export default {
  name: "OrderList",
  components: {
    ErrorPage,
  },
  data() {
    return {
      loginEmail: null,
      dutyId: null,
      orders: [],
      filteredOrders: [],
      statuses: [
        "ทั้งหมด",
        "ชำระเงินแล้วและจัดส่งสำเร็จ",
        "ชำระเงินแล้วและอยู่ระหว่างการจัดส่ง",
        "ชำระเงินแล้วและกำลังรอการจัดส่ง",
      ],
      activeStatus: "ทั้งหมด",
      searchText: "",
      selectedPaymentStatus: "",
      selectedFulfillmentStatus: "",
      selectedDate: "",
    };
  },

  async mounted() {
    window.scrollTo(0, 0);
    await this.chkSession();
    await this.getOrderList();
    this.filteredOrders = this.orders;
  },

  methods: {
    async chkSession() {
      await axios
        .get(`http://localhost:3000/admins/getss`)
        .then((res) => {
          this.loginEmail = res.data.email;
          this.dutyId = res.data.dutyId;
          console.log(this.loginEmail);
          console.log(this.dutyId);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async getOrderList() {
      try {
        const response = await axios.get(
          "http://localhost:3000/orders/getOrder"
        );
        this.orders = response.data;
        this.filteredOrders = this.orders;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },

    filterOrders(status) {
      this.activeStatus = status;

      if (status === "ทั้งหมด") {
        this.filteredOrders = this.orders;
      } else if (status === "ชำระเงินแล้วและจัดส่งสำเร็จ") {
        this.filteredOrders = this.orders.filter(
          (order) =>
            order.status === true && order.shipStatus === "จัดส่งสำเร็จ"
        );
      } else if (status === "ชำระเงินแล้วและอยู่ระหว่างการจัดส่ง") {
        this.filteredOrders = this.orders.filter(
          (order) =>
            order.status === true && order.shipStatus === "อยู่ระหว่างการจัดส่ง"
        );
      } else if (status === "ชำระเงินแล้วและกำลังรอการจัดส่ง") {
        this.filteredOrders = this.orders.filter(
          (order) =>
            order.status === true && order.shipStatus === "กำลังรอการจัดส่ง"
        );
      }
    },

    applyFilters() {
      this.filteredOrders = this.orders.filter((order) => {
        const matchesSearchText =
          this.searchText === "" || order.orderId.includes(this.searchText);

        const matchesPaymentStatus =
          this.selectedPaymentStatus === "" ||
          order.status === (this.selectedPaymentStatus === "true");

        const matchesFulfillmentStatus =
          this.selectedFulfillmentStatus === "" ||
          order.shipStatus === this.selectedFulfillmentStatus;

        return (
          matchesSearchText && matchesPaymentStatus && matchesFulfillmentStatus
        );
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

    async updateShipStatus(orderId, newStatus) {
      try {
        const response = await axios.put(
          `http://localhost:3000/orders/updateShipStatus`,
          {
            orderId: orderId,
            shipStatus: newStatus,
          }
        );
        if (response.data.messageUpdate === "บันทึกข้อมูลสำเร็จ") {
          window.alert(
            `อัปเดตสถานะการจัดส่งสำหรับ Order ${orderId} เป็น ${newStatus} เรียบร้อยแล้ว`
          );
        }
      } catch (error) {
        console.error("Error updating ship status:", error);
      }
    },
  },
};
</script>

<style>
.purchase-history-container {
  margin: 20px;
  font-family: "Arial", sans-serif;
}

.status-filter,
.filter-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-button {
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  background-color: #e7f3fe;
  border: 1px solid #d0e1ff;
  transition: background-color 0.3s, transform 0.2s;
  font-weight: bold;
}

.filter-button:hover {
  background-color: #d0e1ff;
  transform: scale(1.05);
}

.filter-button.active {
  background-color: #007bff;
  color: white;
}

.search-input {
  border-radius: 25px;
  padding: 10px;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

.badge {
  padding: 0.5em 1em;
  font-size: 0.9em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 145px;
}

.badge-success {
  background-color: #28a745;
  color: white;
}

.badge-warning {
  background-color: #ffc107;
  color: black;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

.card {
  cursor: default;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 200px;
}

.custom-dropdown select {
  width: 100%;
  padding: 0.5em 2em 0.5em 1em;
  font-size: 0.9em;
  border-radius: 25px;
  appearance: none;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.custom-dropdown select:focus {
  outline: none;
}

.custom-dropdown .dropdown-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 0.8em;
  color: white;
}

.custom-dropdown select:hover {
  cursor: pointer;
}
</style>