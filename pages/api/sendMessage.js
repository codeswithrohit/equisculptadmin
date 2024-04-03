// pages/api/sendMessage.js

import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
  }

  const { body } = req.body;
console.log(body)
  const twilioAccountSid = 'AC506a5001d4e3859a2b62964bbbfca27e';
  const twilioAuthToken = 'f3930a766c9bddaebb5c2fd9e5fc6381';
  const twilioPhoneNumber = '+14155238886';
  

  const client = twilio(twilioAccountSid, twilioAuthToken);

  try {
    const message = await client.messages.create({
      body,
      from: `whatsapp:+14155238886`,
      to: `whatsapp:+917667411501`
    });
    
    console.log('Message SID:', message.sid);
    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: 'Error sending message' });
  }
}
