import database from "../services/database.js"
import bcrypt from "bcrypt"

export async function postAdmin(req, res) {
    console.log('POST /admin is requested');
    const bodyData = req.body;
    try {
        if (
            req.body.adminEmail == null ||
            req.body.adminName == null ||
            req.body.adminSurname == null ||
            req.body.adminTel == null ||
            req.body.dutyId == null ||
            req.body.password == null
        ) {
            return res.json({ messageregister: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check if the email already exists
        const emailExistsResult = await database.query({
            text: `SELECT EXISTS (SELECT * FROM admins WHERE "adminEmail" = $1)`,
            values: [req.body.adminEmail]
        });

        if (emailExistsResult.rows[0].exists) {
            return res.json({ messageregister: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }

        // Check if the phone number already exists
        const phoneExistsResult = await database.query({
            text: `SELECT EXISTS (SELECT * FROM admins WHERE "adminTel" = $1)`,
            values: [req.body.adminTel]
        });

        if (phoneExistsResult.rows[0].exists) {
            return res.json({ messageregister: 'เบอร์โทรนี้ถูกใช้งานแล้ว' });
        }

        const thePwd = req.body.password;
        const saltround = 11;
        const pwdHash = await bcrypt.hash(thePwd, saltround);

        const result = await database.query({
            text: `INSERT INTO admins (
                      "adminEmail", 
                      "adminName", 
                      "adminSurname", 
                      "adminTel", 
                      "dutyId",
                      "adminHash"
                   ) VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [
                req.body.adminEmail,
                req.body.adminName,
                req.body.adminSurname,
                req.body.adminTel,
                req.body.dutyId,
                pwdHash,
            ],
        });
        console.log('OK');
        return res.json({ messageregister: 'ลงทะเบียนผู้ใช้ระบบสำเร็จ' });
    } catch (err) {
        console.error(err);
        return res.json({ messageregister: 'ลงทะเบียนไม่สำเร็จ' });
    }
}


export async function loginAdmin(req, res) {
    console.log('POST /loginAdmin is requested');
    const bodyData = req.body;
    try {
        if (req.body.loginName == null || req.body.password == null) {
            return res.json({ messagelogin: 'กรุณากรอกอีเมลและรหัสผ่าน' });
        }

        // Query to check if loginName is either email or phone number
        const existsResult = await database.query({
            text: `
                SELECT EXISTS (
                    SELECT * FROM admins a 
                    WHERE a."adminEmail" = $1 
                )
            `,
            values: [req.body.loginName]
        });

        if (!existsResult.rows[0].exists) {
            return res.json({ messagelogin: 'อีเมลไม่ถูกต้อง กรุณาลองใหม่' });
        }

        // Query to retrieve the member's data based on email or phone number
        const result = await database.query({
            text: `
                SELECT * FROM admins a 
                WHERE a."adminEmail" = $1 
            `,
            values: [req.body.loginName]
        });

        // Compare password hash
        const loginOK = await bcrypt.compare(req.body.password, result.rows[0].adminHash);

        if (loginOK) {
            req.session.adminEmail = result.rows[0].adminEmail
            req.session.adminName = result.rows[0].adminName
            req.session.dutyId = result.rows[0].dutyId
            console.log(req.session)
            return res.json({ messagelogin: 'เข้าสู่ระบบสำเร็จ' });
        } else {
            return res.json({ messagelogin: 'อีเมลไม่ถูกต้อง กรุณาลองใหม่' });
        }
    } catch (err) {
        console.error('Error:', err);
        return res.json({ messagelogin: 'เข้าสู่ระบบไม่สำเร็จ' });
    }
}

export async function getSession(req, res) {
    console.log('GET /getSession is requested')
    console.log(req.session)
    const thedata = {
        email: req.session.adminEmail,
        name: req.session.adminName,
        dutyId: req.session.dutyId
    }
    console.log(thedata)
    return res.json(thedata)
}

export async function logoutAdmin(req, res) {
    console.log(`GET /logoutNember is requested`)
    try {
        req.session.destroy()
        res.clearCookie('connect.sid')
        return res.status(200).json({ messagelogout: 'ออกจากระบบเสร็จสิ้น' })
    }
    catch (err) {
        return res.status(500).json({ messagelogout: 'เกิดข้อผิดพลาดในการออกจากระบบ กรุณาลองใหม่' })
    }
}

export async function getAdmin(req, res) {
    console.log('GET /getAdmin is requested');
    try {
        const result = await database.query({
            text: `SELECT * FROM "admins" WHERE "adminEmail" = $1`,
            values: [req.params.id],
        });

        if (result.rows.length > 0) {
            return res.json(result.rows[0]);
        } else {
            return res.status(404).json({ message: 'ไม่พบที่อยู่สำหรับอีเมลนี้' });
        }
    } catch (err) {
        console.error('Error fetching Email:', err);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
}


export async function updateAdmin(req, res) {
    console.log(`PUT /admin is requested`);

    try {
        // Check if the phone number is being updated
        if (req.body.adminTel) {
            // Check if the new phone number already exists for a different admin
            const phoneExistsResult = await database.query({
                text: `SELECT EXISTS (SELECT * FROM admins WHERE "adminTel" = $1 AND "adminEmail" != $2)`,
                values: [req.body.adminTel, req.body.adminEmail]
            });

            if (phoneExistsResult.rows[0].exists) {
                return res.status(400).json({ messageUpdate: 'เบอร์โทรนี้ถูกใช้งานแล้ว' });
            }
        }

        let pwdHash = null;
        if (req.body.password) {
            const thePwd = req.body.password;
            const saltround = 11;
            pwdHash = await bcrypt.hash(thePwd, saltround);
        }

        const result = await database.query({
            text: `
                UPDATE "admins"
                SET "adminEmail" = COALESCE($1, "adminEmail"),
                    "adminName" = COALESCE($2, "adminName"),
                    "adminSurname" = COALESCE($3, "adminSurname"),
                    "adminTel" = COALESCE($4, "adminTel"),
                    "dutyId" = COALESCE($5, "dutyId"),
                    "adminHash" = COALESCE($6, "adminHash")
                WHERE "adminEmail" = COALESCE($7, "adminEmail");
            `,
            values: [
                req.body.adminEmail || null,
                req.body.adminName || null,
                req.body.adminSurname || null,
                req.body.adminTel || null,
                req.body.dutyId || null,
                pwdHash || null,
                req.body.adminEmail || null,
            ]
        });

        res.status(201).json({ messageUpdate: 'บันทึกข้อมูลสำเร็จ' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


export async function getAllEmployee(req, res) {
    console.log('GET /admins is requested')
    try {
        const result = await database.query(
            `SELECT * FROM "admins"`,
        )
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({ error: err.messsage })
    }
}

export async function delAdmins(req, res) {
    console.log(`DELETE /admins/${req.params.id} is requested`)
    try {
        const result = await database.query({
            text:
                `
                DELETE FROM "admins" WHERE "adminEmail" ILIKE $1
            `,
            values: [req.params.id]
        })
        res.status(204).end()
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}