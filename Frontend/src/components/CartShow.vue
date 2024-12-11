<template>
  <div v-if="memEmail == cusId">
    <div class="container box">
      <div v-if="!cartDtl || cartDtl.length === 0">
        <div class="text-center py-5">
          <img
            src="../assets/icon/emptyCart.png"
            alt="Cart is empty"
            style="max-width: 30%; margin-bottom: 20px"
          />
          <h2 class="text-muted">ไม่มีสินค้าในตะกร้า</h2>
          <p class="text-secondary">
            คุณไม่มีสินค้าในตะกร้า โปรดเลือกสินค้าที่ต้องการสั่งซื้อ
          </p>
          <router-link to="/">
            <a href="#" class="d-inline link-warning">กลับไปเลือกสินค้า</a>
          </router-link>
        </div>
      </div>
      <div v-else>
        <h2 class="mt-5 mx-3"><strong>ตะกร้าสินค้า</strong></h2>
        <div class="container min-h-content py-3">
          <div class="row">
            <div class="col-12 col-md-8">
              <div class="row row-cols-1 g-3">
                <div class="col-12" v-for="(ctd, pdId) in cartDtl" :key="pdId">
                  <div class="card shadow-sm">
                    <div class="d-flex px-2">
                      <img
                        class="bd-placeholder-img card-img-top img-fluid"
                        style="
                          max-width: 90px;
                          height: auto;
                          margin-right: 10px;
                          object-fit: contain;
                        "
                        :src="ctd.image"
                        alt=""
                      />
                      <div class="card-body flex-fill">
                        <p class="card-text fw-bold">{{ ctd.pdName }}</p>
                        <div
                          class="d-flex justify-content-between align-items-center"
                        >
                          <div class="btn-group">
                            <button
                              class="btn btn-outline-secondary"
                              @click="decreaseQty(ctd)"
                              :disabled="isProcessing"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              v-model.number="ctd.qty"
                              class="form-control text-center"
                              style="width: 60px"
                              @change="validateQty(ctd)"
                              min="1"
                              :disabled="isProcessing"
                            />
                            <button
                              class="btn btn-outline-secondary"
                              @click="increaseQty(ctd)"
                              :disabled="isProcessing"
                            >
                              +
                            </button>
                          </div>
                          <small
                            class="fw-bold text-danger"
                            style="font-size: 1.25rem"
                          >
                            ฿ {{ ctd.totalPrice }}
                          </small>
                          <button
                            class="btn btn-outline-danger"
                            @click="removeFromCart(ctd)"
                            title="Remove item"
                            :disabled="isProcessing"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div
                class="card bg-primary text-white rounded-0 border-0"
                style="max-height: 300px; overflow-y: auto"
              >
                <div class="card-body">
                  <div
                    class="d-flex justify-content-between align-items-center mb-4"
                  >
                    <h5 class="mb-0">ข้อมูลการสั่งซื้อ</h5>
                    <i class="bi bi-cart3 h1"></i>
                  </div>
                  <hr class="my-4" />
                  <div class="d-flex justify-content-between">
                    <p class="mb-2">ยอดรวม</p>
                    <p class="mb-2">฿ {{ calculateTotalPrice() }}</p>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <p class="mb-2">ส่วนลด</p>
                    <p class="mb-2">฿ 0</p>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <p class="mb-2 fw-bold">ยอดรวมสุทธิ</p>
                    <p class="mb-2 fw-bold">฿ {{ calculateTotalPrice() }}</p>
                  </div>
                  <button
                    type="button"
                    class="btn btn-warning w-100 fw-bold"
                    style="height: 50px"
                    @click="showOverlay()"
                    :disabled="isProcessing"
                  >
                    ดำเนินการสั่งซื้อ
                  </button>

                  <!-- กล่องกรอกรายละเอียดการชำระเงินแบบ overlay -->
                  <div v-if="showPaymentForm" class="payment-form-overlay">
                    <div class="payment-form">
                      <span class="close-btn" @click="showPaymentForm = false"
                        >&times;</span
                      >
                      <h5>รายละเอียดการชำระเงิน</h5>
                      <div class="mb-3">
                        <label for="cardNumber" class="form-label"
                          >หมายเลขบัตร</label
                        >
                        <input
                          type="text"
                          id="cardNumber"
                          class="form-control"
                          v-model="paymentDetails.cardNumber"
                          placeholder="กรอกหมายเลขบัตร"
                          :disabled="isProcessing"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="expiryDate" class="form-label"
                          >วันหมดอายุ</label
                        >
                        <input
                          type="text"
                          id="expiryDate"
                          class="form-control"
                          v-model="paymentDetails.expiryDate"
                          placeholder="MM/YY"
                          :disabled="isProcessing"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="cvc" class="form-label">CVC</label>
                        <input
                          type="text"
                          id="cvc"
                          class="form-control"
                          v-model="paymentDetails.cvc"
                          placeholder="กรอก CVC"
                          :disabled="isProcessing"
                        />
                      </div>
                      <div class="mb-3">
                        <label>สถานที่จัดส่ง:</label>
                        <div>
                          <input
                            type="radio"
                            id="useSavedAddress"
                            value="saved"
                            v-model="shippingAddressType"
                            :disabled="isProcessing"
                          />
                          <label for="useSavedAddress" class="radio-label"
                            >&nbsp;ใช้ที่อยู่เดิม</label
                          >
                        </div>
                        <div>
                          <p>ที่อยู่ปัจจุบัน: {{ savedAddress }}</p>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="useNewAddress"
                            value="new"
                            v-model="shippingAddressType"
                            :disabled="isProcessing"
                          />
                          <label for="useNewAddress" class="radio-label"
                            >&nbsp;กำหนดเอง</label
                          >
                        </div>
                        <div v-if="shippingAddressType === 'new'">
                          <input
                            type="text"
                            class="form-control"
                            v-model="newAddress"
                            placeholder="กรอกที่อยู่ใหม่"
                            :disabled="isProcessing"
                            required
                          />
                        </div>
                      </div>

                      <!-- ปุ่มยืนยันการชำระเงิน -->
                      <button
                        type="button"
                        class="btn btn-success w-100 fw-bold"
                        @click="processPayment"
                        :disabled="isProcessing || isPaymentDisabled"
                      >
                        <div
                          class="d-flex justify-content-center align-items-center"
                        >
                          <span v-if="!isProcessing"> ยืนยันการชำระเงิน </span>
                          <div
                            v-if="isProcessing"
                            class="spinner-border"
                            role="status"
                          >
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </button>

                      <!-- ปุ่มยกเลิก -->
                      <button
                        type="button"
                        class="btn btn-secondary w-100 fw-bold mt-2"
                        @click="showPaymentForm = false"
                        :disabled="isProcessing"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                  <!-- แสดง overlay หลังการประมวลผล -->
                  <div
                    v-if="showSuccessOverlay"
                    class="payment-success-overlay"
                  >
                    <div class="payment-success">
                      <span class="close-btn" @click="closeSuccessOverlay()">
                        &times;
                      </span>
                      <img
                        src="../assets/icon/PaymentSuccess.png"
                        alt="Image description"
                        style="width: 200px; height: 200px"
                      />
                      <h5 class="mx-5">Payment Successful!</h5>
                    </div>
                  </div>
                </div>
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
import ErrorPage from "../components/error.vue";
import axios from "axios";
axios.defaults.withCredentials = true;
import { EventBus } from "@/event-bus";
export default {
  name: "CartShow",
  components: {
    ErrorPage,
  },
  data() {
    return {
      cart: [],
      cartDtl: [],
      cartId: null,
      memEmail: null,
      cusId: null,
      orderId: null,
      showPaymentForm: false,
      paymentDetails: {
        cardHolder: "",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
      },
      shippingAddressType: "saved", // ตัวเลือกที่อยู่การจัดส่ง (ค่าเริ่มต้นเป็นที่อยู่เดิม)
      savedAddress: null, // ที่อยู่เดิม
      newAddress: null,
      isProcessing: false, // เพื่อควบคุมสถานะการประมวลผล
      showSuccessOverlay: false,
    };
  },
  async mounted() {
    window.scrollTo(0, 0);
    await this.chkSession();
    this.cartId = this.$route.params.cartId;
    await this.getCart();
    await this.getCartDtl();
    await this.getSavedAddress();
  },
  computed: {
    isPaymentDisabled() {
      // Disable payment if a new address is selected but not filled in
      return (
        this.isProcessing ||
        (this.shippingAddressType === "new" && !this.newAddress)
      );
    },
  },
  methods: {
    async getSavedAddress() {
      try {
        // ดึงข้อมูลที่อยู่จาก email ของผู้ใช้
        const addressResponse = await axios.get(
          `http://localhost:3000/members/getMember/${this.memEmail}`
        ); // ส่งอีเมลเป็นข้อมูลใน body
        console.log(addressResponse.data);
        this.savedAddress = addressResponse.data.memAddress; // เก็บที่อยู่เดิมไว้
      } catch (error) {
        console.log("Error fetching saved address:", error);
      }
    },
    async processPayment() {
      this.isProcessing = true;

      // Simulate payment processing delay
      setTimeout(() => {
        // Here you can call your payment processing logic
        this.showPaymentForm = false; // Close the payment form
        this.showSuccessOverlay = true; // Show success overlay
        this.isProcessing = false; // Reset processing state

        // Optionally, you can reset form fields after successful payment
        this.paymentDetails.cardNumber = "";
        this.paymentDetails.expiryDate = "";
        this.paymentDetails.cvc = "";
        this.newAddress = ""; // Reset new address
      }, 750);

      const shippingAddress =
        this.shippingAddressType === "new"
          ? this.newAddress
          : this.savedAddress;

      if (
        !shippingAddress ||
        (this.shippingAddressType === "new" && !this.newAddress)
      ) {
        alert("กรุณาระบุที่อยู่การจัดส่ง");
        return;
      }

      console.log("Shipping Address:", shippingAddress);

      // เรียกฟังก์ชัน createOrder
      const createOrderResponse = await this.createOrder(shippingAddress);
      if (createOrderResponse.data.messageAddOrder === "Add Order Success") {
        this.orderId = createOrderResponse.data.orderId;
        this.addOrderDtl(this.orderId);
        this.updateProduct(this.cartId);
        this.clearCart(this.cartId);
        EventBus.emit("cartdtlOK");
      }
    },

    async createOrder(shippingAddress) {
      try {
        const response = await axios.post(
          "http://localhost:3000/orders/addOrder",
          {
            cartId: this.cartId, // รหัสตะกร้าสินค้า
            memEmail: this.memEmail, // อีเมลลูกค้า
            shippingAddress: shippingAddress, // ที่อยู่การจัดส่ง
            totalPrice: this.calculateTotalPrice(),
          }
        );
        return response; // ส่งกลับข้อมูลที่ได้รับจากการสร้างออร์เดอร์
      } catch (error) {
        console.error("Error creating order:", error);
        throw error; // โยนข้อผิดพลาดเพื่อให้จัดการที่อื่นได้
      }
    },

    async addOrderDtl(orderId) {
      console.log("addOrderDtl");
      let orderDtl = {
        orderId: orderId,
        cartId: this.cartId,
      };
      try {
        await axios.post(`http://localhost:3000/orders/addorderdtl`, orderDtl);
        EventBus.emit("orderdtlOK");
      } catch (err) {
        console.log(err);
      }
    },

    async clearCart(cartId) {
      console.log("clearCart");
      try {
        const response = await axios.delete(
          `http://localhost:3000/carts/clearCart`,
          { data: { cartId: cartId } }
        );
        if (response.status === 204) {
          console.log("Deleted cart detail successfully.");
        } else {
          console.error("Failed to delete cart detail:", response.data);
        }
      } catch (err) {
        console.error("Error deleting cart detail:", err);
      }
    },

    formattedDate(dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    async getCart() {
      console.log("Get Cart");
      await axios
        .get(`http://localhost:3000/carts/getCart/${this.cartId}`)
        .then((res) => {
          console.log("Cart \n" + res.data);
          this.cart = res.data;
          this.cusId = res.data[0].cusId;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async getCartDtl() {
      console.log("Get CartDtl");
      await axios
        .get(`http://localhost:3000/carts/getcartdtl/${this.cartId}`)
        .then((res) => {
          console.log("CartDtl \n" + res.data);
          this.cartDtl = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async chkSession() {
      await axios
        .get(`http://localhost:3000/members/getss`)
        .then((res) => {
          this.memEmail = res.data.email;
          console.log(this.memEmail);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    calculateTotalPrice() {
      return this.cartDtl.reduce((acc, ctd) => acc + ctd.totalPrice, 0);
    },
    async increaseQty(ctd) {
      if (ctd.qty < ctd.stock) {
        ctd.qty++;
        ctd.totalPrice = ctd.unitPrice * ctd.qty;
        EventBus.emit("cartdtlOK");
        await this.updateCartDtl(ctd);
      } else {
        alert("จำนวนสินค้ามีอยู่ใน stock เท่านี้");
      }
    },
    async decreaseQty(ctd) {
      if (ctd.qty > 1) {
        ctd.qty--;
        ctd.totalPrice = ctd.unitPrice * ctd.qty;
        EventBus.emit("cartdtlOK");
        await this.updateCartDtl(ctd);
      } else {
        alert("จำนวนสินค้าต้องไม่น้อยกว่า 1");
      }
    },
    async removeFromCart(ctd) {
      await this.deleteCartDtl(ctd);
      EventBus.emit("cartdtlOK");
      await this.updateCartDtl(ctd);
    },
    validateQty(ctd) {
      // ตรวจสอบว่าจำนวนที่กรอกเกิน stock หรือไม่
      if (ctd.qty > ctd.stock) {
        alert(`จำนวนสินค้ามีใน stock เพียง ${ctd.stock} ชิ้น`);
        ctd.qty = ctd.stock; // ถ้าเกิน stock ให้ตั้งค่าจำนวนใหม่เป็น stock สูงสุด
      } else if (ctd.qty < 1) {
        alert("จำนวนสินค้าต้องไม่น้อยกว่า 1");
        ctd.qty = 1; // ถ้าน้อยกว่า 1 ให้กลับไปจำนวนเดิม
      }

      // คำนวณราคาใหม่
      ctd.totalPrice = ctd.unitPrice * ctd.qty;

      // ตรวจสอบว่าไม่ได้เกิน stock ก่อนอัปเดตข้อมูล
      if (ctd.qty <= ctd.stock && ctd.qty >= 1) {
        this.updateCartDtl(ctd); // เรียกฟังก์ชันอัปเดตถ้าข้อมูลถูกต้อง
      }
    },
    async updateCartDtl(ctd) {
      let dtl = {
        cartId: this.cartId,
        pdId: ctd.pdId,
        qty: ctd.qty,
        totalPrice: ctd.unitPrice * ctd.qty,
      };
      try {
        const response = await axios.put(
          `http://localhost:3000/carts/updateCartDtl`,
          dtl
        );
        console.log("Updated cart detail:", response.data);
      } catch (err) {
        console.error("Error updating cart detail:", err);
      }
    },
    async deleteCartDtl(ctd) {
      let dtl = {
        cartId: this.cartId,
        pdId: ctd.pdId,
      };
      try {
        // เรียก DELETE API
        const response = await axios.delete(
          `http://localhost:3000/carts/deleteCartDtl`,
          { data: dtl }
        );

        if (response.status === 204) {
          console.log("Deleted cart detail successfully.");
          await this.getCartDtl();
        } else {
          console.error("Failed to delete cart detail:", response.data);
        }
      } catch (err) {
        console.error("Error deleting cart detail:", err);
      }
    },
    showOverlay() {
      console.log("Updated cartDtl:", this.cartDtl);

      // ค้นหารายการสินค้าที่ถูกลบ (delStatus === true)
      const deletedItems = this.cartDtl
        .filter((ctd) => ctd.delStatus === true)
        .map((ctd) => ctd.pdName); // สมมติว่าชื่อสินค้ามีอยู่ใน property pdName

      if (deletedItems.length > 0) {
        const itemList = deletedItems
          .map((item, index) => `${index + 1}. ${item}`)
          .join("\n");
        alert(
          `สินค้าต่อไปนี้ไม่มีอยู่ในระบบแล้ว:\n${itemList}\nกรุณาลบออกจากตะกร้าเพื่อดำเนินการต่อ`
        );
        return; // รีเซ็ตสถานะการประมวลผล
      }

      this.showPaymentForm = true;
    },
    closeSuccessOverlay() {
      this.showSuccessOverlay = false;
      this.$router.push({
        name: "PurchaseDetail",
        params: { orderId: this.orderId },
      });
    },
    goToSupport() {
      // Implement your logic to navigate to the support page
      this.$router.push("/support");
    },
    async updateProduct(cartId) {
      console.log("Update ProductQty");
      try {
        const response = await axios.put(
          `http://localhost:3000/products/decreaseProduct/${cartId}`
        );
        console.log("Updated cart detail:", response.data);
      } catch (err) {
        console.error("Error updating product stock:", err);
      }
    },
  },
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.container.box {
  border: 1px solid white;
  border-radius: 8px;
  background-color: white;
}

.card {
  border: 1px solid white;
  border-radius: 8px;
}

.alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
}

.text-center img {
  filter: grayscale(50%);
}

.text-center h2 {
  font-size: 2rem;
}

.text-center p {
  font-size: 1.1rem;
  color: #6c757d;
}

a {
  text-decoration: none;
  font-weight: bold;
}

.payment-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7); /* สีพื้นหลังโปร่งแสง */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* ขนาดของฟอร์มภายใน overlay */
.payment-form {
  width: 80%; /* ขยายฟอร์มเป็น 80% ของหน้าจอ */
  max-width: 1200px; /* จำกัดขนาดฟอร์มไม่ให้เกิน 1200px */
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3); /* เพิ่มเงา */
  position: relative;
}

/* ปุ่มกากบาท */
.payment-form .close-btn {
  position: absolute;
  top: 10px;
  right: 30px;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  font-weight: bold;
}

.payment-form .close-btn:hover {
  color: red;
}

.payment-form h5 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: bold;
  color: #333;
}

.payment-form .form-label {
  font-weight: bold;
  color: #333;
}

.payment-form .form-control {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-size: 1rem;
}

.payment-form .btn {
  font-size: 1.2rem;
  padding: 10px 15px;
}

.payment-form .btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.payment-form .btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.payment-success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8); /* Darker background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.payment-success {
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); /* Larger shadow for better pop */
  position: relative;
}

.payment-success img {
  display: block; /* ทำให้แน่ใจว่ารูปภาพแสดงเป็นบล็อก */
  margin: 0 auto; /* จัดกลางรูปภาพ */
}

.payment-success h5 {
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 1.8rem;
  color: #28a745; /* Green color for success */
  font-weight: normal;
}

.payment-success .close-btn {
  position: absolute;
  top: 10px;
  right: 30px;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  font-weight: bold;
}

.payment-success .close-btn:hover {
  color: red;
}

.mb-3 label,
.mb-3 p {
  color: #333; /* กำหนดสีข้อความเป็นสีเข้มเพื่อให้อ่านง่าย */
}

.mb-3 input[type="radio"] + label {
  color: #333; /* กำหนดสีให้กับ label ที่อยู่ถัดจาก radio button */
}

.mb-3 p {
  padding: 5px;
}
</style>