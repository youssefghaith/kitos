export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">KITOS Admin</h1>
        <p className="text-sm text-gray-600">
          Admin access is protected by Cloudflare Access. If you can see this page,
          you should be able to visit <span className="font-semibold">/admin</span>.
        </p>
      </div>
    </div>
  );
}
