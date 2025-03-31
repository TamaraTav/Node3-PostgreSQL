import pool from "../config/db.config.js";


//Get all Products
async function getProducts(req, res) {

    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).json({error: 'Internal server error'});
    }
}


async function getOneProduct(req, res) {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({error: 'No product with id ' + id});
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).json({error: 'Internal server error'});
    }
}

//ახალი პროდუქტის დამატება
async  function createProduct(req, res) {
    try {
        const { name, price, stock, description, slug, category, id } = req.body;
        const result = await pool.query('INSERT INTO products (name, price, stock, description, slug, category, id ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [
            name,
            price,
            stock,
            description,
            slug,
            category,
            id
        ]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).json({error: 'Internal server error'});
    }
}

// დაედიტება
async function  updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, price, stock, description, slug, category } = req.body;
        const result = await pool.query(
            'UPDATE products SET name = $1, price = $2, stock = $3, description = $4, slug = $5, category = $6 WHERE id = $7 RETURNING * ',
            [ name, price, stock, description, slug, category, id],
        );
        if (result.rowCount === 0) {
            return res.status(404).json({error: 'No product with id ' + id});
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.log('Error executing query', err.stack);
        console.log('Error executing query', err.stack);
    }
}

async function  deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({error: 'No product with id ' + id});
        }
        res.json({message: 'Product deleted successfully  with id ' + id});
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).json({error: 'Internal server error'});
    }
}


async function  getCategoryStats(req, res) {
    try {
        const result = await pool.query('SELECT category, COUNT(*), AVG(price) as avarage, MIN(price), MAX(price) FROM products GROUP BY category');
        res.json(result.rows);
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).json({error: 'Internal server error'});
    }
}



export {getProducts, getOneProduct, createProduct, updateProduct, deleteProduct, getCategoryStats};