import { useSession } from "../utils/session";

export function SessionStatus() {
  const session = useSession();
  const hostname = new URL(session.service).hostname;
  return (
    <div className="font-bold">
      PDS:
      <span className="ml-2">{hostname}</span>
    </div>
  );
}
