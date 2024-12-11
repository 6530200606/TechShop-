import database from "../services/database.js"

export async function getAllType(req, res) {
    console.log('GET /types is requested')
    try {
        const result = await database.query(
            `SELECT * FROM types ORDER BY "typeId" ASC `
        )
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({ error: err.messsage })
    }
}