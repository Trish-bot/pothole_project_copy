// src/pages/Login.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import InputOTP from "../components/ui/InputOTP";

import { sendOtpAPI, verifyOtpAPI } from "../api/auth";

const Login = () => {

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // ================= SEND OTP =================
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    if (!email.includes("@")) {
      alert("Enter a valid email");
      return;
    }

    try {
      setLoading(true);

      const res = await sendOtpAPI(email);

      console.log("OTP API response:", res.data);

      setOtpSent(true);
      setOtp("");

      alert("OTP sent successfully 📩");

    } catch (err) {
      console.error("Send OTP error:", err);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length < 4) {
      alert("Enter valid OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await verifyOtpAPI(email, otp);

      const token = res.data.token;

      if (!token) {
        alert("Login failed");
        return;
      }

      localStorage.setItem("token", token);

      alert("Login successful 🎉");

      navigate("/dashboard");

    } catch (err) {
      console.error("Verify OTP error:", err);
      alert("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND OTP =================
  const handleResend = async () => {
    try {
      setLoading(true);

      await sendOtpAPI(email);

      alert("OTP resent 📩");

    } catch (err) {
      console.error(err);
      alert("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex flex-1 items-center justify-center px-6 py-12">

        <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-10">

          {/* Title */}
          <div className="text-center mb-10">
            <MapPin className="mx-auto mb-4 text-gray-800" size={36} />
            <h2 className="text-3xl font-bold text-gray-900">
              Login to RoadWatch
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Access your dashboard securely
            </p>
          </div>

          {!otpSent ? (

            // ================= EMAIL FORM =================
            <form onSubmit={handleSendOtp} className="space-y-6">

              <div>
                <Label>Email Address</Label>

                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white hover:bg-gray-800 py-3"
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>

            </form>

          ) : (

            // ================= OTP FORM =================
            <form onSubmit={handleVerifyOtp} className="space-y-6">

              <p className="text-sm text-center text-gray-600">
                Enter OTP sent to <b>{email}</b>
              </p>

              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={4}
              />

              <Button
                type="submit"
                disabled={otp.length < 4 || loading}
                className="w-full bg-gray-900 text-white hover:bg-gray-800 py-3"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>

              <button
                type="button"
                onClick={handleResend}
                className="text-sm underline w-full text-center"
              >
                Resend OTP
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-sm text-gray-500 w-full"
              >
                Change Email
              </button>

            </form>

          )}

          <p className="text-center text-sm mt-10 text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-medium hover:underline">
              Sign Up
            </Link>
          </p>

        </div>

      </main>

    </div>
  );
};

export default Login;