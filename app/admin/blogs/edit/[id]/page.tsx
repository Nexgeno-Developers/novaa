// app/admin/blogs/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import ClientWrapper from "@/components/admin/ClientWrapper";
import BlogForm from "@/components/admin/BlogForm";
import { RootState } from "@/redux";
import { fetchBlogs, Blog } from "@/redux/slices/blogsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function EditBlogContent() {
  const params = useParams();
  const blogId = params.id as string;
  const dispatch = useAppDispatch();
  const { blogs, loading } = useSelector((state: RootState) => state.blogs);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(fetchBlogs({ page: 1, limit: 100 }));
    }
  }, [dispatch, blogs.length]);

  useEffect(() => {
    if (blogs.length > 0 && blogId) {
      const blog = blogs.find((b) => b._id === blogId);
      if (blog) {
        setCurrentBlog(blog);
      }
    }
  }, [blogs, blogId]);

  if (loading || !currentBlog) {
    return (
      <Card className="bg-sidebar ring-2 ring-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading blog...
          </div>
        </CardContent>
      </Card>
    );
  }

  return <BlogForm blog={currentBlog} isEdit={true} />;
}

export default function EditBlogPage() {
  return (
    <ClientWrapper>
      <EditBlogContent />
    </ClientWrapper>
  );
}
