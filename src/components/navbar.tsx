export function Navbar() {
  return (
    <div className="navbar gap-4 bg-primary shadow-sm text-primary-content">
      <div className="flex-1">
        <div className="flex">
          <img
            src={import.meta.env.BASE_URL + "icon.png"}
            alt="PDS WebUI Icon"
            className="h-8 w-8 mr-2 brightness-0"
          />
          <span className="text-xl font-bold">PDS Admin</span>
        </div>
      </div>
    </div>
  );
}
