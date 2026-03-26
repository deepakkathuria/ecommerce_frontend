"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar, Footer } from "@/components";

export default function ProfileLayout({ children }) {
  const pathname = usePathname();

  const linkClass = (path) =>
    pathname === path ? "list-group-item active fw-bold" : "list-group-item";

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">My Profile</h1>
        <hr />
        <div className="row">
          <div className="col-md-3">
            <ul className="list-group">
              <li className={linkClass("/profile/details")}>
                <Link href="/profile/details" className="text-decoration-none text-reset">
                  User Details
                </Link>
              </li>
              <li className={linkClass("/profile/orders")}>
                <Link href="/profile/orders" className="text-decoration-none text-reset">
                  My Orders
                </Link>
              </li>
              <li className={linkClass("/profile/settings")}>
                <Link href="/profile/settings" className="text-decoration-none text-reset">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-9">
            <div className="card p-4">{children}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
