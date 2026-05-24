"use strict";
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class Termii {
  constructor() {
    this.apiKey = process.env.SMSAPI_APIKEY;
    
    // Safely remove any trailing slash or `/api` from the .env variable if it exists
    let base = process.env.SMSAPI_BASEURL || 'https://api.ng.termii.com';
    this.baseUrl = base.replace(/\/api\/?$/, '').replace(/\/$/, '');
    
    this.senderId = process.env.SMSAPI_SENDERID || 'Tolaram';
    this.channel = process.env.SMSAPI_CHANNEL || 'dnd';
  }

  formatPhone(phone) {
    let clean = String(phone).replace(/\D/g, ''); 
    if (clean.startsWith('0') && clean.length === 11) {
        clean = '234' + clean.substring(1);
    } else if (clean.length === 10) {
        clean = '234' + clean;
    }
    return clean;
  }

  // ═══════════════════════════════════════════════
  // STANDARD SMS SEND (plain text message)
  // ═══════════════════════════════════════════════
  async sendSMS(to, message) {
    if (!this.apiKey) {
        console.error('[Termii] ERROR: SMSAPI_APIKEY missing from environment');
        throw new Error('SMSAPI_APIKEY missing');
    }

    const payload = {
      api_key: this.apiKey,
      to: this.formatPhone(to),
      from: this.senderId,
      sms: message,
      type: "plain",
      channel: this.channel
    };

    try {
      console.log(`[Termii] Sending SMS to ${payload.to} via ${this.channel} channel...`);
      const response = await axios.post(`${this.baseUrl}/api/sms/send`, payload);
      return response.data;
    } catch (error) {
      const msg = error.response ? error.response.data : error.message;
      console.error('[Termii] SMS API Error:', JSON.stringify(msg, null, 2));
      throw new Error(`Termii SMS Error: ${JSON.stringify(msg)}`);
    }
  }

  // ═══════════════════════════════════════════════
  // VOICE TOKEN OTP — Termii generates the OTP and calls the user
  // Returns { pinId } needed for verification via Termii Verify Token API
  // ═══════════════════════════════════════════════
  async sendVoiceOTP(to) {
    if (!this.apiKey) {
        console.error('[Termii] ERROR: SMSAPI_APIKEY missing from environment');
        throw new Error('SMSAPI_APIKEY missing');
    }

    const payload = {
      api_key: this.apiKey,
      phone_number: this.formatPhone(to),
      pin_attempts: 3,
      pin_time_to_live: 5,   // 5 minutes
      pin_length: 4,          // 4-digit OTP
    };

    try {
      console.log(`[Termii] Sending VOICE OTP to ${payload.phone_number}...`);
      const response = await axios.post(`${this.baseUrl}/api/sms/otp/send/voice`, payload);
      const data = response.data;
      
      if (data.code !== 'ok' && !data.pinId) {
        throw new Error(`Termii Voice OTP response unexpected: ${JSON.stringify(data)}`);
      }

      console.log(`[Termii] VOICE OTP sent successfully. pinId: ${data.pinId}`);
      return {
        success: true,
        pinId: data.pinId,
        messageId: data.message_id,
        balance: data.balance,
      };
    } catch (error) {
      const msg = error.response ? error.response.data : error.message;
      console.error('[Termii] Voice OTP Error:', JSON.stringify(msg, null, 2));
      throw new Error(`Termii Voice OTP Error: ${JSON.stringify(msg)}`);
    }
  }

  // ═══════════════════════════════════════════════
  // VERIFY TOKEN — Verify OTP via Termii's Verify Token API
  // Only works for OTPs sent via Termii's standard generation flow
  // ═══════════════════════════════════════════════
  async verifyToken(pinId, pin) {
    if (!this.apiKey) {
      console.error('[Termii] ERROR: SMSAPI_APIKEY missing from environment');
      throw new Error('SMSAPI_APIKEY missing');
    }

    const payload = {
      api_key: this.apiKey,
      pin_id: pinId,
      pin: String(pin),
    };

    try {
      console.log(`[Termii] Verifying token for pinId: ${pinId}...`);
      const response = await axios.post(`${this.baseUrl}/api/sms/otp/verify`, payload);
      const data = response.data;
      
      console.log(`[Termii] Verify response:`, JSON.stringify(data));
      return {
        verified: data.verified === 'True' || data.verified === true,
        pinId: data.pinId,
        msisdn: data.msisdn,
      };
    } catch (error) {
      const msg = error.response ? error.response.data : error.message;
      console.error('[Termii] Verify Token Error:', JSON.stringify(msg, null, 2));
      throw new Error(`Termii Verify Error: ${JSON.stringify(msg)}`);
    }
  }

  // Legacy SMS OTP
  async sendOTP(to, otp) {
    const message = `Your Munch It personality quiz verification code is ${otp}. Valid for 10 minutes.`;
    return this.sendSMS(to, message);
  }
}

const termiiInstance = new Termii();
export default termiiInstance;
export const sendOTP = (phone, otp) => termiiInstance.sendOTP(phone, otp);
export const sendVoiceOTP = (phone) => termiiInstance.sendVoiceOTP(phone);
export const verifyToken = (pinId, pin) => termiiInstance.verifyToken(pinId, pin);
