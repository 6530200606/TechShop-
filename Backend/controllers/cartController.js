import database from "../services/database.js";

export async function postCart(req, res) {
    console.log(`POST /CART is requested`);

    try {
        // Validate Data
        if (req.body.memEmail == null) {
            return res.json({ cartOK: false, messageAddCart: 'Customer Id is required' });
        }

        let i = 0;
        let theId = '';
        let existsResult = [];
        do {
            i++;
            theId = `C${String(i).padStart(6, '0')}`;
            existsResult = await database.query({
                text: 'SELECT EXISTS (SELECT * FROM carts WHERE "cartId" = $1)',
                values: [theId],
            });
        } while (existsResult.rows[0].exists);

        // Insert new cart
        await database.query({
            text: `INSERT INTO carts ("cartId", "cusId") VALUES ($1, $2)`,
            values: [theId, req.body.memEmail],
        });

        return res.json({ cartOK: true, messageAddCart: theId });

    } catch (err) {
        console.error("Error in postCart: ", err.message);
        return res.status(500).json({ error: err.message });
    }
}

export async function postCartDtl(req, res) {
    console.log(`POST /CARTDETAIL is requested`);
    try {
        // Validate Data
        if (req.body.cartId == null || req.body.pdId == null) {
            return res.json({ cartDtlOK: false, messageAddCartDtl: 'CartId && ProductID is required' });
        }

        // Check if product is already in cart
        const pdResult = await database.query({
            text: `SELECT * FROM "cartDtl" ctd WHERE ctd."cartId" = $1 AND ctd."pdId" = $2`,
            values: [req.body.cartId, req.body.pdId],
        });

        // If product is not in cart, insert new product
        if (pdResult.rowCount === 0) {
            const totalPrice = req.body.pdPrice * 1; // Calculate totalPrice from qty * unitPrice
            await database.query({
                text: `INSERT INTO "cartDtl" ("cartId", "pdId", "qty", "unitPrice", "totalPrice") VALUES ($1, $2, $3, $4, $5)`,
                values: [
                    req.body.cartId,
                    req.body.pdId,
                    1, // Start with 1 item
                    req.body.pdPrice,
                    totalPrice,
                ],
            });
            console.log("Added new product to cart");
            return res.json({ cartDtlOK: true, messageAddCartDtl: 'เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว' });
        } else {
            // Update existing product quantity in cart
            const newQty = pdResult.rows[0].qty + 1; // Increase quantity
            const newTotalPrice = newQty * req.body.pdPrice; // Recalculate total price

            await database.query({
                text: `UPDATE "cartDtl" SET "qty" = $1, "totalPrice" = $2 WHERE "cartId" = $3 AND "pdId" = $4`,
                values: [
                    newQty,
                    newTotalPrice,
                    req.body.cartId,
                    req.body.pdId,
                ],
            });
            console.log("Updated existing product quantity in cart");
            return res.json({ cartDtlOK: true, messageAddCartDtl: 'Updated product quantity successfully' });
        }
    } catch (err) {
        console.error("Error in postCartDtl: ", err.message);
        return res.status(500).json({ cartDtlOK: false, messageAddCartDtl: 'Error processing request' });
    }
}

export async function getCartId(req, res) {
    console.log(`GET SumCart is requested`);
    const result = await database.query({
        text: `SELECT "cartId" FROM carts WHERE "cusId" = $1`,
        values: [req.params.id], // Parameter passed
    });
    console.log(result.rows[0]);

    if (result.rows.length > 0) {
        return res.status(200).json(result.rows[0]);
    } else {
        return res.json({ message: 'ไม่มีสินค้าในตะกร้า' });
    }
}

export async function getCart(req, res) {
    console.log(`GET Cart is Requested`);
    try {
        const result = await database.query({
            text: `SELECT ct.*, SUM(ctd.qty) AS sqty, SUM(ctd."totalPrice") AS sprice FROM carts ct LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId" WHERE ct."cartId" = $1 GROUP BY ct."cartId"`,
            values: [req.params.id],
        });
        console.log(`id=${req.params.id} \n`, result.rows[0]);
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error in getCart: ", err.message);
        return res.status(500).json({ error: err.message });
    }
}

export async function getCartDtl(req, res) {
    console.log(`GET CartDtl is Requested`);
    try {
        const result = await database.query({
            text: `SELECT ROW_NUMBER() OVER (ORDER BY ctd."pdId") AS row_number, ctd."pdId", pd."pdName", ctd.qty, ctd."unitPrice", ctd."totalPrice", pd."image", pd."stock", pd."delStatus" FROM "cartDtl" ctd LEFT JOIN "products" pd ON ctd."pdId" = pd."pdId" WHERE ctd."cartId" = $1 ORDER BY ctd."pdId"`,
            values: [req.params.id],
        });
        console.log(`id=${req.params.id} \n`, result.rows[0]);
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error in getCartDtl: ", err.message);
        return res.status(500).json({ error: err.message });
    }
}

export async function putCartDtl(req, res) {
    console.log(`PUT /cartDtl/${req.body.cartId}/${req.body.pdId} is requested`);
    const bodyData = req.body
    try {
        const result = await database.query({
            text: `
                UPDATE "cartDtl"
                SET "qty" = $1,
                    "totalPrice" = $2
                WHERE "cartId" = $3 AND "pdId" = $4
            `,
            values: [
                req.body.qty,
                req.body.totalPrice,
                req.body.cartId,  // ใช้ cartId ในการระบุรายการตะกร้า
                req.body.pdId     // ใช้ pdId ในการระบุสินค้าภายในตะกร้า
            ]
        });
        const datetime = new Date();
        bodyData.updateDate = datetime;
        res.status(201).json(bodyData);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function delCartDtl(req, res) {
    console.log(`DELETE /cartDtl/${req.body.cartId}/${req.body.pdId} is requested`);

    try {
        // ลบสินค้าจาก cartDtl
        await database.query({
            text: `
                DELETE FROM "cartDtl" WHERE "cartId" = $1 AND "pdId" = $2
            `,
            values: [
                req.body.cartId,  // ใช้ cartId ในการระบุรายการตะกร้า
                req.body.pdId     // ใช้ pdId ในการระบุสินค้าภายในตะกร้า
            ]
        });
        res.status(204).end();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function clearCart(req, res) {
    console.log(`DELETE /cartDtl/${req.body.cartId}`);
    try {
        if (req.body.cartId == null) {
            return res.json({ cartId: false, messageDel: 'CartId is required' });
        }
        await database.query({
            text: `DELETE FROM "cartDtl" WHERE "cartId" = $1`,
            values: [req.body.cartId]
        })
        res.status(204).end();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}