<template>
  <div>
    <nav
      :class="['navbar', 'navbar-expand-lg', 'fixed-top', 'bg-primary']"
      style="padding: 1rem 2rem"
    >
      <div class="container-fluid">
        <!-- Brand name on the left side -->
        <router-link to="/" style="text-decoration: none">
          <a
            class="navbar-brand text-white"
            href="#"
            style="font-size: 2rem; padding: 0.5rem 1rem; font-weight: bold"
          >
            <i class="bi bi-cpu-fill"></i>&nbsp; TECHSHOP
          </a>
        </router-link>

        <!-- Product categories and search form on the right side -->
        <div class="d-flex ms-auto align-items-center">
          <!-- Dropdown menu with product categories -->
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCategories"
            aria-controls="navbarCategories"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style="font-size: 2rem; padding: 0.5rem 1rem"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarCategories">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle text-white"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style="font-size: 1rem; margin-right: 1rem"
                >
                  ประเภทสินค้า
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li
                    v-for="(type, typeId) in types"
                    :key="typeId"
                    class="dropdown-item"
                    @click="goToPageProducts(type.typeId, type.typeName)"
                  >
                    {{ type.typeName }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Search bar -->
          <form
            class="d-flex align-items-center me-3"
            @submit.prevent="searchProduct"
          >
            <input
              class="form-control me-2"
              type="text"
              v-model="stext"
              placeholder="ค้นหาสินค้าเลย......"
              aria-label="Search"
              style="font-size: 1rem; padding: 0.5rem; width: 300px"
            />
            <button
              class="btn btn-warning"
              type="submit"
              style="font-size: 1rem; font-weight: bold; padding: 0.5rem 1.5rem"
            >
              <i class="bi bi-search" style="color: black; font-size: 1rem"></i>
            </button>
          </form>

          <!-- Cart and login links -->
          <div class="d-flex align-items-center">
            <router-link
              v-if="memId"
              :to="'/CartShow/' + cartId"
              style="text-decoration: none"
            >
              <div
                class="nav-link text-white position-relative"
                style="
                  font-size: 1rem;
                  padding: 0.2rem;
                  display: flex;
                  align-items: center;
                  margin-right: 1rem;
                "
              >
                <i
                  class="bi bi-cart-fill"
                  style="margin-right: 0.3rem; font-size: 1.25rem"
                ></i>
                <!-- Badge for cart item count -->
                <span
                  v-if="cartItemCount > 0"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning"
                  style="
                    font-size: 0.65rem;
                    width: 35px;
                    height: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    color: black;
                  "
                >
                  {{ cartItemCount }}
                  <span class="visually-hidden">จำนวนสินค้าในตะกร้า</span>
                </span>
              </div>
            </router-link>

            <!-- ถ้าไม่ได้ login ให้แสดงปุ่มนี้แทน -->
            <div
              v-else
              class="nav-link text-white"
              style="
                font-size: 1rem;
                padding: 0.2rem;
                display: flex;
                align-items: center;
                margin-right: 1rem;
                cursor: pointer;
              "
              @click="showLoginAlert"
            >
              <i
                class="bi bi-cart-fill"
                style="margin-right: 0.3rem; font-size: 1.25rem"
              ></i>
            </div>

            <div v-if="memName" class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle text-white"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style="font-size: 1rem; padding: 0.2rem"
              >
                <i
                  class="bi bi-person-fill"
                  style="margin-right: 0.3rem; font-size: 1.25rem"
                ></i>
                {{ memName }}
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <router-link to="/pagemember" class="dropdown-item"
                    >บัญชีของฉัน</router-link
                  >
                </li>
                <li>
                  <router-link to="/History" class="dropdown-item"
                    >ประวัติการสั่งซื้อ</router-link
                  >
                </li>
                <!-- เพิ่มเมนูเพิ่มเติมที่นี่ถ้าต้องการ -->
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" @click="memLogout">ออกจากระบบ</a>
                </li>
              </ul>
            </div>

            <router-link v-else to="/Login" style="text-decoration: none">
              <div
                class="nav-link text-white"
                style="
                  font-size: 1rem;
                  padding: 0.2rem;
                  display: flex;
                  align-items: center;
                "
              >
                <i class="bi bi-person-fill" style="margin-right: 0.3rem"></i>
                เข้าสู่ระบบ
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import axios from "axios";
import { EventBus } from "@/event-bus";
axios.defaults.withCredentials = true;
export default {
  name: "MainMenu",
  data() {
    return {
      types: [],
      stext: null,
      memName: null,
      memId: null,
      dutyId: null,
      cartId: null,
      cartItemCount: 0,
      cart: {},
    };
  },
  methods: {
    searchProduct() {
      if (this.stext) {
        this.$router.push({
          path: "/products",
          query: { search: this.stext },
        });
        this.stext = null;
      } else {
        console.log("กรุณากรอกคำค้นหา");
      }
    },
    goToPageProducts(typeId, typeName) {
      this.$router.push({
        path: "/products",
        query: { type: typeId, typeName: typeName },
      });
    },
    async memLogout() {
      const cf = window.confirm("ต้องการออกจากระบบหรือไม่");
      if (cf) {
        try {
          const response = await axios.get(
            "http://localhost:3000/members/logout"
          );
          if (response.data.messagelogout === "ออกจากระบบเสร็จสิ้น") {
            window.alert(response.data.messagelogout);
            localStorage.clear();
            this.memName = null;
            this.memId = null;
            this.dutyId = null;
            this.$router.push("/");
          }
        } catch (err) {
          window.alert("เกิดข้อผิดพลาดในการออกจากระบบ กรุณาลองใหม่");
          console.log(err);
        }
      }
    },
    showLoginAlert() {
      window.alert("กรุณาเข้าสู่ระบบก่อนเพื่อดูตะกร้าสินค้า");
      this.$router.push("/Login");
    },
    async getCartId() {
      console.log("getCartId");
      await axios
        .get(`http://localhost:3000/carts/getCartId/${this.memId}`)
        .then((res) => {
          console.log("getCartId response", res.data);
          if (res.data) {
            this.cartId = res.data.cartId;
            console.log("Cart ID set to:", this.cartId); // Debugging output
            this.getCart();
          } else {
            console.log("Cart not found");
            this.cartId = null; // Set cartId to null if not found
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async getCart() {
      console.log("Get Cart");
      try {
        const response = await axios.get(
          `http://localhost:3000/carts/getCart/${this.cartId}`
        );
        this.cart = response.data; // ใช้ response.data แทน response.json()
        console.log("Cart: ", this.cart[0]); // แสดง cart ที่ได้รับ
        this.cartItemCount = this.cart[0].sqty;
      } catch (err) {
        console.error("Error fetching cart: ", err);
      }
    },
  },

  async mounted() {
    try {
      const res = await axios.get("http://localhost:3000/types");
      this.types = res.data;
    } catch (err) {
      console.error(err);
    }

    this.memName = localStorage.getItem("memName");
    this.memId = localStorage.getItem("memEmail");
    this.dutyId = localStorage.getItem("dutyId");

    EventBus.on("loginok", () => {
      this.memName = localStorage.getItem("memName");
      this.memId = localStorage.getItem("memEmail");
      this.dutyId = localStorage.getItem("dutyId");
      this.getCartId(); // เรียก getCartId ใหม่เมื่อมีการล็อกอิน
    });

    if (this.memId) {
      await this.getCartId();
      console.log(this.cartId);
    } else {
      console.log("memId is not set, skipping getCartId");
    }

    EventBus.on("cartdtlOK", () => {
      this.getCartId();
    });
  },
  beforeUnmount() {
    EventBus.off("loginok");
  },
};
</script>

<style scoped>
body {
  padding-top: 5rem;
}

/* Adjust dropdown item styles */
.dropdown-menu .dropdown-item {
  font-size: 0.875rem; /* Smaller font size */
  padding: 0.25rem 1rem; /* Adjust padding */
  cursor: pointer; /* Change cursor to pointer */
}

.navbar .dropdown-toggle::after {
  display: none;
}
</style>