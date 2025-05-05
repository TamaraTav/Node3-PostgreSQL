import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  sendEmail  from '../utils/emailService.js'



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

//პროფილის სურათის ატვირთვა
export const uploadProfilePicture = async (req, res) => {
     const { id } = req.params;
     if(!req.file) {
         return res.status(400).json({message:'No file uploaded'});
     }
    const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { profilePicture: req.file.path },
    });
    res.json(user);
}


export const deleteUser = async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({
        where: { id: parseInt(id) },
    });
};

//sign up
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

    /////ემეილის გაგზავნა მოგვაქვს util-იდან ა ვუცვლით email-ს, subject-s da html-s, რომ დინამიური იყოს
    try {
        const isEmailSent = await  sendEmail(
            email,
            'OTP CODE for password reset',
            `<h1>Password Reset OTP Code</h1>
        <p>You requested a password reset. Use the following OTP code to reset your password:</p>
        <h2 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; text-align: center;">${otpCode}</h2>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
            `,
        );
        if (isEmailSent) {
            res.json({message: 'OTP sent to email Successfully', otpCode});
        } else {
            res.status(500).json({ message: 'Faild to send email' });
        }
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Faild to send email' });
    }
}


//როცა შეიყვანს სწორ OTP კოდს, მერე პაროლის გამახლებას ვუკეთებთ
export const resetPassword = async (req, res) => {
    const { email, otpCode, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
        return res.status(401).json({ message: 'User not found !' });
    }
    if (user.otpCode !== otpCode || user.otpExpiry < new Date() ) {
        return res.status(401).json({ message: 'Invalid OTP Code or Time has passed !' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: {id: user.id},
        data: { password: hashedPassword, otpCode: null, otpExpiry : null},
        //პაროლის განახლების მერე კოდიც და ვადაც გავანულე ბაზაში
    });
    res.json({message: 'Password reset successfully' });
}




