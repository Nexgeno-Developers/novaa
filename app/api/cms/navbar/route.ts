// import { NextRequest } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Navbar from "@/models/Navbar";
// import { getTokenFromRequest, verifyToken } from "@/lib/auth";
// import { revalidateTag } from 'next/cache';

// // GET - Fetch navbar data (public)
// export async function GET() {
//   try {
//     await connectDB();

//     let navbar = await Navbar.findOne();
//     if (!navbar) {
//       // Create default navbar if none exists
//       navbar = await Navbar.create({
//         logo: { url: "/images/logo.png", alt: "Novaa Real Estate" },
//         items: [
//           { label: "Home", href: "/", order: 1, isActive: true },
//           { label: "About Us", href: "/about-us", order: 2, isActive: true },
//           { label: "Projects", href: "/project", order: 3, isActive: true },
//           { label: "Blog", href: "/blog", order: 4, isActive: true },
//           {
//             label: "Contact Us",
//             href: "/contact-us",
//             order: 5,
//             isActive: true,
//           },
//         ],
//       });
//     }

//     return Response.json(navbar);
//   } catch (error) {
//     console.error("Navbar fetch error:", error);
//     return Response.json({ message: "Internal server error" }, { status: 500 });
//   }
// }

// // PUT - Update navbar (admin only)
// export async function PUT(request: NextRequest) {
//   try {
//     await connectDB();

//     // Verify admin authentication
//     const token = getTokenFromRequest(request);
//     if (!token || !verifyToken(token)) {
//       return Response.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const updateData = await request.json();

//     let navbar = await Navbar.findOne();
//     if (!navbar) {
//       navbar = new Navbar(updateData);
//     } else {
//       Object.assign(navbar, updateData);
//     }

//     await navbar.save();

//     revalidateTag("navbar");

//     return Response.json(navbar);
//   } catch (error) {
//     console.error("Navbar update error:", error);
//     return Response.json({ message: "Internal server error" }, { status: 500 });
//   }
// }
import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Navbar from "@/models/Navbar";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { revalidateTag } from "next/cache";

// GET - Fetch navbar data (public)
export async function GET() {
  try {
    await connectDB();

    let navbar = await Navbar.findOne();
    if (!navbar) {
      // Create default navbar if none exists
      navbar = await Navbar.create({
        logo: { url: "/images/logo.png", alt: "Novaa Real Estate" },
        items: [
          {
            label: "Home",
            href: "/",
            order: 1,
            isActive: true,
            submenu: [],
          },
          {
            label: "About Us",
            href: "/about-us",
            order: 2,
            isActive: true,
            submenu: [
              {
                label: "Our Story",
                href: "/about-us/story",
                order: 1,
                isActive: true,
              },
              {
                label: "Our Team",
                href: "/about-us/team",
                order: 2,
                isActive: true,
              },
              {
                label: "Careers",
                href: "/about-us/careers",
                order: 3,
                isActive: true,
              },
            ],
          },
          {
            label: "Projects",
            href: "/project",
            order: 3,
            isActive: true,
            submenu: [
              {
                label: "Residential",
                href: "/project/residential",
                order: 1,
                isActive: true,
              },
              {
                label: "Commercial",
                href: "/project/commercial",
                order: 2,
                isActive: true,
              },
              {
                label: "Upcoming",
                href: "/project/upcoming",
                order: 3,
                isActive: true,
              },
            ],
          },
          {
            label: "Blog",
            href: "/blog",
            order: 4,
            isActive: true,
            submenu: [],
          },
          {
            label: "Contact Us",
            href: "/contact-us",
            order: 5,
            isActive: true,
            submenu: [],
          },
        ],
      });
    }

    return Response.json(navbar);
  } catch (error) {
    console.error("Navbar fetch error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update navbar (admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updateData = await request.json();

    // Process items to ensure submenu structure is correct
    if (updateData.items) {
      updateData.items = updateData.items.map((item: { submenu: any[] }) => {
        // Ensure submenu is always an array
        if (!item.submenu) {
          item.submenu = [];
        }

        // Sort submenu items by order
        if (item.submenu.length > 0) {
          item.submenu = item.submenu.sort((a, b) => a.order - b.order);
        }

        return item;
      });

      // Sort main items by order
      updateData.items = updateData.items.sort(
        (a: { order: number }, b: { order: number }) => a.order - b.order
      );
    }

    let navbar = await Navbar.findOne();
    if (!navbar) {
      navbar = new Navbar(updateData);
    } else {
      Object.assign(navbar, updateData);
    }

    await navbar.save();

    revalidateTag("navbar");

    return Response.json(navbar);
  } catch (error) {
    console.error("Navbar update error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update specific submenu items (admin only)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { action, parentId, submenuId, submenuData } = await request.json();

    let navbar = await Navbar.findOne();
    if (!navbar) {
      return Response.json({ message: "Navbar not found" }, { status: 404 });
    }

    const parentItem = navbar.items.find(
      (item: { _id: { toString: () => any } }) =>
        item._id.toString() === parentId
    );
    if (!parentItem) {
      return Response.json(
        { message: "Parent item not found" },
        { status: 404 }
      );
    }

    switch (action) {
      case "add":
        if (!parentItem.submenu) {
          parentItem.submenu = [];
        }
        parentItem.submenu.push({
          ...submenuData,
          order: parentItem.submenu.length + 1,
        });
        break;

      case "update":
        const submenuIndex = parentItem.submenu.findIndex(
          (sub: { _id: { toString: () => any } }) =>
            sub._id.toString() === submenuId
        );
        if (submenuIndex === -1) {
          return Response.json(
            { message: "Submenu item not found" },
            { status: 404 }
          );
        }
        Object.assign(parentItem.submenu[submenuIndex], submenuData);
        break;

      case "delete":
        parentItem.submenu = parentItem.submenu.filter(
          (sub: { _id: { toString: () => any; }; }) => sub._id.toString() !== submenuId
        );
        // Reorder remaining submenu items
        parentItem.submenu.forEach((sub: { order: any; }, index: number) => {
          sub.order = index + 1;
        });
        break;

      default:
        return Response.json({ message: "Invalid action" }, { status: 400 });
    }

    await navbar.save();
    revalidateTag("navbar");

    return Response.json(navbar);
  } catch (error) {
    console.error("Navbar patch error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
