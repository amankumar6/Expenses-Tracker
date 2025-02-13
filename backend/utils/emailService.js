const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendResetPasswordEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
        from: `"Expenses Tracker" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://res.cloudinary.com/dbvthtwhc/image/upload/v1739463072/Expense%20Tracker/Screenshot_2025-02-13_213801_slb0cx.png" alt="Expenses Tracker Logo" style="max-width: 150px;">
                </div>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                    <p style="color: #666; line-height: 1.6;">Hello,</p>
                    <p style="color: #666; line-height: 1.6;">We received a request to reset your password for your Expenses Tracker account. To reset your password, click the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="color: #666; line-height: 1.6;">If you didn't request this password reset, please ignore this email. The link will expire in 1 hour for security reasons.</p>
                    <p style="color: #666; line-height: 1.6;">Best regards,<br>The Expenses Tracker Team</p>
                </div>
                <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                    <p>This is an automated email, please do not reply.</p>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendResetPasswordEmail
};
