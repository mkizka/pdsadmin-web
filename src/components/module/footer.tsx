export function Footer() {
  return (
    <footer className="card card-sm rounded-box bg-base-100 shadow-md">
      <div className="card-body flex-row justify-center">
        <a
          href="https://bsky.app/profile/mkizka.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-square"
          aria-label="Bluesky"
        >
          <span className="i-simple-icons-bluesky size-6"></span>
        </a>
        <a
          href="https://github.com/mkizka/pdsadmin-web"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-square"
          aria-label="GitHub"
        >
          <span className="i-simple-icons-github size-6"></span>
        </a>
      </div>
    </footer>
  );
}
