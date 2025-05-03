import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
    const { firstName, lastName, email, roleId } = req.body;
    const user = await prisma.user.create({
        data: { firstName, lastName, email, roleId },
    });
    res.json(user);
};

export const getUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        include: { usersProducts: { include: { product: true } } },
    });
    res.json(users);
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
    });
    res.json(user);
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { firstName, lastName, email },
    });
    res.json(user);
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({
        where: { id: parseInt(id) },
    });
};

//პრობლემაა ჰეშირებისას სალტ არ მოსწონს!!!!!!!!!!!!!!!!
export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    //პაროლის ჰეშირება
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { firstName, lastName, email, password: hashedPassword },
    });
    res.json(user);
};

//იუზერის შესვლა სისტემაში Sign in
export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email }, include: {roles: true } });
    if(!user) {
        return res.status(401).json({ message: 'No User found.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    //ტოკენის შექმნის ლოგიკა
    const token = jwt.sign({ id: user.id, role: user.roles.name }, process.env.JWT_SECRET,
        {expiresIn: '1h'});

    delete user.password;

    res.json({ message: 'User signed in successfully', token, user });
};






//როცა მომხმარებელი მოითხოვს პაროლის აღდგენას, ვუგენერირებთ otpCode-ს
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
        return res.status(401).json({ message: 'User not found !!!' });
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); //აქ ვაკეთებს კოდის დაგენერირებას
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // ვადა გაუვა ამ მომენტიდან 5 წუთში
    await prisma.user.update({
        where: { id: user.id },
        data: { otpCode, otpExpiry },
    });

    //მეილის გაგზავნა
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP CODE for password reset',
        text: `Your OTP for password reset is ${otpCode}`,
    };
    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sending to email', otpCode });
    } catch (error) {
        console.error('Error sending to email', error);
        res.status(500).json({ message: 'Faild to send email' });
    }

    res.json({message: 'OTP sent to email Successfully', });



}

