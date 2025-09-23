import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Footer from "@/models/Footer";
import { revalidateTag } from "next/cache";

// GET: Fetch the global footer settings
export async function GET() {
  await dbConnect();
  try {
    let footer = await Footer.findOne({});
    // If no footer settings exist, create a default one
    if (!footer) {
      footer = await new Footer().save();
    }
    return NextResponse.json(footer, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch footer data", details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT: Update the global footer settings
export async function PUT(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();

    // console.log("Body", body);

    // Minimal preprocessing - just ensure lowercase for social platform names
    if (body.socials?.links) {
      body.socials.links = body.socials.links.map((link: any) => ({
        ...link,
        name: link.name?.toLowerCase()
      }));
    }

    const updatedFooter = await Footer.findOneAndUpdate(
      {}, // Empty filter targets the single document
      body,
      { new: true, upsert: true, runValidators: true }
    );

    revalidateTag("footer");

    // console.log("Updated Footer");

    return NextResponse.json(updatedFooter, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to update footer data", details: errorMessage },
      { status: 500 }
    );
  }
}