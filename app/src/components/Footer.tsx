import { Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="text-center text-pink-300 text-xs py-4 flex items-center justify-center gap-1">
            Made with{" "}
            <Heart size={12} className="fill-pink-500 text-pink-300" /> just for
            you
        </footer>
    );
}
