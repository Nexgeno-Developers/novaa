import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Settings, AlertTriangle } from 'lucide-react'

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              {/* Icon and Status */}
              <div className="flex justify-center">
                <div className="bg-red-100 p-4 rounded-full">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
              </div>

              {/* Error Message */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Admin Page Not Found
                </h1>
                <p className="text-gray-600">
                  The admin page you're looking for doesn't exist or has been moved.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                </Button>
                
                <Button variant="outline" onClick={() => window.history.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>

              {/* Admin Quick Links */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-3">Admin Quick Links:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Link 
                    href="/admin/projects" 
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Projects
                  </Link>
                  <Link 
                    href="/admin/blogs" 
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Blogs
                  </Link>
                  <Link 
                    href="/admin/media" 
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Media
                  </Link>
                  <Link 
                    href="/admin/enquiries" 
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Enquiries
                  </Link>
                </div>
              </div>

              {/* Back to Public Site */}
              <div className="pt-4 border-t">
                <Button variant="ghost" asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Back to Main Site
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}