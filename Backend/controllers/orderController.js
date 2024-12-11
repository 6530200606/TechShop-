import database from "../services/database.js";

export async function postOrder(req, res) {
    console.log(`POST /Order is requested`);
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 ดังนั้นต้องบวก 1
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0'); // จัดการชั่วโมง
        const minutes = String(now.getMinutes()).padStart(2, '0'); // จัดการนาที
        const seconds = String(now.getSeconds()).padStart(2, '0'); // จัดการวินาที

        const currentDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        let i = 0;
        let theId = '';
        let existsResult = [];

        do {
            i++;
            theId = `${req.body.cartId}-${String(i)}`
            existsResult = await database.query({
                text: 'SELECT EXISTS (SELECT * FROM "orders" WHERE "orderId" = $1)',
                values: [theId],
            });
        } while (existsResult.rows[0].exists);

        await database.query({
            text: `INSERT INTO "orders" ("orderId", "cusId", "PaymentDate", "shipAddress", "price") VALUES ($1, $2, $3, $4, $5)`,
            values: [theId, req.body.memEmail, currentDate, req.body.shippingAddress, req.body.totalPrice],
        })

        return res.json({ orderId: theId, orderOK: true, messageAddOrder: "Add Order Success" });
    } catch (err) {
        // ส่ง error ถ้าเกิดปัญหา
        console.error('Error creating order', err.message);
        return res.status(500).json({ error: err.message });
    }
}


export async function postOrderDtl(req, res) {
    console.log(`POST /OrderDetail is requested`);
    try {
        if (req.body.cartId == null || req.body.orderId == null) {
            return res.json({ orderDtlOK: false, messageAddOrderDtl: 'CartId && OrderId is required' });
        }

        const cartDetails = await database.query({
            text: `SELECT * FROM "cartDtl" WHERE "cartId" = $1`,
            values: [req.body.cartId]
        })

        if (cartDetails.rows.length === 0) {
            return res.json({ orderDtlOK: false, messageAddOrderDtl: 'No items found in the cart' });
        }

        for (const item of cartDetails.rows) {
            await database.query({
                text: `INSERT INTO "orderDtl" ("orderId", "pdId", "qty", "unitPrice", "totalPrice") VALUES ($1, $2, $3, $4, $5)`,
                values: [
                    req.body.orderId,
                    item.pdId,
                    item.qty, // Start with 1 item
                    item.unitPrice,
                    item.totalPrice,
                ],
            })
        }
        return res.json({ orderDtlOK: true, messageAddOrderDtl: 'Order details added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ orderDtlOK: false, messageAddOrderDtl: 'An error occurred' });
    }
}

export async function getOrder(req, res) {
    console.log(`GET /orders is requested`);

    try {
        const result = await database.query({
            text: `
                    SELECT
                        o."orderId",
                        o."cusId",
                        m."memName",
                        m."memSurname",
                        o."status",
                        o."shipStatus",
                        o."shipAddress",
                        o."PaymentDate",
                        o."price"
                    FROM "orders" o
                    INNER JOIN "members" m ON o."cusId" = m."memEmail"`,
        });
        if (result.rowCount == 0) {
            return res.status(404).json({ error: `Order not Found` })
        }
        return res.json(result.rows);
    } catch (err) {
        console.error('Error fetching order list:', err.message);
        return res.status(500).json({ error: 'Error fetching orders' });
    }
}

export async function getOrderById(req, res) {
    console.log(`GET /orders is requested`);

    try {
        const result = await database.query({
            text: `SELECT * FROM "orders" WHERE "cusId" = $1`,
            values: [req.params.id],
        });
        if (result.rowCount == 0) {
            return res.status(404).json({ error: `Order not Found` })
        }
        return res.json(result.rows);
    } catch (err) {
        console.error('Error fetching order list:', err.message);
        return res.status(500).json({ error: 'Error fetching orders' });
    }
}

export async function getOrderDtl(req, res) {
    console.log('GET /orderDTL is requested')
    try {
        const result = await database.query({
            text: `
                    SELECT
                        o."orderId",
                        o."cusId",
                        m."memName",
                        m."memSurname",
                        m."memTel",
                        o."shipStatus",
                        o."shipAddress",
                        o."PaymentDate",
                        o."price"
                    FROM "orders" o
                    INNER JOIN "members" m ON o."cusId" = m."memEmail"
                    WHERE o."orderId" = $1
                `,
            values: [req.params.id]
        })
        if (result.rowCount == 0) {
            return res.status(404).json({ error: `OrderDtl not Found` })
        }
        return res.status(200).json(result.rows[0])
    }
    catch (err) {
        return res.status(500).json({ error: err.messsage })
    }
}

export async function getProductDtl(req, res) {
    console.log('GET /productDTL is requested')
    try {
        const result = await database.query({
            text: `
                    SELECT
                        o."orderId",
                        p."pdName",
                        p."image",
                        t."typeName",
                        o."qty",
                        o."totalPrice"
                    FROM "orderDtl" o
                    INNER JOIN "products" p ON o."pdId" = p."pdId"
                    INNER JOIN "types" t ON p."typeId" = t."typeId"
                    WHERE o."orderId" = $1;
                `,
            values: [req.params.id]
        })
        if (result.rowCount == 0) {
            return res.status(404).json({ error: `Product not Found` })
        }
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({ error: err.messsage })
    }
}

export async function updateShipStatus(req, res) {
    console.log(`PUT /orderDtl/${req.body.orderId}/${req.body.shipStatus} is requested`);

    try {
        const result = await database.query({
            text: `
                UPDATE "orders"
                SET "shipStatus" = $1
                WHERE "orderId" = $2;
            `,
            values: [
                req.body.shipStatus,
                req.body.orderId
            ]
        });
        res.status(201).json({ messageUpdate: 'บันทึกข้อมูลสำเร็จ' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}