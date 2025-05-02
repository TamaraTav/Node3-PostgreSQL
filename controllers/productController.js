
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


//Get all Products
async function getProducts(req, res) {

    try {
       const products = await prisma.products.findMany({
           include: {
               category: {
                   select: {
                       name: true,
                   },
               },
           },
       });
       res.json(products);
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).json({error: 'Internal server error'});
    }
}


async function getOneProduct(req, res) {
    try {
        const { id } = req.params;
       const product = await prisma.products.findUnique({
           where: {id: parseInt(id)}
       });
       if (!product) {
           return res.status(404).json({error: 'Product not found'});
       }
       res.json(product);
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).json({error: 'Internal server error'});
    }
}

//ახალი პროდუქტის დამატება
async  function createProduct(req, res) {
    try {
        const { name, price, stock, description, slug, category, id } = req.body;
        const product = await prisma.products.create({
            data: { name, price, stock, description, slug, category}
        });
        res.status(201).json(product);

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

        const product = await prisma.products.update({
            where: {id: parseInt(id)},
            data: { name, price, stock, description, slug, category},
        });
        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }
        res.json(product);
    } catch (err) {
        console.log('Error executing query', err.stack);
        console.log('Error executing query', err.stack);
    }
}

//პროდუქტის წაშლა
async function  deleteProduct(req, res) {
    try {
        const { id } = req.params;
        await prisma.products.delete({
            where: {id: parseInt(id)}
        });

        res.json({message: 'Product deleted successfully  with id ' + id});
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).json({error: 'Internal server error'});
    }
}


async function  getCategoryStats(req, res) {
    try {
        const result = await prisma.products.groupBy({
            by: ['category'],
            _count: true,
            _avg: { price: true},
            _min: { price: true},
            _max: { price: true},
        });
        res.json(result);
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).json({error: 'Internal server error'});
    }
}


//პროდუქტის ყიდვა იუზერის მიერ
async function  buyProduct(req, res) {
    try {
        const { id } = req.params;
        const  userId  = req.user.id;


        //check user
        const user = await prisma.user.findUnique({
            where: {id: parseInt(userId)},
        });
        if (!user) {
            return res.status(404).json({error: 'USER not found'});
        }

        //check product
        const product = await prisma.products.findUnique({
            where: {id: parseInt(id)},
        });
        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }

        //check stock
        if (product.stock <= 0) {
            return res.status(404).json({error: 'Product is out of stock'});
        }

        //update stock
        await prisma.products.update({
            where: {id: parseInt(id)},
            data: {stock: product.stock - 1 },
        });


        const userProduct = await prisma.usersProducts.create({
            data: {userId, productId: parseInt(id)},
        });
        res.status(201).json({message: 'Product bought successfully ! '});
    } catch (err) {
        console.log('Error executing query', err.stack);
        res.status(500).json({error: 'Internal server error'});
    }
}



export {
    getProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategoryStats,
    buyProduct};