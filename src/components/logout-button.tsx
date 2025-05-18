import { useLogout } from "../atoms/session";

export function LogoutButton() {
  const logout = useLogout();

  const handleLogout = () => {
    const ok = confirm("ログアウトしますか？");
    if (ok) {
      logout();
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleLogout}>
      ログアウト
    </button>
  );
}
