// components/DynamicWalletButton.jsx
import { usePrivy, useLogin } from "@privy-io/react-auth";

export default function DynamicWalletButton() {
  const { login, logout } = useLogin();
  const { user, authenticated } = usePrivy();

  if (!authenticated) {
    return (
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={login}
      >
        Login
      </button>
    );
  }

  return (
    <button
      className="bg-gray-200 text-black px-4 py-2 rounded"
      onClick={logout}
    >
      {user?.email || user?.wallet?.address?.slice(0, 6)}... Logout
    </button>
  );
}
