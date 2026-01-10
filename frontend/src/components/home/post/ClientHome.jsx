"use client";

import dynamic from "next/dynamic";

const Home = dynamic(() => import("./post"), { ssr: false });

export default function ClientHome(props) {
    return <Home {...props} />;
}
