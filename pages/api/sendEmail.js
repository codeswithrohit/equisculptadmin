import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, name, status } = req.body;

  // Check if the email address is provided
  if (!email) {
    return res.status(400).json({ message: "Email address is required" });
  }

  // Create a Nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hrohit320@gmail.com", // Your email address
      pass: "fmyhsearwbhwcwct", // Your email password
    },
  });

  try {
    // Email content
    const info = await transporter.sendMail({
      from: "hrohit320@gmail.com", // Sender address
      to: email, // Receiver address
      subject: "Verification Confirmation By Equisculpt", // Subject line
      html: `
        <div class="bg-white rounded-lg shadow-md p-6">
          <h1 class="text-2xl font-bold mb-4">Account Activation Status</h1>
          <p class="text-lg">Dear ${name},</p>
          <p class="text-lg">Your account activation status is: ${status}</p>
          <div class="mt-6 text-sm text-gray-600">
            <p>Best regards,</p>
            <p class="text-red-600">Equisculpt</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent: %s", info.messageId);

    // Send response with a confirmation message
    return res.status(200).json({ message: "Booking confirmed. Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
