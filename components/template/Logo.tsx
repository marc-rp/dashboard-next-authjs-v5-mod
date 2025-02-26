import { BoxesIcon } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <div>
      <Link href="/">
        <div>
          <div>A Z</div>
          <BoxesIcon size={40} stroke="1" className="" />
        </div>
      </Link>
    </div>
  );
}
