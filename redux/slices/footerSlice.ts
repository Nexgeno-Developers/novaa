import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Link {
  _id?: string;
  label: string;
  url: string;
}

export interface SocialLink {
  _id?: string;
  name:
    | "whatsapp"
    | "facebook"
    | "instagram"
    | "twitter"
    | "linkedin"
    | "snapchat"
    | "tiktok"
    | "youtube"
    | "telegram"
    | "pinterest"
    | "reddit"
    | "discord"
    | "tumblr"
    | "wechat";
  url: string;
}

export interface FooterData {
  _id?: string;
  sectionId: string;
  bgImageOne: string;
  bgImageTwo: string;
  bgImageThree: string;
  tagline: {
    title: string;
    subtitle: string;
    description: string;
  };
  ctaButtonLines: string[];
  about: {
    title: string;
    description: string;
  };
  quickLinks: {
    title?: string;
    links: Link[];
  };
  contact: {
    phone: string;
    email: string;
  };
  socials: {
    title?: string;
    links: SocialLink[];
  };
  copyrightText: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface FooterState {
  data: FooterData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FooterState = {
  data: null,
  status: "idle",
  error: null,
};

// Helper function to validate and clean data before sending

const validateFooterData = (data: Partial<FooterData>): Partial<FooterData> => {
  console.log("validateFooterData - start", { data });

  const cleanData = JSON.parse(JSON.stringify(data));
  try {
    console.log("validateFooterData - after shallow copy", { cleanData });

    // -------- Quick Links --------
    console.log(
      "validateFooterData - quickLinks exists?",
      !!cleanData.quickLinks,
      cleanData.quickLinks
    );

    if (Array.isArray(cleanData.quickLinks?.links)) {
      console.log(
        "validateFooterData - quickLinks.links length before",
        cleanData.quickLinks.links.length
      );

      const newQuickLinks: Link[] = [];

      cleanData.quickLinks.links.forEach(
        (
          link: { label: string; url: string; _id: string | undefined },
          idx: any
        ) => {
          console.log(`quickLinks - processing index ${idx}`, link);

          const label =
            typeof link.label === "string" ? link.label.trim() : link.label;
          const url = typeof link.url === "string" ? link.url.trim() : link.url;

          if (!label || label === "") {
            console.warn(`quickLinks - skipping index ${idx} - invalid label`, {
              label,
              idx,
            });
            return;
          }

          if (!url || url === "") {
            console.warn(`quickLinks - skipping index ${idx} - invalid url`, {
              url,
              idx,
            });
            return;
          }

          const cleanLink: Link = {
            label,
            url,
          };

          if (
            link._id &&
            typeof link._id === "string" &&
            link._id.trim() !== ""
          ) {
            cleanLink._id = link._id;
            console.log(`quickLinks - index ${idx} has valid _id`, link._id);
          } else {
            console.log(`quickLinks - index ${idx} is new (no _id)`);
          }

          console.log(`quickLinks - kept index ${idx}`, cleanLink);
          newQuickLinks.push(cleanLink);
        }
      );

      cleanData.quickLinks.links = newQuickLinks;
      console.log(
        "validateFooterData - quickLinks.links after cleaning",
        cleanData.quickLinks.links.length,
        cleanData.quickLinks.links
      );
    } else {
      console.log(
        "validateFooterData - quickLinks.links is not an array or missing",
        cleanData.quickLinks?.links
      );
      // optional: ensure it's an array so downstream code is consistent
      cleanData.quickLinks = { ...(cleanData.quickLinks || {}), links: [] };
    }

    console.log("validateFooterData - middle");

    // -------- Social Links --------
    console.log(
      "validateFooterData - socials exists?",
      !!cleanData.socials,
      cleanData.socials
    );

    if (Array.isArray(cleanData.socials?.links)) {
      console.log(
        "validateFooterData - socials.links length before",
        cleanData.socials.links.length
      );

      const validPlatforms: Array<SocialLink["name"]> = [
        "whatsapp",
        "facebook",
        "instagram",
        "twitter",
        "linkedin",
        "snapchat",
        "tiktok",
        "youtube",
        "telegram",
        "pinterest",
        "reddit",
        "discord",
        "tumblr",
        "wechat",
      ];

      const newSocialLinks: SocialLink[] = [];

      cleanData.socials.links.forEach(
        (
          link: { name: any; url: string; _id: string | undefined },
          idx: any
        ) => {
          console.log(`socials - processing index ${idx}`, link);

          const name: string = link.name;
          const url = typeof link.url === "string" ? link.url.trim() : link.url;

          if (!name || typeof name !== "string") {
            console.warn(`socials - skipping index ${idx} - invalid name`, {
              name,
              idx,
            });
            return;
          }

          if (!validPlatforms.includes(name as SocialLink["name"])) {
            console.warn(
              `socials - skipping index ${idx} - unsupported platform`,
              { name, idx }
            );
            return;
          }

          if (!url || url === "") {
            console.warn(`socials - skipping index ${idx} - empty url`, {
              url,
              idx,
            });
            return;
          }

          const cleanLink: SocialLink = {
            name: name as SocialLink["name"],
            url,
          };

          if (
            link._id &&
            typeof link._id === "string" &&
            link._id.trim() !== ""
          ) {
            cleanLink._id = link._id;
            console.log(`socials - index ${idx} has valid _id`, link._id);
          } else {
            console.log(`socials - index ${idx} is new (no _id)`);
          }

          console.log(`socials - kept index ${idx}`, cleanLink);
          newSocialLinks.push(cleanLink);
        }
      );

      cleanData.socials.links = newSocialLinks;
      console.log(
        "validateFooterData - socials.links after cleaning",
        cleanData.socials.links.length,
        cleanData.socials.links
      );
    } else {
      console.log(
        "validateFooterData - socials.links is not an array or missing",
        cleanData.socials?.links
      );
      cleanData.socials = { ...(cleanData.socials || {}), links: [] };
    }

    console.log("validateFooterData - before return", cleanData);
    return cleanData;
  } catch (err) {
    console.error("validateFooterData - unexpected error", err);
    // Return whatever we have but you can rethrow if you prefer the caller to handle it
    return cleanData;
  }
};

// Async Thunks
export const fetchFooterData = createAsyncThunk(
  "footer/fetchData",
  async () => {
    const response = await axios.get("/api/cms/footer");
    return response.data;
  }
);

export const updateFooterData = createAsyncThunk(
  "footer/updateData",
  async (data: Partial<FooterData>, { rejectWithValue }) => {
    try {
      console.log("data", data);
      const validatedData = validateFooterData(data);
      console.log("validated data", data);

      const response = await axios.put("/api/cms/footer", validatedData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || "Failed to update footer"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const footerSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {
    clearFooterError: (state) => {
      state.error = null;
    },
    resetFooterStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Footer Data
      .addCase(fetchFooterData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFooterData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchFooterData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch footer data";
      })
      // Update Footer Data
      .addCase(updateFooterData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateFooterData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateFooterData.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to update footer data";
      });
  },
});

export const { clearFooterError, resetFooterStatus } = footerSlice.actions;
export default footerSlice.reducer;
