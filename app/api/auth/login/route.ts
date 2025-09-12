import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { signToken, createAuthResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isValidPassword = await admin.comparePassword(password);
    console.log(isValidPassword);
    if (!isValidPassword) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({
      adminId: admin._id.toString(), // ensure string
      email: admin.email,
    });
    return createAuthResponse(token, admin);
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
