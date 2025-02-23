<template>
  <div v-for="(pd, pdId) in products" :key="pdId" class="mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow-sm border-0" style="width: 100%">
          <img
            :src="pd.image"
            alt="{{pd.pdName}}"
            @click="showImage(pd.image)"
            class="card-img-top product-image"
            style="cursor: pointer; border-radius: 8px"
          />
        </div>
      </div>
      <div class="col-md-5 mt-5" style="padding: 20px">
        <h2 class="product-title">{{ pd.pdName }}</h2>
        <h6 class="mt-4 product-meta">
          แบรนด์: <span>{{ pd.brand.brandName }}</span> | รหัสสินค้า:
          <span>{{ pd.pdId }}</span>
        </h6>
        <p class="mt-3 product-description">
          {{ pd.pdDescribe }}
        </p>

        <h1 class="mt-5 product-price">฿{{ pd.pdPrice }}</h1>
        <button
          :class="[
            'btn btn-primary mt-3',
            { 'disabled-button': pd.stock === 0 },
          ]"
          @click="chkLogin()"
          :disabled="pd.stock === 0"
          :style="{
            cursor: pd.stock === 0 ? 'not-allowed' : 'pointer',
            width: '100%',
          }"
          style="padding: 10px 20px"
        >
          <i class="bi bi-cart lead"></i> ใส่ตะกร้า&nbsp;
        </button>
      </div>
    </div>

    <div class="col-12 mt-5 px-3 px-md-5">
      <h3 class="section-title">รายละเอียดสินค้า</h3>
      <div class="table-responsive mt-4">
        <table class="table table-bordered product-table w-100">
          <tbody>
            <tr>
              <td class="table-header">ชื่อสินค้า</td>
              <td>{{ pd.pdName }}</td>
            </tr>
            <tr>
              <td class="table-header">ประเภทสินค้า</td>
              <td>{{ pd.type.typeName }}</td>
            </tr>
            <tr>
              <td class="table-header">แบรนด์</td>
              <td>{{ pd.brand.brandName }}</td>
            </tr>
            <tr>
              <td class="table-header">ราคา</td>
              <td>฿{{ pd.pdPrice }}</td>
            </tr>
            <tr>
              <td class="table-header">จำนวนสินค้าในคลัง</td>
              <td>
                <span
                  :class="{
                    'text-danger': pd.stock === 0,
                    'text-warning': pd.stock > 0 && pd.stock < 15,
                    'text-success': pd.stock >= 15,
                  }"
                >
                  {{ pd.stock === 0 ? "หมด" : pd.stock }}</span
                >
              </td>
            </tr>
            <tr>
              <td class="table-header">รับประกัน</td>
              <td>{{ pd.warranty }} เดือน</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal for Image Display -->
  <div v-if="currentImage" class="modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="d-flex justify-content-end">
        <span class="close" @click="closeModal">&times;</span>
      </div>
      <img :src="currentImage" alt="Selected Image" class="modal-image" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
import { EventBus } from "@/event-bus";
export default {
  name: "ProductShow",
  data() {
    return {
      products: [], //array เก็บข้อมูลสินค่า
      id: null, // รหัสสินค้าที่ส่งมา
      currentImage: null,
      memEmail: null,
      cartId: null,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    // อ่านค่าจะ parameter ที่ส่งมาจาก routes
    this.id = this.$route.params.pdId;
    // ระบุ id ของสินค้าที่ต้องการ
    axios
      .get(`http://localhost:3000/products/${this.id}`)
      .then((res) => {
        this.products = res.data;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    showImage(imageUrl) {
      this.currentImage = imageUrl; // Set the current image to the clicked image URL
    },
    closeModal() {
      this.currentImage = null; // Clear the current image to close the modal
    },
    async chkLogin() {
      console.log("chkLogin");
      await this.chkSession();
      if (this.memEmail == null) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        return false;
      }
      await this.getCartId();
      this.addCartDtl();
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
    async getCartId() {
      console.log("getCartId");
      await axios
        .get(`http://localhost:3000/carts/getCartId/${this.memEmail}`)
        .then((res) => {
          console.log("getCartId response", res.data);
          if (res.data) {
            this.cartId = res.data.cartId;
            console.log("Cart ID set to:", this.cartId); // Debugging output
          } else {
            console.log("Cart not found");
            this.cartId = null; // Set cartId to null if not found
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async addCartDtl() {
      console.log("addCartDtl");
      let cartdtl = {
        //1.สร้างชุดข้อมูลส่งไปให้ Backend POST
        cartId: this.cartId,
        pdId: this.id,
        pdPrice: this.products[0].pdPrice,
      };
      try {
        //2.ส่ง Method Request POST
        const response = await axios.post(
          `http://localhost:3000/carts/addcartdtl`,
          cartdtl
        );
        EventBus.emit("cartdtlOK");
        // 3.รับค่า Response จาก Backend เพื่ีอแสดงผล
        if (
          response.data.messageAddCartDtl === "เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว"
        ) {
          window.alert(response.data.messageAddCartDtl);
        }
        // ส่งสัญญานมีการใส่ตะกร้า
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style scoped>
.product-title {
  font-weight: bold;
  color: #333;
}

.product-meta {
  color: #777;
}

.product-description {
  line-height: 1.6;
  color: #555;
}

.product-price {
  font-weight: bold;
  color: #d9534f;
}

.add-to-cart-btn {
  padding: 10px 20px;
  font-size: 1.1rem;
}

.section-title {
  font-weight: bold;
  color: #343a40;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.product-image {
  border-radius: 8px;
  transition: transform 0.3s;
}

.product-image:hover {
  transform: scale(1.05);
}

.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 80%;
  max-width: 600px;
}

.modal-image {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.product-table {
  font-size: 1.1rem;
  border-collapse: collapse;
  margin-top: 15px;
}

.product-table td {
  padding: 15px;
  border: 1px solid #ddd;
  vertical-align: middle;
}

.table-header {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #343a40;
  text-align: center;
}

.table-responsive {
  margin-bottom: 20px;
}

.disabled-button {
  background-color: #6c757d !important;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-table td {
    font-size: 1rem;
    padding: 10px;
  }
}
</style>