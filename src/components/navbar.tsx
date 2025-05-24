export function Navbar() {
  return (
    <div className="navbar bg-primary text-primary-content gap-4 shadow-sm">
      <div className="flex-1">
        <div className="flex">
          <img
            src={import.meta.env.BASE_URL + "icon.png"}
            alt="PDS WebUI Icon"
            className="mr-2 h-8 w-8 brightness-0"
          />
          <span className="text-xl font-bold">PDS Admin</span>
        </div>
      </div>
    </div>
  );
}
