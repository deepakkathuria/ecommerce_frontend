"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { syncCart } from "@/redux/action";
import { apiUrl } from "@/lib/apiBase";

export default function FetchCartOnLoad() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("apitoken");
    if (!token) return;

    fetch(apiUrl("/cart"), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(syncCart(data.cartItems || []));
      })
      .catch((err) => console.error("Error fetching cart:", err));
  }, [dispatch]);

  return null;
}
