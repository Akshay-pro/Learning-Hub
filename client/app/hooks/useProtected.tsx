import { redirect } from "next/navigation";
import userAuth from "./userAuth";

interface ProtectedProps {
    children: React.ReactNode;
}
export default function Protected({ children }: ProtectedProps) {
    const isAuthentication = userAuth();

    return isAuthentication ? children : redirect("/");
}
